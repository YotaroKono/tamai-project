import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";

export default function ShoppingScreen() {
	const insets = useSafeAreaInsets();
	const theme = useTheme();
	const familyName = "佐藤家";

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* ヘッダー */}
			<Surface style={styles.header} elevation={0}>
				<View style={styles.headerContent}>
					<AppLogo size={40} />
					<Text variant="titleLarge" style={styles.familyName}>
						{familyName}
					</Text>
				</View>
			</Surface>

			{/* コンテンツ */}
			<View style={styles.content}>
				<Text
					variant="bodyLarge"
					style={{ color: theme.colors.onSurfaceVariant }}
				>
					買い物機能は準備中です
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	header: {
		backgroundColor: "transparent",
		paddingHorizontal: 16,
		paddingVertical: 12,
		alignItems: "center",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	familyName: {
		fontWeight: "bold",
		color: "#333",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		alignItems: "center",
		marginTop: 40,
	},
});
