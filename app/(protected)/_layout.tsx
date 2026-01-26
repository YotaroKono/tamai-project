import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ProtectedLayout() {
	// TODO: グループ所属チェックロジック (後で実装)
	const hasGroup = false; // モック: グループ未所属

	useEffect(() => {
		console.log("🔍 ProtectedLayout - hasGroup:", hasGroup);
		console.log(
			"🔍 ProtectedLayout - initialRouteName:",
			hasGroup ? "(tabs)" : "(group)",
		);
	}, []);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName={hasGroup ? "(tabs)" : "(group)"}
		>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="(group)" />
		</Stack>
	);
}
