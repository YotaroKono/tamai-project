import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

import { useSupabase } from "./useSupabase";

WebBrowser.maybeCompleteAuthSession();

export const useAppleSignIn = () => {
	const { isLoaded, supabase } = useSupabase();

	const signInWithApple = async () => {
		if (!isLoaded) {
			return;
		}

		const redirectUrl = "expo-supabase-starter://";

		console.log("[Apple Sign In] Starting OAuth flow...");

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "apple",
			options: {
				redirectTo: redirectUrl,
			},
		});

		if (error) {
			console.error("[Apple Sign In] OAuth error:", error);
			throw error;
		}

		if (!data.url) {
			throw new Error("No URL returned from Supabase");
		}

		console.log("[Apple Sign In] Opening browser...");
		const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
		console.log("[Apple Sign In] Browser result:", result.type);

		if (result.type === "success") {
			const url = result.url;
			console.log("[Apple Sign In] Callback URL:", url);

			const fragment = url.split("#")[1];
			const params = new URLSearchParams(fragment);
			const accessToken = params.get("access_token");
			const refreshToken = params.get("refresh_token");
			const errorParam = params.get("error");
			const errorDescription = params.get("error_description");

			if (errorParam) {
				console.error(
					"[Apple Sign In] Auth error:",
					errorParam,
					errorDescription,
				);
				throw new Error(`${errorParam}: ${errorDescription}`);
			}

			if (accessToken && refreshToken) {
				console.log("[Apple Sign In] Setting session...");
				const { data, error: sessionError } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});
				if (sessionError) {
					console.error("[Apple Sign In] Session error:", sessionError);
					throw sessionError;
				}
				console.log("[Apple Sign In] Success! User:", data.user?.id);
			} else {
				console.log("[Apple Sign In] No tokens found in callback URL");
				console.log("[Apple Sign In] Fragment:", fragment);
			}
		} else {
			console.log("[Apple Sign In] Browser closed or cancelled");
		}
	};

	useEffect(() => {
		WebBrowser.warmUpAsync();

		return () => {
			WebBrowser.coolDownAsync();
		};
	}, []);

	return {
		isLoaded,
		signInWithApple,
	};
};
