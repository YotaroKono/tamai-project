/**
 * Apple Sign In 用の Client Secret (JWT) を生成するスクリプト
 *
 * 使い方:
 * 1. .envにAPPLE_TEAM_ID, APPLE_KEY_ID, APPLE_SERVICE_IDを設定
 * 2. .p8ファイルをscripts/AuthKey.p8として配置（または引数で指定）
 * 3. node scripts/generate-apple-secret.js を実行
 * 4. 出力されたJWTをSupabaseのSecret Keyに貼り付ける
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// .envファイルを読み込む
function loadEnv() {
	const envPath = path.join(__dirname, "..", ".env");
	if (!fs.existsSync(envPath)) {
		console.error("エラー: .envファイルが見つかりません。");
		process.exit(1);
	}

	const envContent = fs.readFileSync(envPath, "utf-8");
	const env = {};

	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (trimmed && !trimmed.startsWith("#")) {
			const [key, ...valueParts] = trimmed.split("=");
			if (key && valueParts.length > 0) {
				let value = valueParts.join("=");
				// クォートを除去
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				env[key.trim()] = value.trim();
			}
		}
	}

	return env;
}

// .p8ファイルを読み込む
function loadPrivateKey() {
	// 引数で指定された場合
	const argPath = process.argv[2];
	if (argPath) {
		if (!fs.existsSync(argPath)) {
			console.error(`エラー: 指定されたファイルが見つかりません: ${argPath}`);
			process.exit(1);
		}
		return fs.readFileSync(argPath, "utf-8");
	}

	// デフォルトパス
	const defaultPath = path.join(__dirname, "AuthKey.p8");
	if (fs.existsSync(defaultPath)) {
		return fs.readFileSync(defaultPath, "utf-8");
	}

	console.error("エラー: .p8ファイルが見つかりません。");
	console.error("以下のいずれかの方法で指定してください:");
	console.error("  1. scripts/AuthKey.p8 として配置");
	console.error("  2. node scripts/generate-apple-secret.js /path/to/AuthKey.p8");
	process.exit(1);
}

function generateAppleClientSecret() {
	const env = loadEnv();

	const TEAM_ID = env.APPLE_TEAM_ID?.trim();
	const KEY_ID = env.APPLE_KEY_ID?.trim();
	const SERVICE_ID = env.APPLE_SERVICE_ID?.trim();

	// デバッグ: 設定値を表示
	console.log("[設定値の確認]");
	console.log(`  TEAM_ID: "${TEAM_ID}" (${TEAM_ID?.length || 0}文字)`);
	console.log(`  KEY_ID: "${KEY_ID}" (${KEY_ID?.length || 0}文字)`);
	console.log(`  SERVICE_ID: "${SERVICE_ID}"`);
	console.log("");

	// 設定チェック
	if (!TEAM_ID || !KEY_ID || !SERVICE_ID) {
		console.error("エラー: .envに以下の値を設定してください:");
		console.error("  APPLE_TEAM_ID=...");
		console.error("  APPLE_KEY_ID=...");
		console.error("  APPLE_SERVICE_ID=...");
		process.exit(1);
	}

	const PRIVATE_KEY = loadPrivateKey();

	const now = Math.floor(Date.now() / 1000);
	const expiry = now + 86400 * 180; // 180日（最大6ヶ月）

	// Header
	const header = {
		alg: "ES256",
		kid: KEY_ID,
	};

	// Payload
	const payload = {
		iss: TEAM_ID,
		iat: now,
		exp: expiry,
		aud: "https://appleid.apple.com",
		sub: SERVICE_ID,
	};

	// Base64URL encode
	const base64UrlEncode = (obj) => {
		const json = JSON.stringify(obj);
		const base64 = Buffer.from(json).toString("base64");
		return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
	};

	const headerEncoded = base64UrlEncode(header);
	const payloadEncoded = base64UrlEncode(payload);
	const signatureInput = `${headerEncoded}.${payloadEncoded}`;

	// Sign with ES256
	const privateKeyObject = crypto.createPrivateKey({
		key: PRIVATE_KEY,
		format: "pem",
	});

	const signature = crypto.sign("sha256", Buffer.from(signatureInput), {
		key: privateKeyObject,
		dsaEncoding: "ieee-p1363", // Apple requires this format
	});

	// Convert signature to Base64URL
	const signatureBase64 = signature
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	const jwt = `${signatureInput}.${signatureBase64}`;

	console.log("\n========== Apple Client Secret (JWT) ==========\n");
	console.log(jwt);
	console.log("\n================================================");
	console.log(
		"\nこのJWTをSupabaseの「Secret Key (for OAuth)」に貼り付けてください。",
	);

	const expiryDate = new Date(expiry * 1000);
	console.log(`有効期限: ${expiryDate.toLocaleDateString("ja-JP")}`);
	console.log("\n");
}

generateAppleClientSecret();
