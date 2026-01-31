import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	Avatar,
	Button,
	Divider,
	IconButton,
	Surface,
	Text,
	useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme/paperTheme";

interface UserProfileBottomSheetProps {
	visible: boolean;
	displayName: string;
	onDismiss: () => void;
	onLogout: () => Promise<void>;
	loading?: boolean;
}

/**
 * ユーザープロフィール用ボトムシート
 */
export function UserProfileBottomSheet({
	visible,
	displayName,
	onDismiss,
	onLogout,
	loading = false,
}: UserProfileBottomSheetProps) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	// Safe area の bottom padding
	const bottomPadding = Math.max(insets.bottom, spacing.md) + spacing.lg;

	const handleLogout = async () => {
		await onLogout();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			statusBarTranslucent
			onRequestClose={onDismiss}
		>
			<View style={styles.container}>
				{/* 背景オーバーレイ */}
				<TouchableWithoutFeedback onPress={onDismiss}>
					<View style={styles.overlay} />
				</TouchableWithoutFeedback>

				{/* ボトムシート本体 */}
				<Surface style={styles.surface} elevation={0}>
					{/* ドラッグハンドル */}
					<View style={styles.handle} />

					{/* ヘッダー */}
					<View style={styles.header}>
						<Text variant="titleLarge" style={styles.title}>
							プロフィール
						</Text>
						<IconButton
							icon="close"
							onPress={onDismiss}
							disabled={loading}
							mode="contained-tonal"
							size={20}
						/>
					</View>

					<Divider />

					{/* ユーザー情報 */}
					<View style={[styles.content, { paddingBottom: bottomPadding }]}>
						<View style={styles.userInfo}>
							<Avatar.Icon
								size={64}
								icon="account-circle"
								style={styles.avatar}
							/>
							<Text variant="titleMedium" style={styles.displayName}>
								{displayName}
							</Text>
						</View>

						{/* ログアウトボタン */}
						<View style={styles.buttons}>
							<Button
								mode="outlined"
								onPress={handleLogout}
								loading={loading}
								disabled={loading}
								textColor={theme.colors.error}
								style={[styles.button, { borderColor: theme.colors.error }]}
								contentStyle={styles.buttonContent}
								icon="logout"
							>
								ログアウト
							</Button>
						</View>
					</View>
				</Surface>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-end",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	surface: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: spacing.lg,
		borderTopRightRadius: spacing.lg,
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: "#DADADA",
		borderRadius: 2,
		alignSelf: "center",
		marginVertical: spacing.sm,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: spacing.lg,
		paddingRight: spacing.sm,
		paddingVertical: spacing.sm,
	},
	title: {
		fontWeight: "bold",
		color: colors.text,
	},
	content: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
	},
	userInfo: {
		alignItems: "center",
		paddingVertical: spacing.lg,
	},
	avatar: {
		backgroundColor: "transparent",
		marginBottom: spacing.md,
	},
	displayName: {
		fontWeight: "600",
		color: colors.text,
	},
	buttons: {
		paddingTop: spacing.md,
		gap: spacing.sm + spacing.xs,
	},
	button: {
		borderRadius: spacing.lg,
	},
	buttonContent: {
		paddingVertical: spacing.xs,
	},
});
