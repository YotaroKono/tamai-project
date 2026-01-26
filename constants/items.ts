/**
 * アイテム機能関連の定数
 */

// PRDに記載されているエラーメッセージ
export const ERROR_MESSAGES = {
	CREATE_FAILED:
		"アイテムを登録できませんでした。時間をおいて、もう一度お試しください。",
	UPDATE_FAILED:
		"アイテムを更新できませんでした。時間をおいて、もう一度お試しください。",
	DELETE_FAILED:
		"アイテムを削除できませんでした。時間をおおいて、もう一度お試しください。",
	FETCH_FAILED:
		"アイテムの取得に失敗しました。時間をおいて、もう一度お試しください。",
} as const;

// 空状態のメッセージ（PRDより）
export const EMPTY_LIST_MESSAGE =
	"買い物リストはまだ追加されていません。気づいたものを追加してみましょう！";

// アイテムステータス
export const ITEM_STATUS = {
	UNPURCHASED: false,
	PURCHASED: true,
} as const;

// 購入済みアイテムの表示期間（日数）
export const PURCHASED_ITEMS_DISPLAY_DAYS = 7;

// 通知メッセージテンプレート
export const NOTIFICATION_TEMPLATE = {
	ITEM_CREATED: (userName: string, itemName: string) =>
		`${userName}さんが${itemName}を必要なものとして登録しました。`,
} as const;
