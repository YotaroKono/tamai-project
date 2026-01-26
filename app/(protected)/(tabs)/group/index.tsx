import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<Text style={styles.title}>グループ</Text>
			<Text style={styles.placeholder}>グループ機能は準備中です</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
		paddingHorizontal: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
		marginTop: 8,
	},
	placeholder: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginTop: 40,
	},
});
