import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { DEV_SKIP_AUTH } from "@/config/dev";
import { useSupabase } from "@/hooks/useSupabase";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { paperTheme } from "@/theme/paperTheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	return (
		<SupabaseProvider>
			<RootNavigator />
		</SupabaseProvider>
	);
}

SplashScreen.setOptions({
	duration: 500,
	fade: true,
});

function RootNavigator() {
	const { isLoaded, session } = useSupabase();

	// 1. ここで認証状態を確定させる
	// DEV_SKIP_AUTH が true なら、session がなくても認証済みとして扱う
	const isAuthenticated = DEV_SKIP_AUTH || !!session;

	useEffect(() => {
		if (isLoaded) {
			SplashScreen.hide();
		}
	}, [isLoaded]);

	// まだ読み込み中の場合は何も返さない（またはロード画面）
	if (!isLoaded) return null;

	return (
		<PaperProvider theme={paperTheme}>
			<Stack
				screenOptions={{
					headerShown: false,
					gestureEnabled: false,
					animation: "none",
					animationDuration: 0,
				}}
			>
				<Stack.Protected guard={isAuthenticated}>
					<Stack.Screen name="(protected)" />
				</Stack.Protected>

				<Stack.Protected guard={!isAuthenticated}>
					<Stack.Screen name="(public)" />
				</Stack.Protected>
			</Stack>
		</PaperProvider>
	);
}
