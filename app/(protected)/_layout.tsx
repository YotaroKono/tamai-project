import { Stack } from "expo-router";
import { MembersProvider } from "@/providers/members-provider";

export default function ProtectedLayout() {
	return (
		<MembersProvider>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="(group)" />
			</Stack>
		</MembersProvider>
	);
}
