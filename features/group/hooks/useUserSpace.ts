import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import type { Database } from "@/types/database";

type Space = Database["public"]["Tables"]["spaces"]["Row"];

type UseUserSpaceResult = {
	space: Space | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
};

/**
 * グループに紐づくスペース情報を取得するHook
 * @param groupId - グループID
 */
export const useUserSpace = (groupId: string | null): UseUserSpaceResult => {
	const { supabase } = useSupabase();
	const [space, setSpace] = useState<Space | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSpace = useCallback(async () => {
		if (!groupId) {
			setSpace(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const { data, error: fetchError } = await supabase
				.from("spaces")
				.select("*")
				.eq("group_id", groupId)
				.limit(1)
				.single();

			if (fetchError) throw fetchError;

			setSpace(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "スペースの取得に失敗しました";
			setError(errorMessage);
			setSpace(null);
		} finally {
			setIsLoading(false);
		}
	}, [supabase, groupId]);

	useEffect(() => {
		fetchSpace();
	}, [fetchSpace]);

	return {
		space,
		isLoading,
		error,
		refetch: fetchSpace,
	};
};
