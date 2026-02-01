/**
 * 招待リンクの設定
 * ユニバーサルリンク対応時はここを変更する
 */

const INVITATION_SCHEME = "sato://invite";

/**
 * トークンから招待リンクを生成
 */
export const buildInvitationLink = (token: string): string => {
	return `${INVITATION_SCHEME}/${token}`;
};

/**
 * 招待リンクからトークンを抽出
 * 入力形式: "sato://invite/{token}" または "{token}"
 */
export const extractTokenFromLink = (link: string): string => {
	const prefix = `${INVITATION_SCHEME}/`;
	if (link.startsWith(prefix)) {
		return link.slice(prefix.length);
	}
	return link;
};
