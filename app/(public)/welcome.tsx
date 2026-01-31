import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";

import { styles } from "./welcome.styles";

export default function Page() {
	const { signInWithGoogle, isLoaded } = useGoogleSignIn();

	const handleGoogleSignIn = async () => {
		if (!isLoaded) return;

		try {
			await signInWithGoogle();
		} catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image
					source={require("@/assets/icon.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
				<Text style={styles.catchphrase}>家族全員で必要な買い物を把握する</Text>
			</View>

			<View style={styles.buttonContainer}>
				<Text style={styles.sectionTitle}>会員登録</Text>

				<Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
					<Text style={styles.googleButtonText}>Googleで登録する</Text>
				</Pressable>

				<View style={styles.loginLinkContainer}>
					<Text style={styles.loginText}>ログインは</Text>
					<Pressable onPress={handleGoogleSignIn}>
						<Text style={styles.loginLink}>こちら</Text>
					</Pressable>
					<Text style={styles.loginText}>から</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
