import { useCallback, useEffect, useState } from "react";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { getGroupMembers, getUserGroups } from "../group.api";
import type { GroupMemberWithUser } from "../types";

type UseGroupMembersResult = {
	members: GroupMemberWithUser[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
};

export const useGroupMembers = (): UseGroupMembersResult => {
	const { supabase, session, isLoaded } = useSupabase();
	const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMembers = useCallback(async () => {
		const userId = session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

		if (!userId) {
			setMembers([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// まずユーザーのグループを取得
			const userGroups = await getUserGroups(supabase, userId);
			if (userGroups.length === 0) {
				setMembers([]);
				return;
			}

			// グループのメンバーを取得
			const groupId = userGroups[0].id;
			const groupMembers = await getGroupMembers(supabase, groupId);
			setMembers(groupMembers);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "メンバー情報の取得に失敗しました。時間をおいて、もう一度お試しください。";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [supabase, session?.user?.id]);

	useEffect(() => {
		if (isLoaded) {
			fetchMembers();
		}
	}, [isLoaded, fetchMembers]);

	return {
		members,
		isLoading,
		error,
		refetch: fetchMembers,
	};
};
