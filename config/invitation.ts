/**
 * 招待リンクの設定
 * ユニバーサルリンク対応
 */

const INVITATION_BASE_URL = "https://sato-one.vercel.app/invite";

/**
 * トークンから招待リンクを生成
 */
export const buildInvitationLink = (token: string): string => {
	return `${INVITATION_BASE_URL}/${token}`;
};

/**
 * 招待リンクからトークンを抽出
 * 入力形式: "https://sato-one.vercel.app/invite/{token}" または "{token}"
 */
export const extractTokenFromLink = (link: string): string => {
	const prefix = `${INVITATION_BASE_URL}/`;
	if (link.startsWith(prefix)) {
		return link.slice(prefix.length);
	}
	return link;
};
