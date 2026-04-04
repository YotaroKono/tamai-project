/**
 * Apple Sign In 用 JWT の検証スクリプト
 *
 * 使い方:
 * node scripts/verify-apple-jwt.js "YOUR_JWT_HERE"
 *
 * または Supabase に設定した JWT を確認
 */

const jwt = process.argv[2];

if (!jwt) {
	console.error("使い方: node scripts/verify-apple-jwt.js <JWT>");
	console.error("");
	console.error("Supabaseに設定したJWTを引数に渡してください。");
	process.exit(1);
}

function decodeJwt(token) {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("無効なJWT形式です。3つのパートが必要です。");
	}

	const decodeBase64Url = (str) => {
		const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
		return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
	};

	return {
		header: decodeBase64Url(parts[0]),
		payload: decodeBase64Url(parts[1]),
	};
}

try {
	const decoded = decodeJwt(jwt);

	console.log("\n========== JWT 検証結果 ==========\n");

	console.log("【Header】");
	console.log(JSON.stringify(decoded.header, null, 2));
	console.log("");

	console.log("【Payload】");
	console.log(JSON.stringify(decoded.payload, null, 2));
	console.log("");

	// 検証
	console.log("【検証チェックリスト】");

	const { header, payload } = decoded;

	// Header checks
	if (header.alg === "ES256") {
		console.log("✅ alg: ES256 (正しい)");
	} else {
		console.log(`❌ alg: ${header.alg} (ES256であるべき)`);
	}

	if (header.kid && header.kid.length === 10) {
		console.log(`✅ kid: ${header.kid} (Key ID)`);
	} else {
		console.log(`❌ kid: ${header.kid || "未設定"} (10文字のKey IDであるべき)`);
	}

	// Payload checks
	if (payload.iss && payload.iss.length === 10) {
		console.log(`✅ iss: ${payload.iss} (Team ID)`);
	} else {
		console.log(`❌ iss: ${payload.iss || "未設定"} (10文字のTeam IDであるべき)`);
	}

	if (payload.aud === "https://appleid.apple.com") {
		console.log(`✅ aud: ${payload.aud} (正しい)`);
	} else {
		console.log(`❌ aud: ${payload.aud} (https://appleid.apple.comであるべき)`);
	}

	if (payload.sub) {
		console.log(`✅ sub: ${payload.sub} (Service ID)`);
		console.log(`   → SupabaseのClient IDsにこの値が設定されているか確認`);
	} else {
		console.log(`❌ sub: 未設定 (Service IDであるべき)`);
	}

	// 有効期限チェック
	const now = Math.floor(Date.now() / 1000);
	if (payload.exp > now) {
		const expiryDate = new Date(payload.exp * 1000);
		console.log(`✅ exp: ${expiryDate.toLocaleDateString("ja-JP")} (有効期限内)`);
	} else {
		const expiryDate = new Date(payload.exp * 1000);
		console.log(`❌ exp: ${expiryDate.toLocaleDateString("ja-JP")} (期限切れ！)`);
	}

	console.log("\n===================================\n");

	console.log("【確認事項】");
	console.log(`1. SupabaseのClient IDsに「${payload.sub}」が設定されているか？`);
	console.log(`2. Apple DeveloperでService ID「${payload.sub}」が存在するか？`);
	console.log(`3. Key ID「${header.kid}」が正しいか？`);
	console.log("");

} catch (error) {
	console.error("エラー:", error.message);
	process.exit(1);
}
