import { useCallback, useState } from "react";

import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { extractTokenFromLink, joinGroupByInvitation } from "../group.api";
import type { JoinGroupResult } from "../types";

type UseJoinGroupResult = {
	joinGroup: (invitationLink: string) => Promise<JoinGroupResult>;
	isLoading: boolean;
	error: string | null;
};

export const useJoinGroup = (): UseJoinGroupResult => {
	const { supabase, session } = useSupabase();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const joinGroup = useCallback(
		async (invitationLink: string): Promise<JoinGroupResult> => {
			const userId = session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

			if (!userId) {
				throw new Error("ログインが必要です。");
			}

			setIsLoading(true);
			setError(null);

			try {
				const token = extractTokenFromLink(invitationLink);
				const result = await joinGroupByInvitation(supabase, userId, token);
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "グループに参加できませんでした。時間をおいて、もう一度お試しください。";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[supabase, session?.user?.id],
	);

	return {
		joinGroup,
		isLoading,
		error,
	};
};
