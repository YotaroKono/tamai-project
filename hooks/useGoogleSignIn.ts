import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

import { useSupabase } from "./useSupabase";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
	const { isLoaded, supabase } = useSupabase();

	const signInWithGoogle = async () => {
		if (!isLoaded) {
			console.log("❌ Supabase not loaded yet");
			return;
		}

		// Expo Goでは exp:// が使われるため、直接カスタムスキームを指定
		const redirectUrl = "expo-supabase-starter://";

		console.log("🔗 Redirect URL:", redirectUrl);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: redirectUrl,
			},
		});

		if (error) {
			console.error("❌ Supabase OAuth error:", error);
			throw error;
		}

		console.log("✅ OAuth URL received:", data.url);

		if (!data.url) {
			throw new Error("No URL returned from Supabase");
		}

		console.log("🌐 Opening browser with URL:", data.url);
		const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

		console.log("📱 Browser result:", result);

		if (result.type === "success") {
			const url = result.url;
			// フラグメント（#の後）からトークンを取得
			const fragment = url.split("#")[1];
			const params = new URLSearchParams(fragment);
			const accessToken = params.get("access_token");
			const refreshToken = params.get("refresh_token");

			console.log("🔑 Tokens received:", {
				hasAccessToken: !!accessToken,
				hasRefreshToken: !!refreshToken,
			});

			if (accessToken && refreshToken) {
				await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});
				console.log("✅ Session set successfully");
			}
		} else {
			console.log("❌ Browser result not success:", result.type);
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
		signInWithGoogle,
	};
};
