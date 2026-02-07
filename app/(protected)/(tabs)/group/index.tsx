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
import { UserProfileBottomSheet } from "@/components/user/UserProfileBottomSheet";
import { DEV_SKIP_AUTH, DEV_USER_ID } from "@/config/dev";
import { useCreateInvitation, useUserGroups } from "@/features/group";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useMembers } from "@/hooks/useMembers";
import { useSupabase } from "@/hooks/useSupabase";
import { colors, commonStyles, spacing } from "@/theme/paperTheme";

export default function GroupScreen() {
	const insets = useSafeAreaInsets();
	const { session, signOut } = useSupabase();
	const { groups } = useUserGroups();
	const { members, isLoading, error, refetch } = useMembers();
	const { createInvitationAsync, isLoading: isGettingInvitation } =
		useCreateInvitation();
	const {
		deleteAccount,
		isLoading: isDeleting,
		error: deleteError,
	} = useDeleteAccount();
	const [invitationError, setInvitationError] = useState<string | null>(null);
	const [isProfileSheetVisible, setIsProfileSheetVisible] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const groupName = groups.length > 0 ? groups[0].name : "グループ";

	// 現在のユーザーIDを取得
	const currentUserId =
		session?.user?.id ?? (DEV_SKIP_AUTH ? DEV_USER_ID : null);

	// 自分自身と他のメンバーを分離
	const currentUser = members.find((m) => m.user_id === currentUserId);
	const otherMembers = members.filter((m) => m.user_id !== currentUserId);

	const handleOpenProfileSheet = () => {
		setIsProfileSheetVisible(true);
	};

	const handleCloseProfileSheet = () => {
		setIsProfileSheetVisible(false);
	};

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await signOut();
		} finally {
			setIsLoggingOut(false);
			setIsProfileSheetVisible(false);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			await deleteAccount();
		} catch {
			// エラーはuseDeleteAccount内で管理されるため、ここでは何もしない
		}
	};

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

			{error ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
					<Button mode="outlined" onPress={refetch}>
						再読み込み
					</Button>
				</View>
			) : (
				<FlatList
					data={otherMembers}
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
					ListHeaderComponent={
						<>
							{/* あなたセクション */}
							{currentUser && (
								<>
									<Text variant="titleMedium" style={styles.sectionTitle}>
										あなた
									</Text>
									<Pressable onPress={handleOpenProfileSheet}>
										<View style={styles.memberCard}>
											<Avatar.Icon
												size={40}
												icon="account-circle"
												style={styles.avatar}
											/>
											<View style={styles.memberContent}>
												<Text variant="bodyLarge" style={styles.memberName}>
													{currentUser.display_name}
												</Text>
											</View>
										</View>
									</Pressable>
								</>
							)}

							{/* メンバーセクション */}
							{otherMembers.length > 0 && (
								<Text variant="titleMedium" style={styles.sectionTitle}>
									メンバー
								</Text>
							)}
						</>
					}
					ListEmptyComponent={
						!currentUser ? (
							<Text style={styles.emptyText}>メンバーがいません</Text>
						) : null
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

			{/* ユーザープロフィールボトムシート */}
			<UserProfileBottomSheet
				visible={isProfileSheetVisible}
				displayName={currentUser?.display_name ?? ""}
				onDismiss={handleCloseProfileSheet}
				onLogout={handleLogout}
				onDeleteAccount={handleDeleteAccount}
				loading={isLoggingOut}
				isDeleting={isDeleting}
				deleteError={deleteError}
			/>
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
	listContent: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
	},
	sectionTitle: {
		fontWeight: "600",
		color: colors.text,
		marginBottom: spacing.sm,
		marginTop: spacing.sm,
	},
	memberCard: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: colors.white,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E3E3E3",
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
