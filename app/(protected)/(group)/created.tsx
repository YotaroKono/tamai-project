import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./created.styles";

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
		<SafeAreaView style={styles.container}>
			{/* Logo */}
			<View style={styles.logoContainer}>
				<View style={styles.logo}>
					<Text style={styles.logoText}>S</Text>
				</View>
			</View>

			{/* Success Icon */}
			<View style={styles.successContainer}>
				<View style={styles.checkmarkCircle}>
					<Text style={styles.checkmark}>✓</Text>
				</View>
			</View>

			{/* Success Message */}
			<View style={styles.messageContainer}>
				<Text style={styles.successTitle}>「佐藤家」を作成しました！</Text>
				<Text style={styles.successDescription}>
					まずは、招待リンクをコピーして、LINEなどで{"\n"}
					メンバーに共有しましょう。
				</Text>
			</View>

			{/* Invitation Link */}
			<View style={styles.linkContainer}>
				<View style={styles.linkInputContainer}>
					<TextInput
						style={styles.linkInput}
						value={invitationLink}
						editable={false}
					/>
					<Pressable style={styles.copyButton} onPress={handleCopyLink}>
						<Text style={styles.copyButtonText}>コピー</Text>
					</Pressable>
				</View>
			</View>

			{/* Navigate Button */}
			<View style={styles.buttonContainer}>
				<Pressable
					style={styles.navigateButton}
					onPress={handleNavigateToSpace}
				>
					<Text style={styles.navigateButtonText}>スペースに進む</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
