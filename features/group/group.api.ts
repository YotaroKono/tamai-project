import type { SupabaseClient } from "@supabase/supabase-js";
import { APP_SCHEME_PREFIX, INVITATION_URL_PREFIX } from "@/config/links";
import type { Database } from "@/types/database";
import type { CreateGroupResult, Group, JoinGroupResult } from "./types";

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

/**
 * 招待リンクを生成する
 * ユニバーサルリンク形式: https://sato-app.example.com/invite/{token}
 */
export const generateInvitationLink = (token: string): string => {
	return `${INVITATION_URL_PREFIX}${token}`;
};

/**
 * 招待リンクからトークンを抽出する
 * 入力形式:
 * - "https://sato-app.example.com/invite/{token}" (ユニバーサルリンク)
 * - "sato://invite/{token}" (アプリスキーム)
 * - "{token}" (トークンのみ)
 */
export const extractTokenFromLink = (input: string): string => {
	const trimmed = input.trim();

	// ユニバーサルリンク形式
	if (trimmed.startsWith(INVITATION_URL_PREFIX)) {
		return trimmed.slice(INVITATION_URL_PREFIX.length);
	}

	// アプリスキーム形式（フォールバック）
	if (trimmed.startsWith(APP_SCHEME_PREFIX)) {
		return trimmed.slice(APP_SCHEME_PREFIX.length);
	}

	// トークンのみ
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
