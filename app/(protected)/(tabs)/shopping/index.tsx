import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, SegmentedButtons, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";
import { EmptyItemList } from "@/components/items/EmptyItemList";
import { ItemBottomSheet } from "@/components/items/ItemBottomSheet";
import { ItemCard } from "@/components/items/ItemCard";
import { useUserGroups } from "@/features/group";
import { useCreateItem } from "@/hooks/useCreateItem";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useItems } from "@/hooks/useItems";
import { useMembers } from "@/hooks/useMembers";
import { useUpdateItem } from "@/hooks/useUpdateItem";
import { colors, commonStyles, spacing } from "@/theme/paperTheme";
import type { Item } from "@/types/items";

export default function ShoppingScreen() {
	const insets = useSafeAreaInsets();

	// Hooks
	const { groups } = useUserGroups();
	const groupName = groups.length > 0 ? groups[0].name : "グループ";
	const { items, loading: itemsLoading, refetch } = useItems();
	const { createItem, loading: createLoading } = useCreateItem();
	const { updateItem, loading: updateLoading } = useUpdateItem();
	const { deleteItem, loading: deleteLoading } = useDeleteItem();
	const { getMemberName } = useMembers();

	// タブ状態
	const [activeTab, setActiveTab] = useState<"unpurchased" | "purchased">(
		"unpurchased",
	);

	// ボトムシート状態
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [bottomSheetMode, setBottomSheetMode] = useState<"create" | "edit">(
		"create",
	);
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();

	// タブに応じてアイテムをフィルタリング
	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			if (activeTab === "unpurchased") {
				return !item.is_purchased;
			}
			return item.is_purchased;
		});
	}, [items, activeTab]);

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

	return (
		<View style={[commonStyles.screenContainer, { paddingTop: insets.top }]}>
			{/* ヘッダー */}
			<Surface style={commonStyles.header} elevation={0}>
				<View style={commonStyles.headerContent}>
					<AppLogo size={40} />
					<Text
						variant="titleLarge"
						style={{ fontWeight: "bold", color: colors.text }}
					>
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

			{/* タブ */}
			<View style={styles.tabContainer}>
				<SegmentedButtons
					value={activeTab}
					onValueChange={(value) =>
						setActiveTab(value as "unpurchased" | "purchased")
					}
					buttons={[
						{ value: "unpurchased", label: "未購入" },
						{ value: "purchased", label: "購入済み" },
					]}
					style={styles.segmentedButtons}
					theme={{ roundness: 2 }}
				/>
			</View>

			{/* アイテムリスト */}
			{filteredItems.length === 0 && !itemsLoading ? (
				<EmptyItemList />
			) : (
				<FlatList
					data={filteredItems}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ItemCard
							item={item}
							userName={getMemberName(item.created_by_user_id)}
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
				mode="elevated"
				variant="secondary"
				style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
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
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text,
	},
	tabContainer: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
	},
	segmentedButtons: {
		borderRadius: 16,
	},
	listContent: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl * 3 + spacing.md, // FAB用の余白
	},
	fab: {
		position: "absolute",
		right: spacing.md,
		borderRadius: spacing.md,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
});
