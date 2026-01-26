import type { Tables, TablesInsert, TablesUpdate } from "./database";

/**
 * アイテム関連の型定義
 */

// 基本的な型エイリアス
export type Item = Tables<"items">;
export type ItemInsert = TablesInsert<"items">;
export type ItemUpdate = TablesUpdate<"items">;

// アイテムのステータス型
export type ItemStatus = "unpurchased" | "purchased";

// エラー型
export type ItemError = {
	type: "create" | "update" | "delete" | "fetch";
	message: string;
};

// Hooks の戻り値型
export type UseItemsReturn = {
	items: Item[];
	loading: boolean;
	error: ItemError | null;
	refetch: () => Promise<void>;
};

export type UseCreateItemReturn = {
	createItem: (name: string, memo?: string) => Promise<Item | null>;
	loading: boolean;
	error: ItemError | null;
};

export type UseUpdateItemReturn = {
	updateItem: (
		itemId: string,
		updates: Partial<Pick<Item, "name" | "memo" | "is_purchased">>,
	) => Promise<Item | null>;
	loading: boolean;
	error: ItemError | null;
};

export type UseDeleteItemReturn = {
	deleteItem: (itemId: string) => Promise<boolean>;
	loading: boolean;
	error: ItemError | null;
};
