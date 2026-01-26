import { useState } from "react";
import { DEV_MODE, TEST_SCENARIOS } from "@/constants/dev";
import { ERROR_MESSAGES } from "@/constants/items";
import type { Item, ItemError } from "@/types/items";
import { useSupabase } from "./useSupabase";
import { useTestUser } from "./useTestUser";

/**
 * アイテムを登録するHook
 */
export const useCreateItem = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ItemError | null>(null);
	const { supabase } = useSupabase();
	const { spaceId, userId } = useTestUser();

	const createItem = async (
		name: string,
		memo?: string,
	): Promise<Item | null> => {
		if (!spaceId || !userId) {
			setError({
				type: "create",
				message: "ユーザーまたはスペース情報が不足しています",
			});
			return null;
		}

		// 開発モード: エラーシミュレーション
		if (DEV_MODE && TEST_SCENARIOS.FORCE_CREATE_ERROR) {
			setError({
				type: "create",
				message: ERROR_MESSAGES.CREATE_FAILED,
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

			const { data, error: createError } = await supabase
				.from("items")
				.insert({
					name,
					memo: memo || null,
					space_id: spaceId,
					created_by_user_id: userId,
					bought_by_user_id: userId,
					is_purchased: false,
				})
				.select()
				.single();

			if (createError) throw createError;

			return data;
		} catch (err) {
			console.error("Failed to create item:", err);
			setError({
				type: "create",
				message: ERROR_MESSAGES.CREATE_FAILED,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { createItem, loading, error };
};
