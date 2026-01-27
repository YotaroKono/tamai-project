import { useEffect, useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	Button,
	Divider,
	IconButton,
	Surface,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme/paperTheme";
import type { Item } from "@/types/items";

interface ItemBottomSheetProps {
	visible: boolean;
	mode: "create" | "edit";
	item?: Item;
	onDismiss: () => void;
	onSave: (name: string, memo: string) => Promise<void>;
	onDelete?: () => Promise<void>;
	loading?: boolean;
}

/**
 * アイテム追加・編集用ボトムシート
 */
export function ItemBottomSheet({
	visible,
	mode,
	item,
	onDismiss,
	onSave,
	onDelete,
	loading = false,
}: ItemBottomSheetProps) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [name, setName] = useState("");
	const [memo, setMemo] = useState("");

	const isCreateMode = mode === "create";
	const title = isCreateMode ? "アイテムを追加" : "アイテムを編集";
	const saveButtonText = isCreateMode ? "追加する" : "保存する";
	const saveButtonIcon = isCreateMode ? "plus" : "content-save";
	const canSave = name.trim().length > 0 && !loading;

	// Safe area の bottom padding
	const bottomPadding = Math.max(insets.bottom, spacing.md) + spacing.lg;

	// itemが変更されたら初期値を設定
	useEffect(() => {
		if (!isCreateMode && item) {
			setName(item.name);
			setMemo(item.memo || "");
		} else {
			setName("");
			setMemo("");
		}
	}, [isCreateMode, item]);

	const resetForm = () => {
		setName("");
		setMemo("");
	};

	const handleSave = async () => {
		if (!canSave) return;
		Keyboard.dismiss();
		await onSave(name.trim(), memo.trim());
		resetForm();
	};

	const handleDelete = async () => {
		if (!onDelete) return;
		Keyboard.dismiss();
		await onDelete();
		resetForm();
	};

	const handleDismiss = () => {
		Keyboard.dismiss();
		onDismiss();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			statusBarTranslucent
			onRequestClose={handleDismiss}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.container}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
			>
				{/* 背景オーバーレイ - タップでキーボードを閉じる & モーダルを閉じる */}
				<TouchableWithoutFeedback onPress={handleDismiss}>
					<View style={styles.overlay} />
				</TouchableWithoutFeedback>

				{/* ボトムシート本体 */}
				<Surface style={styles.surface} elevation={0}>
					{/* ドラッグハンドル */}
					<View style={styles.handle} />

					{/* ヘッダー */}
					<View style={styles.header}>
						<Text variant="titleLarge" style={styles.title}>
							{title}
						</Text>
						<IconButton
							icon="close"
							onPress={handleDismiss}
							disabled={loading}
							mode="contained-tonal"
							size={20}
						/>
					</View>

					<Divider />

					{/* スクロール可能なコンテンツ */}
					<ScrollView
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						bounces={false}
						contentContainerStyle={{ paddingBottom: bottomPadding }}
					>
						{/* フォーム */}
						<View style={styles.content}>
							<TextInput
								label="アイテム名"
								value={name}
								onChangeText={setName}
								mode="outlined"
								disabled={loading}
								style={styles.input}
								outlineStyle={styles.inputOutline}
								left={<TextInput.Icon icon="cart-outline" />}
								returnKeyType="next"
							/>

							<TextInput
								label="メモ（任意）"
								value={memo}
								onChangeText={setMemo}
								mode="outlined"
								multiline
								numberOfLines={3}
								disabled={loading}
								style={styles.input}
								outlineStyle={styles.inputOutline}
								left={<TextInput.Icon icon="note-text-outline" />}
							/>
						</View>

						{/* ボタン */}
						<View style={styles.buttons}>
							<Button
								mode="contained"
								onPress={handleSave}
								loading={loading}
								disabled={!canSave}
								style={styles.button}
								contentStyle={styles.buttonContent}
								icon={saveButtonIcon}
							>
								{saveButtonText}
							</Button>

							{!isCreateMode && onDelete && (
								<Button
									mode="outlined"
									onPress={handleDelete}
									loading={loading}
									disabled={loading}
									textColor={theme.colors.error}
									style={[styles.button, { borderColor: theme.colors.error }]}
									contentStyle={styles.buttonContent}
									icon="trash-can-outline"
								>
									削除する
								</Button>
							)}
						</View>
					</ScrollView>
				</Surface>
			</KeyboardAvoidingView>
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
		maxHeight: "85%",
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
	input: {
		marginBottom: spacing.md,
		backgroundColor: colors.white,
	},
	inputOutline: {
		borderRadius: spacing.sm + spacing.xs,
	},
	buttons: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.md,
		gap: spacing.sm + spacing.xs,
	},
	button: {
		borderRadius: spacing.lg,
	},
	buttonContent: {
		paddingVertical: spacing.xs,
	},
});
