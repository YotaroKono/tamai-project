import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import { createClient, processLock } from "@supabase/supabase-js";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
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

	const [session, setSession] = useState<Session | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

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

	// セッション管理（1回だけ実行）
	useEffect(() => {
		// 初期セッション取得
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setIsLoaded(true);
		});

		// 認証状態変化リスナー
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, newSession) => {
				setSession(newSession);
				setIsLoaded(true);
			},
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, [supabase]);

	// AppState 監視（トークンリフレッシュ）
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

	const signOut = useCallback(async () => {
		await supabase.auth.signOut();
		setSession(null);
	}, [supabase]);

	const value = useMemo(
		() => ({
			supabase,
			session,
			isLoaded,
			signOut,
		}),
		[supabase, session, isLoaded, signOut],
	);

	return (
		<SupabaseContext.Provider value={value}>
			{children}
		</SupabaseContext.Provider>
	);
};
