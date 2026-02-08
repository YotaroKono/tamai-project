import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { type ReactNode, useEffect, useMemo } from "react";
import { AppState } from "react-native";

import { SupabaseContext } from "@/context/supabase-context";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

interface SupabaseProviderProps {
	children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	// biome-ignore lint/style/noNonNullAssertion: environment variables are guaranteed by the platform
	const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
	// biome-ignore lint/style/noNonNullAssertion: environment variables are guaranteed by the platform
	const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

	const supabase = useMemo(
		() =>
			createClient(supabaseUrl, supabaseKey, {
				auth: {
					storage: AsyncStorage,
					autoRefreshToken: true,
					persistSession: true,
					detectSessionInUrl: false,
					lock: processLock,
				},
				global: {
					fetch: fetchWithTimeout,
				},
			}),
		[supabaseUrl, supabaseKey],
	);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				supabase.auth.startAutoRefresh();
			} else {
				supabase.auth.stopAutoRefresh();
			}
		});
		return () => {
			subscription?.remove();
		};
	}, [supabase]);

	return (
		<SupabaseContext.Provider value={supabase}>
			{children}
		</SupabaseContext.Provider>
	);
};
