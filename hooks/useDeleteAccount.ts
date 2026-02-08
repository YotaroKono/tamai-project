import { useState } from "react";
import { useSupabase } from "./useSupabase";

type UseDeleteAccountResult = {
	deleteAccount: () => Promise<void>;
	isLoading: boolean;
	error: string | null;
};

/**
 * アカウント削除（退会）用フック
 * Supabase Edge Function を呼び出してユーザーを削除
 */
export const useDeleteAccount = (): UseDeleteAccountResult => {
	const { supabase, signOut } = useSupabase();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteAccount = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				throw new Error("ログインしていません");
			}

			const response = await supabase.functions.invoke("delete-user", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			});

			const { error: functionError } = response;

			if (functionError) {
				throw functionError;
			}

			await signOut();
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "退会処理に失敗しました。時間をおいて、もう一度お試しください。";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		deleteAccount,
		isLoading,
		error,
	};
};
