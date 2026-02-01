import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";

import { useJoinGroup, useUserGroups } from "@/features/group";
import { useSupabase } from "@/hooks/useSupabase";
import { colors } from "@/theme/paperTheme";
import {
	clearPendingInviteToken,
	getPendingInviteToken,
} from "@/utils/pending-invite";

export default function ProtectedIndex() {
	const { isLoaded, session } = useSupabase();
	const { hasGroup, isLoading, refetch } = useUserGroups();
	const { joinGroup } = useJoinGroup();
	const [isProcessingInvite, setIsProcessingInvite] = useState(true);

	useEffect(() => {
		// セッションが読み込まれるまで待機
		if (!isLoaded || !session?.user) {
			return;
		}

		const processPendingInvite = async () => {
			try {
				const pendingToken = await getPendingInviteToken();

				if (pendingToken) {
					const invitationLink = `sato://invite/${pendingToken}`;
					await joinGroup(invitationLink);
					await clearPendingInviteToken();
					await refetch();
				}
			} catch {
				await clearPendingInviteToken();
			} finally {
				setIsProcessingInvite(false);
			}
		};

		processPendingInvite();
	}, [isLoaded, session?.user, joinGroup, refetch]);

	if (!isLoaded || isLoading || isProcessingInvite) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={colors.primary} />
				{isProcessingInvite && isLoaded && (
					<Text style={{ marginTop: 16, color: colors.text }}>
						招待を処理中...
					</Text>
				)}
			</View>
		);
	}

	if (hasGroup) {
		return <Redirect href="/(protected)/(tabs)/shopping" />;
	}

	return <Redirect href="/(protected)/(group)" />;
}
