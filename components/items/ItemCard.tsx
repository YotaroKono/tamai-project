import { Pressable, StyleSheet, View } from "react-native";
import { Checkbox, Text } from "react-native-paper";
import { colors } from "@/theme/paperTheme";
import type { Item } from "@/types/items";

interface ItemCardProps {
	item: Item;
	userName: string;
	onPress: () => void;
	onCheckboxPress: () => void;
	disabled?: boolean;
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
}: ItemCardProps) {
	return (
		<Pressable onPress={onPress} disabled={disabled}>
			<View style={styles.container}>
				{/* チェックボックス */}
				<View style={styles.checkboxContainer}>
					<Checkbox
						status={item.is_purchased ? "checked" : "unchecked"}
						onPress={onCheckboxPress}
						disabled={disabled}
						uncheckedColor="#BDBDBD"
					/>
				</View>

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
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: colors.white,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#C0C0C0",
		marginBottom: 8,
	},
	checkboxContainer: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderColor: "#C0C0C0",
		borderRadius: 20,
		marginRight: 4,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
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
