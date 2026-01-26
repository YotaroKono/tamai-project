import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { commonStyles } from "@/theme/paperTheme";

export default function GroupCreatedScreen() {
	const [invitationLink] = useState("https://example.com");

	const handleCopyLink = () => {
		// TODO: Clipboard機能実装
		Alert.alert("コピーしました", "招待リンクをクリップボードにコピーしました");
	};

	const handleNavigateToSpace = () => {
		router.replace("/(tabs)");
	};

	return (
		<SafeAreaView style={commonStyles.screenContainer}>
			<View style={commonStyles.contentLarge}>
				{/* Logo */}
				<View style={commonStyles.logoContainer}>
					<View style={commonStyles.logo}>
						<Text style={commonStyles.logoText}>S</Text>
					</View>
				</View>

				{/* Success Icon */}
				<View style={commonStyles.sectionCentered}>
					<View style={commonStyles.iconCircleLarge}>
						<Text style={commonStyles.iconText}>✓</Text>
					</View>
				</View>

				{/* Success Message */}
				<View style={commonStyles.sectionCenteredPadded}>
					<Text variant="headlineSmall" style={commonStyles.titleCenter}>
						「佐藤家」を作成しました！
					</Text>
					<Text variant="bodyMedium" style={commonStyles.textCenter}>
						まずは、招待リンクをコピーして、LINEなどで{"\n"}
						メンバーに共有しましょう。
					</Text>
				</View>

				{/* Invitation Link */}
				<View style={commonStyles.section}>
					<View style={commonStyles.row}>
						<TextInput
							style={commonStyles.inputFlex}
							value={invitationLink}
							editable={false}
							mode="outlined"
							dense
						/>
						<Button mode="contained" onPress={handleCopyLink}>
							コピー
						</Button>
					</View>
				</View>

				{/* Navigate Button */}
				<View style={commonStyles.bottomButtonContainer}>
					<Button
						mode="contained"
						onPress={handleNavigateToSpace}
						contentStyle={commonStyles.buttonContentLarge}
					>
						スペースに進む
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
