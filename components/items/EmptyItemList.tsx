import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { EMPTY_LIST_MESSAGE } from "@/constants/items";

/**
 * アイテムリストが空の時の表示
 * File 5.png を参考
 */
export function EmptyItemList() {
	return (
		<View style={styles.container}>
			<Text variant="bodyMedium" style={styles.message}>
				{EMPTY_LIST_MESSAGE}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		paddingVertical: 64,
	},
	message: {
		textAlign: "center",
		color: "#666",
		lineHeight: 24,
	},
});
