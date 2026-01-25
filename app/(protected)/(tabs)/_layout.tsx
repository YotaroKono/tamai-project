import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
	const theme = useTheme();

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
				name="family/index"
				options={{
					title: "ファミリー",
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
			<Tabs.Screen
				name="profile"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
