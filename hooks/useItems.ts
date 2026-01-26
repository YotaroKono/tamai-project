import { useCallback, useEffect, useState } from "react";
import {
	ERROR_MESSAGES,
	PURCHASED_ITEMS_DISPLAY_DAYS,
} from "@/constants/items";
import type { Item, ItemError } from "@/types/items";
import { useSupabase } from "./useSupabase";
import { useTestUser } from "./useTestUser";

/**
 * アイテム一覧を取得するHook
 */
export const useItems = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<ItemError | null>(null);
	const { supabase } = useSupabase();
	const { spaceId } = useTestUser();

	const fetchItems = useCallback(async () => {
		if (!spaceId) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// 1週間前の日時を計算
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - PURCHASED_ITEMS_DISPLAY_DAYS);

			const query = supabase
				.from("items")
				.select("*")
				.eq("space_id", spaceId)
				.gte("updated_at", cutoffDate.toISOString())
				.order("updated_at", { ascending: false });

			const { data, error: fetchError } = await query;

			if (fetchError) throw fetchError;

			setItems(data || []);
		} catch (err) {
			console.error("Failed to fetch items:", err);
			setError({
				type: "fetch",
				message: ERROR_MESSAGES.FETCH_FAILED,
			});
		} finally {
			setLoading(false);
		}
	}, [spaceId, supabase]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	// リアルタイム購読
	useEffect(() => {
		if (!spaceId) return;

		const channel = supabase
			.channel(`items:space_id=eq.${spaceId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "items",
					filter: `space_id=eq.${spaceId}`,
				},
				() => {
					// データが変更されたら再取得
					fetchItems();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [spaceId, supabase, fetchItems]);

	return { items, loading, error, refetch: fetchItems };
};
