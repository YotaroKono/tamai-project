import {
	Alert,
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
	onDeleteAccount: () => Promise<void>;
	loading?: boolean;
	isDeleting?: boolean;
	deleteError?: string | null;
}

/**
 * ユーザープロフィール用ボトムシート
 */
export function UserProfileBottomSheet({
	visible,
	displayName,
	onDismiss,
	onLogout,
	onDeleteAccount,
	loading = false,
	isDeleting = false,
	deleteError = null,
}: UserProfileBottomSheetProps) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	// Safe area の bottom padding
	const bottomPadding = Math.max(insets.bottom, spacing.md) + spacing.lg;

	const isProcessing = loading || isDeleting;

	const handleLogout = async () => {
		await onLogout();
	};

	const handleDeleteAccountPress = () => {
		Alert.alert(
			"退会の確認",
			"本当に退会しますか？\nこの操作は取り消すことができません。",
			[
				{
					text: "キャンセル",
					style: "cancel",
				},
				{
					text: "退会する",
					style: "destructive",
					onPress: async () => {
						try {
							await onDeleteAccount();
						} catch {
							// エラーは呼び出し元で管理
						}
					},
				},
			],
		);
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
							ログアウト・退会
						</Text>
					</View>

					<Divider />

					{/* ユーザー情報 */}
					<View style={[styles.content, { paddingBottom: bottomPadding }]}>
						{/* ボタン */}
						<View style={styles.buttons}>
							<Button
								mode="outlined"
								onPress={handleLogout}
								loading={loading}
								disabled={isProcessing}
								textColor={theme.colors.error}
								style={[styles.button, { borderColor: theme.colors.error }]}
								contentStyle={styles.buttonContent}
								icon="logout"
							>
								ログアウト
							</Button>
							<Button
								mode="text"
								onPress={handleDeleteAccountPress}
								loading={isDeleting}
								disabled={isProcessing}
								textColor={theme.colors.error}
								style={styles.deleteButton}
								contentStyle={styles.buttonContent}
								icon="account-remove"
							>
								退会する
							</Button>
							{deleteError && (
								<Text style={styles.errorText}>{deleteError}</Text>
							)}
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
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
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
	deleteButton: {
		borderRadius: spacing.lg,
	},
	errorText: {
		fontSize: 14,
		color: "#FF0000",
		textAlign: "center",
		marginTop: spacing.xs,
	},
});
