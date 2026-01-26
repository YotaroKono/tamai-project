import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useUserGroups } from "@/features/group";

export default function ProtectedIndex() {
	const { hasGroup, isLoading } = useUserGroups();

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (hasGroup) {
		return <Redirect href="/(protected)/(tabs)" />;
	}

	return <Redirect href="/(protected)/(group)" />;
}
