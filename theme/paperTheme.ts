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
	contentLarge: {
		flex: 1,
		paddingHorizontal: spacing.lg,
	},
	contentCentered: {
		flex: 1,
		paddingHorizontal: spacing.md,
		alignItems: "center",
		justifyContent: "center",
	},
	// ロゴ
	logo: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	logoText: {
		fontSize: 36,
		fontWeight: "bold",
		color: colors.white,
	},
	// セクション
	section: {
		marginBottom: 40,
	},
	sectionCentered: {
		alignItems: "center",
		marginBottom: 40,
	},
	// アイコン円形
	iconCircleLarge: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 4,
		borderColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	iconText: {
		fontSize: 60,
		fontWeight: "bold",
		color: colors.primary,
	},
	// テキスト
	textCenter: {
		textAlign: "center",
	},
	// レイアウト
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	// ボタンコンテナ（下部固定）
	bottomButtonContainer: {
		flex: 1,
		justifyContent: "flex-end",
		paddingBottom: spacing.lg,
	},
	buttonContentLarge: {
		paddingVertical: spacing.sm,
	},
	// ロゴコンテナ（左寄せ）
	logoContainer: {
		alignItems: "flex-start",
		paddingTop: spacing.sm,
		paddingBottom: 40,
	},
	// セクション（水平パディング付き、中央揃え）
	sectionCenteredPadded: {
		alignItems: "center",
		marginBottom: 40,
		paddingHorizontal: spacing.md,
	},
	// タイトル（中央揃え）
	titleCenter: {
		fontWeight: "bold",
		color: colors.text,
		marginBottom: spacing.md,
		textAlign: "center",
	},
	// 入力フィールド（flex）
	inputFlex: {
		flex: 1,
		backgroundColor: colors.white,
	},
	// アバター
	avatarPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#D3D3D3",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	avatarIcon: {
		fontSize: 40,
	},
	// ウェルカムテキスト
	welcomeText: {
		fontSize: 24,
		fontWeight: "600",
		color: colors.text,
		marginBottom: 12,
	},
	descriptionText: {
		fontSize: 14,
		color: colors.text,
		textAlign: "center",
		lineHeight: 20,
	},
	// タブナビゲーション
	tabContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
		marginBottom: spacing.xl,
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	tabActive: {
		borderBottomColor: colors.primary,
	},
	tabText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#999",
	},
	tabTextActive: {
		color: colors.primary,
		fontWeight: "600",
	},
	// フォーム
	formContainer: {
		flex: 1,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text,
		marginBottom: 12,
	},
	input: {
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: spacing.md,
		fontSize: 16,
		color: colors.text,
		marginBottom: spacing.sm,
	},
	errorText: {
		fontSize: 12,
		color: "#FF0000",
		marginBottom: spacing.md,
	},
	// 送信ボタン
	submitButton: {
		backgroundColor: colors.primary,
		paddingVertical: spacing.md,
		borderRadius: 12,
		alignItems: "center",
		marginTop: spacing.sm,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "600",
	},
});
