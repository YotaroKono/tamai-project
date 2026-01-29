import type { Tables, TablesInsert } from "@/types/database";

export type Group = Tables<"groups">;
export type GroupInsert = TablesInsert<"groups">;

export type GroupMember = Tables<"group_members">;
export type GroupMemberInsert = TablesInsert<"group_members">;

export type Space = Tables<"spaces">;
export type SpaceInsert = TablesInsert<"spaces">;

export type Invitation = Tables<"invitations">;
export type InvitationInsert = TablesInsert<"invitations">;

export type CreateGroupResult = {
	group: Group;
	space: Space;
	invitation: Invitation;
	invitationToken: string;
};

export type JoinGroupResult = {
	group: Group;
};

// グループメンバー情報（ユーザー情報付き）
export type GroupMemberWithUser = {
	id: string;
	user_id: string;
	group_id: string;
	joined_at: string | null;
	// ユーザー情報（profilesテーブルがない場合はuser_idのみ）
	display_name: string;
};

// 招待リンク作成結果
export type CreateInvitationResult = {
	invitation: Invitation;
	invitationToken: string;
	invitationLink: string;
};
