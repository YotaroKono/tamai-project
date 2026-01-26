/**
 * 開発・テスト用の定数
 * 本番環境では使用しない
 */

// 開発モードの有効化フラグ
export const DEV_MODE = __DEV__;

// テスト用のユーザーID (UUID形式)
export const TEST_USER_IDS = {
	USER_1: "9ee94e2d-6f89-472f-b3e1-e6318bd134f2", // じゅん
	USER_2: "00000000-0000-0000-0000-000000000012", // ゆうな
	USER_3: "00000000-0000-0000-0000-000000000013", // たくみ
} as const;

// テスト用のグループID (UUID形式)
export const TEST_GROUP_IDS = {
	SATO_FAMILY: "b85a1e7e-6085-49e1-b231-8577697813fa",
	TANAKA_FAMILY: "00000000-0000-0000-0000-000000000002",
} as const;

// テスト用のスペースID (UUID形式)
export const TEST_SPACE_IDS = {
	SATO_SHOPPING: "6b3baa73-0fdf-442e-adc0-4fc1cb2a6c43",
} as const;

// 現在のテストユーザー(これを切り替えて動作確認)
export const CURRENT_TEST_USER = TEST_USER_IDS.USER_1;
export const CURRENT_TEST_GROUP = TEST_GROUP_IDS.SATO_FAMILY;
export const CURRENT_TEST_SPACE = TEST_SPACE_IDS.SATO_SHOPPING;

// テストユーザーの表示名
export const TEST_USER_NAMES: Record<string, string> = {
	[TEST_USER_IDS.USER_1]: "じゅん",
	[TEST_USER_IDS.USER_2]: "ゆうな",
	[TEST_USER_IDS.USER_3]: "たくみ",
};

// テストシナリオ設定（エラーや遅延のシミュレート用）
export const TEST_SCENARIOS = {
	FORCE_CREATE_ERROR: false, // true にすると登録時にエラー
	FORCE_UPDATE_ERROR: false, // true にすると更新時にエラー
	FORCE_DELETE_ERROR: false, // true にすると削除時にエラー
	NETWORK_DELAY: 0, // ミリ秒単位でレスポンス遅延をシミュレート
} as const;
