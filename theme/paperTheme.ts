import { StyleSheet } from "react-native";
import { MD3LightTheme } from "react-native-paper";

// アプリ全体で使う色
export const colors = {
	primary: "#EE7800",
	background: "#FFF5F0",
	surface: "#FEFEFE",
	text: "#555555",
	white: "#FFFFFF",
} as const;

// スペーシング
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
} as const;

// react-native-paper テーマ
export const paperTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,

		primary: colors.primary,
		onPrimary: colors.white,
		primaryContainer: "#FFD7B0",
		onPrimaryContainer: "#3A1B00",

		secondary: colors.primary,
		onSecondary: colors.white,
		secondaryContainer: "#FFE1C4",
		onSecondaryContainer: "#3A1B00",

		background: colors.surface,
		surface: colors.surface,
		onSurface: colors.text,

		surfaceVariant: "#E3E3E3",
		onSurfaceVariant: colors.text,
		outline: "#E3E3E3",

		surfaceDisabled: "rgba(227,227,227,0.4)",
		onSurfaceDisabled: "rgba(85,85,85,0.38)",
	},
};

// 共通スタイル
export const commonStyles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		backgroundColor: "transparent",
		paddingHorizontal: spacing.md,
		paddingVertical: 12,
		alignItems: "center",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
	},
	contentCentered: {
		flex: 1,
		paddingHorizontal: spacing.md,
		alignItems: "center",
		justifyContent: "center",
	},
});
