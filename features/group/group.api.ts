import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database";
import type {
	CreateGroupResult,
	CreateInvitationResult,
	Group,
	GroupMemberWithUser,
	JoinGroupResult,
} from "./types";

const generateInvitationToken = (): string => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

const hashToken = (token: string): string => {
	// シンプルなハッシュ関数（React Native互換）
	// 本番環境ではexpo-cryptoなどのライブラリを使用することを推奨
	let hash = 5381;
	for (let i = 0; i < token.length; i++) {
		hash = (hash * 33) ^ token.charCodeAt(i);
	}
	// 64文字のハッシュ値を生成（より安全性を高めるため）
	const hash1 = (hash >>> 0).toString(16).padStart(8, "0");
	const hash2 = ((hash * 31) >>> 0).toString(16).padStart(8, "0");
	const hash3 = ((hash * 37) >>> 0).toString(16).padStart(8, "0");
	const hash4 = ((hash * 41) >>> 0).toString(16).padStart(8, "0");
	return `${hash1}${hash2}${hash3}${hash4}`;
};

export const createGroup = async (
	supabase: SupabaseClient<Database>,
	userId: string,
	groupName: string,
): Promise<CreateGroupResult> => {
	// 1. Create group
	const { data: group, error: groupError } = await supabase
		.from("groups")
		.insert({
			name: groupName,
			owner_user_id: userId,
		})
		.select()
		.single();

	if (groupError || !group) {
		throw new Error(
			`グループを作成できませんでした: ${groupError?.message || "Unknown error"}`,
		);
	}

	// 2. Add creator as group member
	const { error: memberError } = await supabase.from("group_members").insert({
		group_id: group.id,
		user_id: userId,
	});

	if (memberError) {
		// Rollback: delete group
		await supabase.from("groups").delete().eq("id", group.id);
		throw new Error(
			`グループメンバーの追加に失敗しました: ${memberError.message}`,
		);
	}

	// 3. Create default space (workspace)
	const { data: space, error: spaceError } = await supabase
		.from("spaces")
		.insert({
			group_id: group.id,
			name: `${groupName}のスペース`,
		})
		.select()
		.single();

	if (spaceError || !space) {
		// Rollback: delete group member and group
		await supabase.from("group_members").delete().eq("group_id", group.id);
		await supabase.from("groups").delete().eq("id", group.id);
		throw new Error(
			`スペースの作成に失敗しました: ${spaceError?.message || "Unknown error"}`,
		);
	}

	// 4. Create invitation with 24-hour expiry
	const invitationToken = generateInvitationToken();
	const tokenHash = hashToken(invitationToken);
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	const { data: invitation, error: invitationError } = await supabase
		.from("invitations")
		.insert({
			group_id: group.id,
			token: invitationToken,
			token_hash: tokenHash,
			expires_at: expiresAt.toISOString(),
		})
		.select()
		.single();

	if (invitationError || !invitation) {
		// Rollback: delete space, group member, and group
		await supabase.from("spaces").delete().eq("id", space.id);
		await supabase.from("group_members").delete().eq("group_id", group.id);
		await supabase.from("groups").delete().eq("id", group.id);
		throw new Error(
			`招待の作成に失敗しました: ${invitationError?.message || "Unknown error"}`,
		);
	}

	return {
		group,
		space,
		invitation,
		invitationToken,
	};
};

export const getUserGroups = async (
	supabase: SupabaseClient<Database>,
	userId: string,
): Promise<Group[]> => {
	const { data: memberships, error: membershipError } = await supabase
		.from("group_members")
		.select("group_id")
		.eq("user_id", userId);

	if (membershipError) {
		throw new Error(`グループの取得に失敗しました: ${membershipError.message}`);
	}

	if (!memberships || memberships.length === 0) {
		return [];
	}

	const groupIds = memberships.map((m) => m.group_id);

	const { data: groups, error: groupsError } = await supabase
		.from("groups")
		.select("*")
		.in("id", groupIds);

	if (groupsError) {
		throw new Error(`グループの取得に失敗しました: ${groupsError.message}`);
	}

	return groups || [];
};

export const generateInvitationLink = (token: string): string => {
	// TODO: Replace with actual app scheme or domain
	return `sato://invite/${token}`;
};

/**
 * 招待リンクからトークンを抽出する
 * 入力形式: "sato://invite/{token}" または "{token}"
 */
export const extractTokenFromLink = (input: string): string => {
	const trimmed = input.trim();
	const prefix = "sato://invite/";
	if (trimmed.startsWith(prefix)) {
		return trimmed.slice(prefix.length);
	}
	return trimmed;
};

/**
 * 招待トークンを使ってグループに参加する
 */
export const joinGroupByInvitation = async (
	supabase: SupabaseClient<Database>,
	userId: string,
	invitationToken: string,
): Promise<JoinGroupResult> => {
	// 1. ユーザーが既にグループに所属しているかチェック
	const existingGroups = await getUserGroups(supabase, userId);
	if (existingGroups.length > 0) {
		throw new Error("参加できるグループは1つまでです。");
	}

	// 2. トークンをハッシュ化して招待を検索
	const tokenHash = hashToken(invitationToken);
	const { data: invitation, error: invitationError } = await supabase
		.from("invitations")
		.select("*")
		.eq("token_hash", tokenHash)
		.single();

	if (invitationError || !invitation) {
		throw new Error(
			"この招待リンクは無効です。もう一度招待を依頼してください。",
		);
	}

	// 3. 有効期限をチェック
	const now = new Date();
	const expiresAt = new Date(invitation.expires_at);
	if (now > expiresAt) {
		throw new Error(
			"この招待リンクは無効です。もう一度招待を依頼してください。",
		);
	}

	// 4. グループメンバーに追加
	const { error: memberError } = await supabase.from("group_members").insert({
		group_id: invitation.group_id,
		user_id: userId,
	});

	if (memberError) {
		throw new Error(
			"グループに参加できませんでした。時間をおいて、もう一度お試しください。",
		);
	}

	// 5. グループ情報を取得して返す
	const { data: group, error: groupError } = await supabase
		.from("groups")
		.select("*")
		.eq("id", invitation.group_id)
		.single();

	if (groupError || !group) {
		throw new Error(
			"グループに参加できませんでした。時間をおいて、もう一度お試しください。",
		);
	}

	return { group };
};

/**
 * グループメンバー一覧を取得する（Viewを使用してユーザー名も取得）
 */
export const getGroupMembers = async (
	supabase: SupabaseClient<Database>,
	groupId: string,
): Promise<GroupMemberWithUser[]> => {
	// group_members_with_users Viewからデータを取得
	type GroupMemberView = Tables<"group_members_with_users">;
	const { data: members, error: membersError } = await supabase
		.from("group_members_with_users")
		.select("*")
		.eq("group_id", groupId)
		.order("joined_at", { ascending: true })
		.returns<GroupMemberView[]>();

	if (membersError) {
		throw new Error(
			"メンバー情報の取得に失敗しました。時間をおいて、もう一度お試しください。",
		);
	}

	// Viewから取得したデータをGroupMemberWithUser型にマッピング
	// Viewのカラムはnull許容だが、実際のデータではnullにならない
	const membersWithUser: GroupMemberWithUser[] = (members || [])
		.filter(
			(
				member,
			): member is typeof member & {
				id: string;
				user_id: string;
				group_id: string;
			} =>
				member.id !== null &&
				member.user_id !== null &&
				member.group_id !== null,
		)
		.map((member) => ({
			id: member.id,
			user_id: member.user_id,
			group_id: member.group_id,
			joined_at: member.joined_at,
			display_name: member.display_name || "名前未設定",
		}));

	return membersWithUser;
};

/**
 * 招待リンクを生成する（新規作成または再生成）
 * 有効期間が切れた場合は新しい招待リンクを生成する
 */
export const createInvitation = async (
	supabase: SupabaseClient<Database>,
	groupId: string,
): Promise<CreateInvitationResult> => {
	// 新しい招待トークンを生成
	const invitationToken = generateInvitationToken();
	const tokenHash = hashToken(invitationToken);
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	const { data: invitation, error: invitationError } = await supabase
		.from("invitations")
		.insert({
			group_id: groupId,
			token: invitationToken,
			token_hash: tokenHash,
			expires_at: expiresAt.toISOString(),
		})
		.select()
		.single();

	if (invitationError || !invitation) {
		throw new Error(
			"招待リンクの生成に失敗しました。時間をおいて、もう一度お試しください。",
		);
	}

	const invitationLink = generateInvitationLink(invitationToken);

	return {
		invitation,
		invitationToken,
		invitationLink,
	};
};

/**
 * 有効な招待リンクを取得する（なければ新規作成）
 * 既存の有効な招待があればそれを返し、なければ新規作成する
 */
export const getOrCreateInvitation = async (
	supabase: SupabaseClient<Database>,
	groupId: string,
): Promise<CreateInvitationResult> => {
	// 1. 有効な招待を検索（期限切れでないもの）
	const now = new Date().toISOString();
	const { data: existingInvitation, error: fetchError } = await supabase
		.from("invitations")
		.select("*")
		.eq("group_id", groupId)
		.gt("expires_at", now)
		.order("expires_at", { ascending: false })
		.limit(1)
		.single();

	// 2. 有効な招待が存在し、トークンがある場合はそれを返す
	if (!fetchError && existingInvitation && existingInvitation.token) {
		const invitationLink = generateInvitationLink(existingInvitation.token);
		return {
			invitation: existingInvitation,
			invitationToken: existingInvitation.token,
			invitationLink,
		};
	}

	// 3. 有効な招待がない場合は新規作成
	return createInvitation(supabase, groupId);
};
