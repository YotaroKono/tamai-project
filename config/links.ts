/**
 * 招待リンク関連の設定
 * 本番環境では実際のドメインに置き換えてください
 */

// ユニバーサルリンク用ドメイン
export const INVITATION_DOMAIN = "https://sato-one.vercel.app";

// 招待リンクのパス
export const INVITATION_PATH = "/invite";

// 招待リンクのフルプレフィックス
export const INVITATION_URL_PREFIX = `${INVITATION_DOMAIN}${INVITATION_PATH}/`;

// アプリスキーム（フォールバック用）
export const APP_SCHEME = "sato";
export const APP_SCHEME_PREFIX = `${APP_SCHEME}://invite/`;
