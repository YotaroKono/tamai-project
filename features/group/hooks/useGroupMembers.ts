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
	const [groupId, setGroupId] = useState<string | null>(null);

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
				setGroupId(null);
				return;
			}

			// グループのメンバーを取得
			const currentGroupId = userGroups[0].id;
			setGroupId(currentGroupId);
			const groupMembers = await getGroupMembers(supabase, currentGroupId);
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

	// リアルタイム購読
	useEffect(() => {
		if (!groupId) return;

		const channel = supabase
			.channel(`group_members:group_id=eq.${groupId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "group_members",
					filter: `group_id=eq.${groupId}`,
				},
				() => {
					// メンバーが変更されたら再取得
					fetchMembers();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [groupId, supabase, fetchMembers]);

	return {
		members,
		isLoading,
		error,
		refetch: fetchMembers,
	};
};
