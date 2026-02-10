import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";

import { buildInvitationLink } from "@/config/invitation";
import { useJoinGroup, useUserGroups } from "@/features/group";
import { useMembers } from "@/hooks/useMembers";
import { useSupabase } from "@/hooks/useSupabase";
import { colors } from "@/theme/paperTheme";
import {
	clearPendingInviteToken,
	getPendingInviteToken,
} from "@/utils/pending-invite";

export default function ProtectedIndex() {
	const { isLoaded, session } = useSupabase();
	const { hasGroup, isLoading, refetch: refetchUserGroups } = useUserGroups();
	const { joinGroup } = useJoinGroup();
	const { refetch: refetchMembers } = useMembers();
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
					const invitationLink = buildInvitationLink(pendingToken);
					await joinGroup(invitationLink);
					await clearPendingInviteToken();
					// グループとメンバー情報を再取得
					await refetchUserGroups();
					await refetchMembers();
				}
			} catch {
				await clearPendingInviteToken();
			} finally {
				setIsProcessingInvite(false);
			}
		};

		processPendingInvite();
	}, [isLoaded, session?.user, joinGroup, refetchUserGroups, refetchMembers]);

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
