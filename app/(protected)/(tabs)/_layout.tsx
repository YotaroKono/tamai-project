import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useUserGroups } from "@/features/group";

export default function TabLayout() {
	const theme = useTheme();
	const { hasGroup, isLoading } = useUserGroups();

	// ローディング中
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// グループ未所属の場合はグループ登録画面にリダイレクト
	if (!hasGroup) {
		return <Redirect href="/(protected)/(group)/register" />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
				tabBarStyle: {
					backgroundColor: theme.colors.surface,
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="shopping/index"
				options={{
					title: "買い物",
					tabBarIcon: ({ color, focused }) => (
						<MaterialCommunityIcons
							name={focused ? "cart" : "cart-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="group/index"
				options={{
					title: "グループ",
					tabBarIcon: ({ color, focused }) => (
						<MaterialCommunityIcons
							name={focused ? "account-group" : "account-group-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			{/* 以下のスクリーンはタブに表示しない */}
			<Tabs.Screen
				name="index"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
