import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
		paddingHorizontal: 24,
	},
	logoContainer: {
		alignItems: "flex-start",
		paddingTop: 8,
		paddingBottom: 60,
	},
	logo: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: "#FF6B35",
		alignItems: "center",
		justifyContent: "center",
	},
	logoText: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	successContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	checkmarkCircle: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 4,
		borderColor: "#FF6B35",
		alignItems: "center",
		justifyContent: "center",
	},
	checkmark: {
		fontSize: 60,
		fontWeight: "bold",
		color: "#FF6B35",
	},
	messageContainer: {
		alignItems: "center",
		marginBottom: 40,
		paddingHorizontal: 16,
	},
	successTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
		textAlign: "center",
	},
	successDescription: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 22,
	},
	linkContainer: {
		marginBottom: 40,
	},
	linkInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	linkInput: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: 16,
		fontSize: 14,
		color: "#333",
	},
	copyButton: {
		backgroundColor: "#FF6B35",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	copyButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
	buttonContainer: {
		flex: 1,
		justifyContent: "flex-end",
		paddingBottom: 20,
	},
	navigateButton: {
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
	navigateButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
