import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import {
	Button,
	IconButton,
	Portal,
	Text,
	TextInput,
} from "react-native-paper";
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
 * File 2.png (追加), File 3.png (編集) を参考
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
	const [name, setName] = useState("");
	const [memo, setMemo] = useState("");

	// itemが変更されたら初期値を設定
	useEffect(() => {
		if (mode === "edit" && item) {
			setName(item.name);
			setMemo(item.memo || "");
		} else {
			setName("");
			setMemo("");
		}
	}, [mode, item]);

	const handleSave = async () => {
		if (!name.trim()) return;
		await onSave(name.trim(), memo.trim());
		setName("");
		setMemo("");
	};

	const handleDelete = async () => {
		if (onDelete) {
			await onDelete();
			setName("");
			setMemo("");
		}
	};

	const title = mode === "create" ? "アイテムを追加" : "アイテムを編集";
	const saveButtonText = mode === "create" ? "追加する" : "編集する";

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={styles.modal}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
					{/* ヘッダー */}
					<View style={styles.header}>
						<Text variant="titleLarge">{title}</Text>
						<IconButton icon="close" onPress={onDismiss} disabled={loading} />
					</View>

					{/* フォーム */}
					<View style={styles.form}>
						<TextInput
							label="アイテム名"
							value={name}
							onChangeText={setName}
							mode="outlined"
							disabled={loading}
							style={styles.input}
						/>

						<TextInput
							label="メモ"
							value={memo}
							onChangeText={setMemo}
							mode="outlined"
							multiline
							numberOfLines={3}
							disabled={loading}
							style={styles.input}
						/>
					</View>

					{/* ボタン */}
					<View style={styles.buttons}>
						<Button
							mode="contained"
							onPress={handleSave}
							loading={loading}
							disabled={loading || !name.trim()}
							style={styles.saveButton}
						>
							{saveButtonText}
						</Button>

						{mode === "edit" && onDelete && (
							<Button
								mode="outlined"
								onPress={handleDelete}
								loading={loading}
								disabled={loading}
								textColor="red"
								style={styles.deleteButton}
							>
								削除する
							</Button>
						)}
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	modal: {
		margin: 0,
		justifyContent: "flex-end",
	},
	container: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 32,
		maxHeight: "80%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 24,
		paddingRight: 8,
		paddingTop: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	form: {
		padding: 24,
	},
	input: {
		marginBottom: 16,
	},
	buttons: {
		paddingHorizontal: 24,
		gap: 12,
	},
	saveButton: {
		borderRadius: 24,
	},
	deleteButton: {
		borderRadius: 24,
	},
});
