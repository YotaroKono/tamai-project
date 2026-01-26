import {
	CURRENT_TEST_GROUP,
	CURRENT_TEST_SPACE,
	CURRENT_TEST_USER,
	DEV_MODE,
	TEST_USER_NAMES,
} from "@/constants/dev";
import { useSupabase } from "./useSupabase";

/**
 * テストユーザー情報を取得するHook
 * 開発モード時はテストデータを返し、本番モードでは実際のユーザー情報を返す
 */
export const useTestUser = () => {
	const { session } = useSupabase();

	// 本番環境または認証済みの場合は実際のユーザー情報を使用
	if (!DEV_MODE || session) {
		return {
			userId: session?.user.id || null,
			groupId: null, // TODO: 実際のグループ取得ロジック(他のエンジニア担当)
			spaceId: null, // TODO: 実際のスペース取得ロジック(他のエンジニア担当)
			userName: session?.user.user_metadata?.name || "不明",
			isTestMode: false,
		};
	}

	// 開発モード: テストデータを返す
	return {
		userId: CURRENT_TEST_USER,
		groupId: CURRENT_TEST_GROUP,
		spaceId: CURRENT_TEST_SPACE,
		userName: TEST_USER_NAMES[CURRENT_TEST_USER] || "テストユーザー",
		isTestMode: true,
	};
};
