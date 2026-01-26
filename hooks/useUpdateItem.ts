import { useState } from "react";
import { DEV_MODE, TEST_SCENARIOS } from "@/constants/dev";
import { ERROR_MESSAGES } from "@/constants/items";
import type { Item, ItemError } from "@/types/items";
import { useSupabase } from "./useSupabase";

/**
 * アイテムを更新するHook
 */
export const useUpdateItem = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ItemError | null>(null);
	const { supabase } = useSupabase();

	const updateItem = async (
		itemId: string,
		updates: Partial<Pick<Item, "name" | "memo" | "is_purchased">>,
	): Promise<Item | null> => {
		// 開発モード: エラーシミュレーション
		if (DEV_MODE && TEST_SCENARIOS.FORCE_UPDATE_ERROR) {
			setError({
				type: "update",
				message: ERROR_MESSAGES.UPDATE_FAILED,
			});
			return null;
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

			const { data, error: updateError } = await supabase
				.from("items")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", itemId)
				.select()
				.single();

			if (updateError) throw updateError;

			return data;
		} catch (err) {
			console.error("Failed to update item:", err);
			setError({
				type: "update",
				message: ERROR_MESSAGES.UPDATE_FAILED,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { updateItem, loading, error };
};
