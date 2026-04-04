import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors } from "@/theme/paperTheme";
import type { Item } from "@/types/items";

interface ItemCardProps {
	item: Item;
	userName: string;
	onPress: () => void;
	onCheckboxPress: () => void;
	disabled?: boolean;
	isFirst?: boolean;
	isLast?: boolean;
}

/**
 * アイテムカード
 * File 1.png のリストアイテムを参考
 */
export function ItemCard({
	item,
	userName,
	onPress,
	onCheckboxPress,
	disabled = false,
	isFirst = false,
	isLast = false,
}: ItemCardProps) {
	return (
		<Pressable onPress={onPress} disabled={disabled}>
			<View
				style={[
					styles.container,
					isFirst && styles.firstItem,
					isLast && styles.lastItem,
				]}
			>
				{/* チェックボックス */}
				<Pressable
					onPress={onCheckboxPress}
					disabled={disabled}
					style={[
						styles.checkboxContainer,
						item.is_purchased && styles.checkboxChecked,
					]}
				>
					{item.is_purchased && (
						<MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
					)}
				</Pressable>

				{/* アイテム情報 */}
				<View style={styles.content}>
					<Text
						variant="bodyLarge"
						style={[styles.itemName, item.is_purchased && styles.purchasedText]}
					>
						{item.name}
					</Text>
					{item.memo && (
						<Text
							variant="bodySmall"
							style={[styles.memo, item.is_purchased && styles.purchasedText]}
						>
							{item.memo}
						</Text>
					)}
				</View>

				{/* 登録者名 */}
				<Text variant="bodySmall" style={styles.userName}>
					{userName}
				</Text>
			</View>
			{/* セパレーター（最後のアイテム以外） */}
			{!isLast && <View style={styles.separator} />}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: colors.white,
	},
	firstItem: {
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	lastItem: {
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
	},
	separator: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginLeft: 56,
	},
	checkboxContainer: {
		width: 24,
		height: 24,
		borderWidth: 1,
		borderColor: "#C0C0C0",
		borderRadius: 12,
		marginRight: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	checkboxChecked: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	content: {
		flex: 1,
		marginLeft: 8,
	},
	itemName: {
		fontWeight: "500",
	},
	memo: {
		color: "#666",
		marginTop: 2,
	},
	userName: {
		color: "#999",
		marginLeft: 8,
	},
	purchasedText: {
		textDecorationLine: "line-through",
		opacity: 0.5,
	},
});
