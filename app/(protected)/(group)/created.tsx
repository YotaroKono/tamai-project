import { router, useLocalSearchParams } from "expo-router";
import { Share, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { commonStyles } from "@/theme/paperTheme";

export default function GroupCreatedScreen() {
	const { groupName, invitationLink } = useLocalSearchParams<{
		groupName: string;
		invitationLink: string;
	}>();

	const handleShare = async () => {
		if (invitationLink) {
			await Share.share({
				message: invitationLink,
			});
		}
	};

	const handleNavigateToSpace = () => {
		router.replace("/(protected)/(tabs)/shopping");
	};

	return (
		<SafeAreaView style={commonStyles.screenContainer}>
			<View style={commonStyles.contentLarge}>
				{/* Logo */}
				<View style={commonStyles.logoContainer}>
					<View style={commonStyles.logo}>
						<Text style={commonStyles.logoText}>S</Text>
					</View>
				</View>

				{/* Success Icon */}
				<View style={commonStyles.sectionCentered}>
					<View style={commonStyles.iconCircleLarge}>
						<Text style={commonStyles.iconText}>✓</Text>
					</View>
				</View>

				{/* Success Message */}
				<View style={commonStyles.sectionCenteredPadded}>
					<Text variant="headlineSmall" style={commonStyles.titleCenter}>
						「{groupName}」を作成しました！
					</Text>
					<Text variant="bodyMedium" style={commonStyles.textCenter}>
						招待リンクをLINEなどで{"\n"}
						メンバーに共有しましょう。
					</Text>
				</View>

				{/* Invitation Link */}
				<View style={commonStyles.row}>
					<View style={commonStyles.inviteLinkBox}>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							style={commonStyles.inviteLinkText}
						>
							{invitationLink}
						</Text>
					</View>

					<Button mode="contained" onPress={handleShare}>
						共有
					</Button>
				</View>

				{/* Navigate Button */}
				<View style={commonStyles.bottomButtonContainer}>
					<Button
						mode="contained"
						onPress={handleNavigateToSpace}
						contentStyle={commonStyles.buttonContentLarge}
					>
						スペースに進む
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
