import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

import { useSupabase } from "./useSupabase";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
	const { isLoaded, supabase } = useSupabase();

	const signInWithGoogle = async () => {
		if (!isLoaded) {
			return;
		}

		const redirectUrl = "expo-supabase-starter://";

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: redirectUrl,
				queryParams: {
					prompt: "select_account",
				},
			},
		});

		if (error) {
			throw error;
		}

		if (!data.url) {
			throw new Error("No URL returned from Supabase");
		}

		const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

		if (result.type === "success") {
			const url = result.url;
			const fragment = url.split("#")[1];
			const params = new URLSearchParams(fragment);
			const accessToken = params.get("access_token");
			const refreshToken = params.get("refresh_token");

			if (accessToken && refreshToken) {
				await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});
			}
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
