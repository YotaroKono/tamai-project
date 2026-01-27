import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
		gap: 16,
		marginBottom: 48,
	},
	logo: {
		width: 120,
		height: 120,
	},
	catchphrase: {
		fontSize: 14,
		color: "#666666",
		textAlign: "center",
		marginTop: 16,
		letterSpacing: 0.5,
	},
	buttonContainer: {
		width: "100%",
		paddingHorizontal: 48,
		gap: 12,
		alignItems: "center",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333333",
		marginBottom: 4,
	},
	googleButton: {
		backgroundColor: "#FFFFFF",
		paddingVertical: 14,
		paddingHorizontal: 48,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#DDDDDD",
		minWidth: 280,
	},
	googleButtonText: {
		color: "#333333",
		fontSize: 16,
		fontWeight: "500",
	},
	loginLinkContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
	},
	loginText: {
		fontSize: 14,
		color: "#666666",
	},
	loginLink: {
		fontSize: 14,
		color: "#FF6B35",
		fontWeight: "600",
		textDecorationLine: "underline",
	},
});
