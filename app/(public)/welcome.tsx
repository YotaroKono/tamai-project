import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./welcome.styles";

export default function Page() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Text style={styles.logo}>S</Text>
				<Text style={styles.appName}>sato</Text>
			</View>

			<View style={styles.buttonContainer}>
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
