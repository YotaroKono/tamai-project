import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";

import { useUserGroups } from "@/features/group";

// タブバーに表示するルート名
const VISIBLE_ROUTES = ["shopping/index", "group/index"];

function TabBar({ navigation, state, descriptors, insets }: BottomTabBarProps) {
	const theme = useTheme();

	// 表示するルートのみをフィルタリング
	const filteredRoutes = state.routes.filter((route) =>
		VISIBLE_ROUTES.includes(route.name),
	);

	const filteredState = {
		...state,
		routes: filteredRoutes,
		index: Math.max(
			0,
			filteredRoutes.findIndex(
				(route) => route.key === state.routes[state.index]?.key,
			),
		),
	};

	return (
		<BottomNavigation.Bar
			navigationState={filteredState}
			safeAreaInsets={insets}
			onTabPress={({ route, preventDefault }) => {
				const event = navigation.emit({
					type: "tabPress",
					target: route.key,
					canPreventDefault: true,
				});

				if (event.defaultPrevented) {
					preventDefault();
				} else {
					navigation.dispatch({
						...CommonActions.navigate(route.name, route.params),
						target: state.key,
					});
				}
			}}
			renderIcon={({ route, focused, color }) => {
				const { options } = descriptors[route.key];
				if (options.tabBarIcon) {
					return options.tabBarIcon({ focused, color, size: 24 });
				}
				return null;
			}}
			getLabelText={({ route }) => {
				const { options } = descriptors[route.key];
				const label =
					typeof options.tabBarLabel === "string"
						? options.tabBarLabel
						: (options.title ?? route.name);
				return label;
			}}
			style={{
				backgroundColor: theme.colors.elevation.level2,
			}}
		/>
	);
}

export default function TabLayout() {
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
				headerShown: false,
			}}
			tabBar={(props) => <TabBar {...props} />}
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
		</Tabs>
	);
}
