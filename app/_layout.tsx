import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
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

function RootNavigator() {
	const { isLoaded, session } = useSupabase();

	useEffect(() => {
		if (isLoaded) {
			SplashScreen.hide();
		}
	}, [isLoaded]);

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
