import { useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	Share,
	StyleSheet,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Button,
	HelperText,
	Surface,
	Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	useCreateInvitation,
	useGroupMembers,
	useUserGroups,
} from "@/features/group";
import { colors, commonStyles, spacing } from "@/theme/paperTheme";

export default function GroupScreen() {
	const insets = useSafeAreaInsets();
	const { groups } = useUserGroups();
	const { members, isLoading, error, refetch } = useGroupMembers();
	const { createInvitationAsync, isLoading: isGettingInvitation } =
		useCreateInvitation();
	const [invitationError, setInvitationError] = useState<string | null>(null);

	const groupName = groups.length > 0 ? groups[0].name : "グループ";

	const handleShareInvitationLink = async () => {
		setInvitationError(null);
		try {
			const result = await createInvitationAsync();
			await Share.share({
				message: `${groupName}に参加しませんか？\n${result.invitationLink}`,
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "招待リンクの共有に失敗しました。時間をおいて、もう一度お試しください。";
			setInvitationError(errorMessage);
		}
	};

	if (isLoading) {
		return (
			<View style={[commonStyles.screenContainer, { paddingTop: insets.top }]}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</View>
		);
	}

	return (
		<View style={[commonStyles.screenContainer, { paddingTop: insets.top }]}>
			{/* ヘッダー */}
			<Surface style={commonStyles.header} elevation={0}>
				<View style={commonStyles.headerContent}>
					<Image
						source={require("@/assets/icon.png")}
						style={styles.headerIcon}
						resizeMode="contain"
					/>
					<Text
						variant="titleLarge"
						style={{ fontWeight: "bold", color: colors.text }}
					>
						{groupName}
					</Text>
				</View>
			</Surface>

			{/* タイトル */}
			<View style={styles.titleContainer}>
				<Text variant="headlineSmall" style={styles.title}>
					メンバー
				</Text>
			</View>

			{error ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
					<Button mode="outlined" onPress={refetch}>
						再読み込み
					</Button>
				</View>
			) : (
				<FlatList
					data={members}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Pressable>
							<View style={styles.memberCard}>
								<Avatar.Icon
									size={40}
									icon="account-circle"
									style={styles.avatar}
								/>
								<View style={styles.memberContent}>
									<Text variant="bodyLarge" style={styles.memberName}>
										{item.display_name}
									</Text>
								</View>
							</View>
						</Pressable>
					)}
					contentContainerStyle={styles.listContent}
					ListEmptyComponent={
						<Text style={styles.emptyText}>メンバーがいません</Text>
					}
				/>
			)}

			{/* 招待リンクセクション */}
			<View style={styles.invitationSection}>
				<Text style={styles.invitationTitle}>招待リンク</Text>
				<Text style={styles.invitationDescription}>
					リンクの有効期限は24時間です。下記ボタンから招待リンクを共有できます。
				</Text>
				<Button
					mode="contained"
					onPress={handleShareInvitationLink}
					loading={isGettingInvitation}
					disabled={isGettingInvitation}
					style={styles.shareButton}
					contentStyle={styles.buttonContent}
				>
					リンクを共有する
				</Button>
				<HelperText type="error" visible={!!invitationError}>
					{invitationError}
				</HelperText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	headerIcon: {
		width: 40,
		height: 40,
	},
	titleContainer: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text,
	},
	listContent: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
	},
	memberCard: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#E6E5E5",
		borderRadius: 8,
		marginBottom: 8,
	},
	avatar: {
		backgroundColor: "transparent",
	},
	memberContent: {
		flex: 1,
		marginLeft: 8,
	},
	memberName: {
		fontWeight: "500",
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginTop: spacing.xl,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	errorText: {
		fontSize: 14,
		color: "#FF0000",
		textAlign: "center",
	},
	invitationSection: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
	},
	invitationTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.text,
		marginBottom: spacing.sm,
	},
	invitationDescription: {
		fontSize: 14,
		color: colors.text,
		lineHeight: 20,
		marginBottom: spacing.md,
	},
	shareButton: {
		borderRadius: 8,
	},
	buttonContent: {
		paddingVertical: spacing.sm,
	},
});
