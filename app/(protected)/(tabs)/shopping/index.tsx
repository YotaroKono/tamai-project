import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, PaperProvider, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";
import { EmptyItemList } from "@/components/items/EmptyItemList";
import { ItemBottomSheet } from "@/components/items/ItemBottomSheet";
import { ItemCard } from "@/components/items/ItemCard";
import { TEST_USER_NAMES } from "@/constants/dev";
import { useCreateItem } from "@/hooks/useCreateItem";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useItems } from "@/hooks/useItems";
import { useUpdateItem } from "@/hooks/useUpdateItem";
import { commonStyles } from "@/theme/paperTheme";
import type { Item } from "@/types/items";

export default function ShoppingScreen() {
	const insets = useSafeAreaInsets();
	const groupName = "佐藤家";

	// Hooks
	const { items, loading: itemsLoading, refetch } = useItems();
	const { createItem, loading: createLoading } = useCreateItem();
	const { updateItem, loading: updateLoading } = useUpdateItem();
	const { deleteItem, loading: deleteLoading } = useDeleteItem();

	// ボトムシート状態
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [bottomSheetMode, setBottomSheetMode] = useState<"create" | "edit">(
		"create",
	);
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();

	// アイテム追加ボタン
	const handleAddPress = () => {
		setBottomSheetMode("create");
		setSelectedItem(undefined);
		setBottomSheetVisible(true);
	};

	// アイテムカードタップ（編集）
	const handleItemPress = (item: Item) => {
		setBottomSheetMode("edit");
		setSelectedItem(item);
		setBottomSheetVisible(true);
	};

	// チェックボックスタップ（購入状態変更）
	const handleCheckboxPress = async (item: Item) => {
		await updateItem(item.id, { is_purchased: !item.is_purchased });
		refetch(); // 更新後にリストを再取得
	};

	// ボトムシート保存
	const handleBottomSheetSave = async (name: string, memo: string) => {
		if (bottomSheetMode === "create") {
			await createItem(name, memo);
		} else if (selectedItem) {
			await updateItem(selectedItem.id, { name, memo });
		}
		setBottomSheetVisible(false);
		refetch(); // 保存後にリストを再取得
	};

	// ボトムシート削除
	const handleBottomSheetDelete = async () => {
		if (selectedItem) {
			await deleteItem(selectedItem.id);
			setBottomSheetVisible(false);
			refetch(); // 削除後にリストを再取得
		}
	};

	// ユーザー名取得
	const getUserName = (userId: string) => {
		return TEST_USER_NAMES[userId] || "不明";
	};

	return (
		<PaperProvider>
			<View style={[commonStyles.screenContainer, { paddingTop: insets.top }]}>
				{/* ヘッダー */}
				<Surface style={commonStyles.header} elevation={0}>
					<View style={commonStyles.headerContent}>
						<AppLogo size={40} />
						<Text variant="titleLarge" style={{ fontWeight: "bold" }}>
							{groupName}
						</Text>
					</View>
				</Surface>

				{/* タイトル */}
				<View style={styles.titleContainer}>
					<Text variant="headlineSmall" style={styles.title}>
						買い物リスト
					</Text>
				</View>

				{/* アイテムリスト */}
				{items.length === 0 && !itemsLoading ? (
					<EmptyItemList />
				) : (
					<FlatList
						data={items}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ItemCard
								item={item}
								userName={getUserName(item.created_by_user_id)}
								onPress={() => handleItemPress(item)}
								onCheckboxPress={() => handleCheckboxPress(item)}
								disabled={updateLoading}
							/>
						)}
						contentContainerStyle={styles.listContent}
					/>
				)}

				{/* 追加ボタン（FAB） */}
				<FAB
					icon="plus"
					label="追加する"
					style={[styles.fab, { bottom: insets.bottom + 16 }]}
					onPress={handleAddPress}
				/>

				{/* ボトムシート */}
				<ItemBottomSheet
					visible={bottomSheetVisible}
					mode={bottomSheetMode}
					item={selectedItem}
					onDismiss={() => setBottomSheetVisible(false)}
					onSave={handleBottomSheetSave}
					onDelete={
						bottomSheetMode === "edit" ? handleBottomSheetDelete : undefined
					}
					loading={createLoading || updateLoading || deleteLoading}
				/>
			</View>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	title: {
		fontWeight: "bold",
	},
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 100,
	},
	fab: {
		position: "absolute",
		right: 16,
		backgroundColor: "#FF6B35",
	},
});
