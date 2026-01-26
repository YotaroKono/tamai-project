import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSupabase } from "@/hooks/useSupabase";

export default function Page() {
	const { signOut } = useSupabase();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		console.log("🔍 (tabs)/index.tsx が表示されています");
	}, []);

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<Text>🔍 この画面は (tabs)/index.tsx です</Text>
			<Button title="SignOut" onPress={handleSignOut} />
		</View>
	);
}
