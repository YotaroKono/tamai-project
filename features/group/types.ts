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
