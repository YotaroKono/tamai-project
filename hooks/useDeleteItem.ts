import { useState } from "react";
import { DEV_MODE, TEST_SCENARIOS } from "@/constants/dev";
import { ERROR_MESSAGES } from "@/constants/items";
import type { ItemError } from "@/types/items";
import { useSupabase } from "./useSupabase";

/**
 * アイテムを削除するHook
 */
export const useDeleteItem = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ItemError | null>(null);
	const { supabase } = useSupabase();

	const deleteItem = async (itemId: string): Promise<boolean> => {
		// 開発モード: エラーシミュレーション
		if (DEV_MODE && TEST_SCENARIOS.FORCE_DELETE_ERROR) {
			setError({
				type: "delete",
				message: ERROR_MESSAGES.DELETE_FAILED,
			});
			return false;
		}

		// 開発モード: ネットワーク遅延シミュレーション
		if (DEV_MODE && TEST_SCENARIOS.NETWORK_DELAY > 0) {
			await new Promise((resolve) =>
				setTimeout(resolve, TEST_SCENARIOS.NETWORK_DELAY),
			);
		}

		try {
			setLoading(true);
			setError(null);

			const { error: deleteError } = await supabase
				.from("items")
				.delete()
				.eq("id", itemId);

			if (deleteError) throw deleteError;

			return true;
		} catch (err) {
			console.error("Failed to delete item:", err);
			setError({
				type: "delete",
				message: ERROR_MESSAGES.DELETE_FAILED,
			});
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { deleteItem, loading, error };
};
