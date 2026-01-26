import { Stack } from "expo-router";

export default function GroupLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="index"
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="register" />
			<Stack.Screen name="created" />
		</Stack>
	);
}
