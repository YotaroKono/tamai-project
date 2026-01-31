import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { MembersContext } from "@/context/members-context";
import { getGroupMembers, getUserGroups } from "@/features/group/group.api";
import type { GroupMemberWithUser } from "@/features/group/types";
import { useSupabase } from "@/hooks/useSupabase";

type MembersProviderProps = {
	children: ReactNode;
};

export const MembersProvider = ({ children }: MembersProviderProps) => {
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
			const userGroups = await getUserGroups(supabase, userId);
			if (userGroups.length === 0) {
				setMembers([]);
				setGroupId(null);
				return;
			}

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
			console.error("Failed to fetch members:", err);
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
			.channel(`members_provider:group_id=eq.${groupId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "group_members",
					filter: `group_id=eq.${groupId}`,
				},
				() => {
					fetchMembers();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [groupId, supabase, fetchMembers]);

	const getMemberName = useCallback(
		(userId: string): string => {
			const member = members.find((m) => m.user_id === userId);
			return member?.display_name || "不明";
		},
		[members],
	);

	const value = useMemo(
		() => ({
			members,
			isLoading,
			error,
			getMemberName,
			refetch: fetchMembers,
		}),
		[members, isLoading, error, getMemberName, fetchMembers],
	);

	return (
		<MembersContext.Provider value={value}>{children}</MembersContext.Provider>
	);
};
