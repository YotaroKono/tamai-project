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
		console.log("[useDeleteAccount] deleteAccount called - 退会処理開始");
		console.log("[useDeleteAccount] Setting isLoading to true");
		setIsLoading(true);
		setError(null);

		try {
			// 現在のセッションを取得
			console.log("[useDeleteAccount] Getting current session...");
			const {
				data: { session },
			} = await supabase.auth.getSession();

			console.log("[useDeleteAccount] Session retrieved:", {
				hasSession: !!session,
				userId: session?.user?.id,
				expiresAt: session?.expires_at,
			});

			if (!session) {
				console.error(
					"[useDeleteAccount] No session found - user not logged in",
				);
				throw new Error("ログインしていません");
			}

			console.log(
				"[useDeleteAccount] Access token (first 20 chars):",
				session.access_token.substring(0, 20) + "...",
			);

			// Edge Function を呼び出してユーザーを削除
			console.log("[useDeleteAccount] Invoking Edge Function 'deleteUser'...");
			const invokeStartTime = Date.now();

			console.log("session.access_token:", session.access_token);
			const response = await supabase.functions.invoke("delete-user", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			});

			console.log(
				"[useDeleteAccount] Full Edge Function response:",
				JSON.stringify(response, null, 2),
			);

			const { data: functionData, error: functionError } = response;

			const invokeEndTime = Date.now();
			console.log("[useDeleteAccount] Edge Function response received", {
				duration: `${invokeEndTime - invokeStartTime}ms`,
				hasError: !!functionError,
				data: functionData,
			});

			if (functionError) {
				console.error("[useDeleteAccount] Edge Function error:", {
					message: functionError.message,
					name: functionError.name,
					details: functionError,
				});
				throw functionError;
			}

			console.log(
				"[useDeleteAccount] Edge Function succeeded - calling signOut...",
			);
			// ローカルセッションをクリア
			await signOut();
			console.log("[useDeleteAccount] signOut completed - 退会処理完了");
		} catch (err) {
			console.error("[useDeleteAccount] Error caught:", {
				error: err,
				message: err instanceof Error ? err.message : "Unknown error",
				stack: err instanceof Error ? err.stack : undefined,
			});
			const errorMessage =
				err instanceof Error
					? err.message
					: "退会処理に失敗しました。時間をおいて、もう一度お試しください。";
			console.log("[useDeleteAccount] Setting error state:", errorMessage);
			setError(errorMessage);
			throw err;
		} finally {
			console.log(
				"[useDeleteAccount] Finally block - Setting isLoading to false",
			);
			setIsLoading(false);
		}
	};

	return {
		deleteAccount,
		isLoading,
		error,
	};
};
