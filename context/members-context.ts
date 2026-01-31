import { createContext } from "react";
import type { GroupMemberWithUser } from "@/features/group/types";

export type MembersContextType = {
	members: GroupMemberWithUser[];
	isLoading: boolean;
	error: string | null;
	getMemberName: (userId: string) => string;
	refetch: () => Promise<void>;
};

export const MembersContext = createContext<MembersContextType | null>(null);
