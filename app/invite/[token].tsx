import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useJoinGroup } from "@/features/group";
import { useSupabase } from "@/hooks/useSupabase";
import { colors, commonStyles } from "@/theme/paperTheme";
import { savePendingInviteToken } from "@/utils/pending-invite";

export default function InviteScreen() {
	const { token } = useLocalSearchParams<{ token: string }>();
	const { session, isLoaded } = useSupabase();
	const { joinGroup, isLoading } = useJoinGroup();
	const [error, setError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(true);

	useEffect(() => {
		if (!isLoaded) return;

		const processInvitation = async () => {
			// トークンがない場合は適切な画面にリダイレクト（エラー表示しない）
			if (!token) {
				if (session?.user) {
					// ProtectedIndexで保存済みトークンを処理させる
					router.replace("/(protected)");
				} else {
					router.replace("/(public)/welcome");
				}
				return;
			}

			// ログインしていない場合はトークンを保存してウェルカム画面へ
			if (!session?.user) {
				await savePendingInviteToken(token);
				router.replace("/(public)/welcome");
				return;
			}

			// ログイン済みの場合は直接グループに参加
			try {
				const invitationLink = `sato://invite/${token}`;
				await joinGroup(invitationLink);
				router.replace("/(protected)/(tabs)/shopping");
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "グループに参加できませんでした。";
				setError(errorMessage);
				setIsProcessing(false);
			}
		};

		processInvitation();
	}, [isLoaded, token, session?.user, joinGroup]);

	if (isProcessing || isLoading) {
		return (
			<SafeAreaView style={commonStyles.screenContainer}>
				<View style={styles.container}>
					<ActivityIndicator size="large" color={colors.primary} />
					<Text style={styles.loadingText}>招待を処理中...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={commonStyles.screenContainer}>
				<View style={styles.container}>
					<Text style={styles.errorText}>{error}</Text>
					<Button
						mode="contained"
						onPress={() => router.replace("/")}
						style={styles.button}
					>
						ホームに戻る
					</Button>
				</View>
			</SafeAreaView>
		);
	}

	return null;
}

const styles = {
	container: {
		flex: 1,
		justifyContent: "center" as const,
		alignItems: "center" as const,
		padding: 20,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: colors.text,
	},
	errorText: {
		fontSize: 16,
		color: "#FF0000",
		textAlign: "center" as const,
		marginBottom: 20,
	},
	button: {
		marginTop: 16,
	},
};
