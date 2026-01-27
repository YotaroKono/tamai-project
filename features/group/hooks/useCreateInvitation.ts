import { useCallback, useState } from "react";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { getOrCreateInvitation, getUserGroups } from "../group.api";
import type { CreateInvitationResult } from "../types";

type UseCreateInvitationResult = {
	createInvitationAsync: () => Promise<CreateInvitationResult>;
	isLoading: boolean;
	error: string | null;
};

export const useCreateInvitation = (): UseCreateInvitationResult => {
	const { supabase, session } = useSupabase();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createInvitationAsync =
		useCallback(async (): Promise<CreateInvitationResult> => {
			const userId = session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

			if (!userId) {
				throw new Error("ログインが必要です。");
			}

			setIsLoading(true);
			setError(null);

			try {
				// ユーザーのグループを取得
				const userGroups = await getUserGroups(supabase, userId);
				if (userGroups.length === 0) {
					throw new Error("グループに所属していません。");
				}

				const groupId = userGroups[0].id;
				const result = await getOrCreateInvitation(supabase, groupId);
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "招待リンクの生成に失敗しました。時間をおいて、もう一度お試しください。";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		}, [supabase, session?.user?.id]);

	return {
		createInvitationAsync,
		isLoading,
		error,
	};
};
