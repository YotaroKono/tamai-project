import {
	CURRENT_TEST_GROUP,
	CURRENT_TEST_SPACE,
	CURRENT_TEST_USER,
	DEV_MODE,
	TEST_USER_NAMES,
} from "@/constants/dev";
import { useUserGroups, useUserSpace } from "@/features/group";
import { useSupabase } from "./useSupabase";

/**
 * ユーザー情報を取得するHook
 * 開発モード時はテストデータを返し、本番モードでは実際のユーザー情報を返す
 */
export const useTestUser = () => {
	const { session } = useSupabase();
	const { groups } = useUserGroups();
	const groupId = groups.length > 0 ? groups[0].id : null;
	const { space } = useUserSpace(groupId);

	// 開発モードかつ未ログインの場合はテストデータを使用
	if (DEV_MODE && !session) {
		return {
			userId: CURRENT_TEST_USER,
			groupId: CURRENT_TEST_GROUP,
			spaceId: CURRENT_TEST_SPACE,
			userName: TEST_USER_NAMES[CURRENT_TEST_USER] || "テストユーザー",
			isTestMode: true,
		};
	}

	// 本番環境または認証済みの場合は実際のユーザー情報を使用
	return {
		userId: session?.user.id || null,
		groupId: groupId,
		spaceId: space?.id || null,
		userName: session?.user.user_metadata?.name || "不明",
		isTestMode: false,
	};
};
