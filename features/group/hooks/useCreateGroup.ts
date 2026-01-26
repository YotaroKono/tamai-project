import { useState } from "react";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { createGroup, generateInvitationLink } from "../group.api";
import type { CreateGroupResult } from "../types";

type UseCreateGroupResult = {
	createGroupAsync: (groupName: string) => Promise<{
		result: CreateGroupResult;
		invitationLink: string;
	}>;
	isLoading: boolean;
	error: string | null;
};

export const useCreateGroup = (): UseCreateGroupResult => {
	const { supabase, session } = useSupabase();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createGroupAsync = async (groupName: string) => {
		const userId = session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

		if (!userId) {
			throw new Error("ログインが必要です");
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await createGroup(supabase, userId, groupName);

			const invitationLink = generateInvitationLink(result.invitationToken);

			return { result, invitationLink };
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "グループを作成できませんでした。時間をおいて、もう一度お試しください。";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return { createGroupAsync, isLoading, error };
};
