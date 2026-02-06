import * as jose from "jsr:@panva/jose@6";

const SUPABASE_JWT_ISSUER =
	Deno.env.get("SB_JWT_ISSUER") ?? Deno.env.get("SUPABASE_URL") + "/auth/v1";

const SUPABASE_JWT_KEYS = jose.createRemoteJWKSet(
	new URL(Deno.env.get("SUPABASE_URL")! + "/auth/v1/.well-known/jwks.json"),
);

function getAuthToken(req: Request) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader) {
		throw new Error("Missing authorization header");
	}
	const [bearer, token] = authHeader.split(" ");
	if (bearer !== "Bearer") {
		throw new Error(`Auth header is not 'Bearer {token}'`);
	}
	return token;
}

function verifySupabaseJWT(jwt: string) {
	return jose.jwtVerify(jwt, SUPABASE_JWT_KEYS, {
		issuer: SUPABASE_JWT_ISSUER,
	});
}

export async function AuthMiddleware(
	req: Request,
	next: (req: Request) => Promise<Response>,
) {
	if (req.method === "OPTIONS") return await next(req);

	try {
		const token = getAuthToken(req);
		const { payload } = await verifySupabaseJWT(token);

		console.log("✅ JWT verified:", {
			userId: payload.sub,
			role: payload.role,
		});

		return await next(req);
	} catch (e) {
		console.error("❌ JWT verification failed:", e);
		return Response.json(
			{ error: "Unauthorized", details: e?.toString() },
			{ status: 401 },
		);
	}
}
