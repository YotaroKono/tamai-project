import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Button,
	Card,
	HelperText,
	Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	useCreateInvitation,
	useGroupMembers,
	useUserGroups,
} from "@/features/group";
import { colors, spacing } from "@/theme/paperTheme";

export default function GroupScreen() {
	const insets = useSafeAreaInsets();
	const { groups } = useUserGroups();
	const { members, isLoading, error, refetch } = useGroupMembers();
	const { createInvitationAsync, isLoading: isGettingInvitation } =
		useCreateInvitation();
	const [invitationError, setInvitationError] = useState<string | null>(null);
	const [copySuccess, setCopySuccess] = useState(false);

	const groupName = groups.length > 0 ? groups[0].name : "グループ";

	const handleCopyInvitationLink = async () => {
		setInvitationError(null);
		setCopySuccess(false);
		try {
			const result = await createInvitationAsync();
			await Clipboard.setStringAsync(result.invitationLink);
			setCopySuccess(true);
			// 3秒後に成功メッセージを消す
			setTimeout(() => setCopySuccess(false), 3000);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "招待リンクの取得に失敗しました。時間をおいて、もう一度お試しください。";
			setInvitationError(errorMessage);
		}
	};

	if (isLoading) {
		return (
			<View style={[styles.container, { paddingTop: insets.top }]}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</View>
		);
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* グループヘッダー */}
			<View style={styles.groupHeader}>
				<View style={styles.groupIcon}>
					<Text style={styles.groupIconText}>{groupName.charAt(0)}</Text>
				</View>
				<Text style={styles.groupName}>{groupName}</Text>
			</View>

			{/* メンバー一覧セクション */}
			<Text style={styles.sectionTitle}>メンバー</Text>

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
						<Card style={styles.memberCard} mode="outlined">
							<Card.Content style={styles.memberCardContent}>
								<Avatar.Icon size={40} icon="account" style={styles.avatar} />
								<Text style={styles.memberName}>{item.display_name}</Text>
							</Card.Content>
						</Card>
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
					リンクの有効期限は24時間です。下記ボタンをクリックすると有効なリンクがコピーされます。
				</Text>
				<Button
					mode="contained"
					onPress={handleCopyInvitationLink}
					loading={isGettingInvitation}
					disabled={isGettingInvitation}
					style={styles.copyButton}
					contentStyle={styles.buttonContent}
				>
					リンクをコピーする
				</Button>
				{copySuccess && (
					<HelperText type="info" visible={copySuccess}>
						リンクをコピーしました
					</HelperText>
				)}
				<HelperText type="error" visible={!!invitationError}>
					{invitationError}
				</HelperText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: spacing.md,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	groupHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.md,
		marginTop: spacing.lg,
		marginBottom: spacing.xl,
	},
	groupIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	groupIconText: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.white,
	},
	groupName: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text,
		marginBottom: spacing.md,
	},
	listContent: {
		paddingBottom: spacing.md,
	},
	memberCard: {
		marginBottom: spacing.sm,
		backgroundColor: colors.surface,
	},
	memberCardContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	avatar: {
		backgroundColor: "#E0E0E0",
	},
	memberName: {
		fontSize: 16,
		color: colors.text,
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
	copyButton: {
		borderRadius: 8,
	},
	buttonContent: {
		paddingVertical: spacing.sm,
	},
});
