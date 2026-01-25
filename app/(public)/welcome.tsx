import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
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
				<Text style={styles.logo}>S</Text>
				<Text style={styles.appName}>sato</Text>
			</View>

			<View style={styles.buttonContainer}>
				<Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
					<Text style={styles.googleButtonText}>Continue with Google</Text>
				</Pressable>

				<View style={styles.dividerContainer}>
					<View style={styles.dividerLine} />
					<Text style={styles.dividerText}>OR</Text>
					<View style={styles.dividerLine} />
				</View>

				<Pressable
					style={styles.primaryButton}
					onPress={() => router.push("/sign-up")}
				>
					<Text style={styles.primaryButtonText}>Sign Up</Text>
				</Pressable>

				<Pressable
					style={styles.secondaryButton}
					onPress={() => router.push("/sign-in")}
				>
					<Text style={styles.secondaryButtonText}>Sign In</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
