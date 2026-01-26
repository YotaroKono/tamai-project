import { View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";
import { commonStyles } from "@/theme/paperTheme";

export default function ShoppingScreen() {
	const insets = useSafeAreaInsets();
	const groupName = "佐藤家";

	return (
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

			{/* コンテンツ */}
			<View style={commonStyles.contentCentered}>
				<Text variant="bodyLarge">買い物機能は準備中です</Text>
			</View>
		</View>
	);
}
