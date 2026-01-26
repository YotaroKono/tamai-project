import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
	APP_SCHEME_PREFIX,
	INVITATION_PATH,
	INVITATION_URL_PREFIX,
} from "@/config/links";

/**
 * 招待リンクからトークンを抽出するフック
 * アプリがURLから起動された場合に、招待トークンを取得する
 */
export const useInvitationLink = () => {
	const [invitationToken, setInvitationToken] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(true);

	useEffect(() => {
		const handleUrl = (url: string | null) => {
			if (!url) {
				setIsProcessing(false);
				return;
			}

			let token: string | null = null;

			// ユニバーサルリンク形式
			if (url.startsWith(INVITATION_URL_PREFIX)) {
				token = url.slice(INVITATION_URL_PREFIX.length);
			}
			// アプリスキーム形式
			else if (url.startsWith(APP_SCHEME_PREFIX)) {
				token = url.slice(APP_SCHEME_PREFIX.length);
			}
			// パスのみの形式（expo-routerからの場合）
			else if (url.includes(INVITATION_PATH)) {
				const match = url.match(/\/invite\/([^/?]+)/);
				if (match) {
					token = match[1];
				}
			}

			if (token) {
				setInvitationToken(token);
			}
			setIsProcessing(false);
		};

		// アプリ起動時のURL取得
		Linking.getInitialURL().then(handleUrl);

		// アプリがフォアグラウンドにある時のURL受信
		const subscription = Linking.addEventListener("url", (event) => {
			handleUrl(event.url);
		});

		return () => {
			subscription.remove();
		};
	}, []);

	// 招待トークンをクリア（処理完了後に呼ぶ）
	const clearInvitationToken = () => {
		setInvitationToken(null);
	};

	// 招待リンクを処理してグループ参加画面に遷移
	const navigateToJoinGroup = () => {
		if (invitationToken) {
			router.push({
				pathname: "/(protected)/(group)/register",
				params: { invitationToken },
			});
		}
	};

	return {
		invitationToken,
		isProcessing,
		clearInvitationToken,
		navigateToJoinGroup,
	};
};
