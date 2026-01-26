import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { BottomNavigation, useTheme } from "react-native-paper";

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
