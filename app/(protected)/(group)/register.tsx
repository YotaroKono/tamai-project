import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
	Button,
	HelperText,
	SegmentedButtons,
	Text,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCreateGroup, useJoinGroup } from "@/features/group";
import { useMembers } from "@/hooks/useMembers";
import { commonStyles } from "@/theme/paperTheme";

export default function GroupRegisterScreen() {
	const [activeTab, setActiveTab] = useState<"create" | "join">("create");
	const [familyName, setFamilyName] = useState("");
	const [invitationLinkInput, setInvitationLinkInput] = useState("");
	const [error, setError] = useState("");

	const { createGroupAsync, isLoading: isCreating } = useCreateGroup();
	const { joinGroup, isLoading: isJoining } = useJoinGroup();
	const { refetch: refetchMembers } = useMembers();

	const handleCreateGroup = async () => {
		setError("");
		if (!familyName.trim()) {
			setError("必須項目です。入力お願いします。");
			return;
		}

		try {
			const { result, invitationLink } = await createGroupAsync(
				familyName.trim(),
			);
			// グループ作成後にメンバー情報を再取得
			await refetchMembers();
			router.push({
				pathname: "./created",
				params: {
					groupName: result.group.name,
					invitationLink: invitationLink,
				},
			});
		} catch {
			setError(
				"グループを作成できませんでした。時間をおいて、もう一度お試しください。",
			);
		}
	};

	const handleJoinGroup = async () => {
		setError("");
		if (!invitationLinkInput.trim()) {
			setError("必須項目です。入力お願いします。");
			return;
		}

		try {
			await joinGroup(invitationLinkInput.trim());
			// グループ参加後にメンバー情報を再取得
			await refetchMembers();
			router.replace("/(protected)/(tabs)/shopping");
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "グループに参加できませんでした。時間をおいて、もう一度お試しください。";
			setError(errorMessage);
		}
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

				{/* Welcome Message */}
				<View style={commonStyles.sectionCentered}>
					<View style={commonStyles.avatarPlaceholder}>
						<Text style={commonStyles.avatarIcon}>👤</Text>
					</View>
					<Text style={commonStyles.welcomeText}>ようこそ</Text>
					<Text style={commonStyles.descriptionText}>
						ファミリースペースを作成するか、{"\n"}
						既存のスペースに参加してください
					</Text>
				</View>

				{/* Tab Navigation */}
				<View style={commonStyles.section}>
					<SegmentedButtons
						value={activeTab}
						onValueChange={(value) => {
							setActiveTab(value as "create" | "join");
							setError("");
						}}
						buttons={[
							{ value: "create", label: "作成する" },
							{ value: "join", label: "参加する" },
						]}
					/>
				</View>

				{/* Form Content */}
				<View style={commonStyles.formContainer}>
					{activeTab === "create" ? (
						<>
							<TextInput
								label="ファミリー名"
								mode="outlined"
								value={familyName}
								onChangeText={(text) => {
									setFamilyName(text);
									setError("");
								}}
								error={!!error}
							/>
							<HelperText type="error" visible={!!error}>
								{error}
							</HelperText>

							<Button
								mode="contained"
								onPress={handleCreateGroup}
								loading={isCreating}
								disabled={isCreating}
								contentStyle={commonStyles.buttonContentLarge}
							>
								スペースを作成
							</Button>
						</>
					) : (
						<>
							<TextInput
								label="招待リンク"
								mode="outlined"
								value={invitationLinkInput}
								onChangeText={(text) => {
									setInvitationLinkInput(text);
									setError("");
								}}
								error={!!error}
							/>
							<HelperText type="error" visible={!!error}>
								{error}
							</HelperText>

							<Button
								mode="contained"
								onPress={handleJoinGroup}
								loading={isJoining}
								disabled={isJoining}
								contentStyle={commonStyles.buttonContentLarge}
							>
								スペースに参加する
							</Button>
						</>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}
