import { useCallback, useEffect, useState } from "react";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { getUserGroups } from "../group.api";
import type { Group } from "../types";

type UseUserGroupsResult = {
	groups: Group[];
	hasGroup: boolean;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
};

export const useUserGroups = (): UseUserGroupsResult => {
	const { supabase, session, isLoaded } = useSupabase();
	const [groups, setGroups] = useState<Group[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchGroups = useCallback(async () => {
		const userId = session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

		if (!userId) {
			setGroups([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const userGroups = await getUserGroups(supabase, userId);
			setGroups(userGroups);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "グループの取得に失敗しました";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [supabase, session?.user?.id]);

	useEffect(() => {
		if (isLoaded) {
			fetchGroups();
		}
	}, [isLoaded, fetchGroups]);

	return {
		groups,
		hasGroup: groups.length > 0,
		isLoading,
		error,
		refetch: fetchGroups,
	};
};
