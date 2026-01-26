import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
	Button,
	HelperText,
	SegmentedButtons,
	Text,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { commonStyles } from "@/theme/paperTheme";

export default function GroupRegisterScreen() {
	const [activeTab, setActiveTab] = useState<"create" | "join">("create");
	const [familyName, setFamilyName] = useState("");
	const [invitationLink, setInvitationLink] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		console.log("🔍 (group)/register.tsx が表示されています");
	}, []);

	const handleCreateGroup = () => {
		setError("");
		if (!familyName.trim()) {
			setError("必須項目です。入力お願いします。");
			return;
		}

		// TODO: グループ作成ロジック
		console.log("Creating group:", familyName);
		router.push("./created");
	};

	const handleJoinGroup = () => {
		setError("");
		if (!invitationLink.trim()) {
			setError("この項目は必須です。");
			return;
		}

		// TODO: グループ参加ロジック
		console.log("Joining group with link:", invitationLink);
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
					<Text style={commonStyles.welcomeText}>ようこそ、佐藤さん</Text>
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
								value={invitationLink}
								onChangeText={(text) => {
									setInvitationLink(text);
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
