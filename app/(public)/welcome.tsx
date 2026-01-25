import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 60,
	},
	logoContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		fontSize: 120,
		fontWeight: "bold",
		color: "#FF6B35",
		marginBottom: 8,
	},
	appName: {
		fontSize: 32,
		fontWeight: "600",
		color: "#FF6B35",
		letterSpacing: 2,
	},
	buttonContainer: {
		width: "100%",
		paddingHorizontal: 32,
		gap: 16,
	},
	primaryButton: {
		backgroundColor: "#FF6B35",
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#FF6B35",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	secondaryButton: {
		backgroundColor: "transparent",
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#FF6B35",
	},
	secondaryButtonText: {
		color: "#FF6B35",
		fontSize: 18,
		fontWeight: "600",
	},
});
