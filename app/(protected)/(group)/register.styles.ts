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
		paddingBottom: 40,
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
	welcomeContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	avatarPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#D3D3D3",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	avatarIcon: {
		fontSize: 40,
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	descriptionText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 20,
	},
	tabContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
		marginBottom: 32,
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	activeTab: {
		borderBottomColor: "#FF6B35",
	},
	tabText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#999",
	},
	activeTabText: {
		color: "#FF6B35",
		fontWeight: "600",
	},
	formContainer: {
		flex: 1,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	input: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: 16,
		fontSize: 16,
		color: "#333",
		marginBottom: 8,
	},
	errorText: {
		fontSize: 12,
		color: "#FF0000",
		marginBottom: 16,
	},
	submitButton: {
		backgroundColor: "#FF6B35",
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 8,
		shadowColor: "#FF6B35",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
});
