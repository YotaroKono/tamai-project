import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
				<View style={commonStyles.tabContainer}>
					<Pressable
						style={[
							commonStyles.tab,
							activeTab === "create" && commonStyles.tabActive,
						]}
						onPress={() => {
							setActiveTab("create");
							setError("");
						}}
					>
						<Text
							style={[
								commonStyles.tabText,
								activeTab === "create" && commonStyles.tabTextActive,
							]}
						>
							作成する
						</Text>
					</Pressable>
					<Pressable
						style={[
							commonStyles.tab,
							activeTab === "join" && commonStyles.tabActive,
						]}
						onPress={() => {
							setActiveTab("join");
							setError("");
						}}
					>
						<Text
							style={[
								commonStyles.tabText,
								activeTab === "join" && commonStyles.tabTextActive,
							]}
						>
							参加する
						</Text>
					</Pressable>
				</View>

				{/* Form Content */}
				<View style={commonStyles.formContainer}>
					{activeTab === "create" ? (
						<>
							<Text style={commonStyles.label}>ファミリー名</Text>
							<TextInput
								style={commonStyles.input}
								value={familyName}
								onChangeText={(text) => {
									setFamilyName(text);
									setError("");
								}}
								placeholder=""
							/>
							{error && <Text style={commonStyles.errorText}>{error}</Text>}

							<Pressable
								style={commonStyles.submitButton}
								onPress={handleCreateGroup}
							>
								<Text style={commonStyles.submitButtonText}>
									スペースを作成
								</Text>
							</Pressable>
						</>
					) : (
						<>
							<Text style={commonStyles.label}>招待リンク</Text>
							<TextInput
								style={commonStyles.input}
								value={invitationLink}
								onChangeText={(text) => {
									setInvitationLink(text);
									setError("");
								}}
								placeholder=""
							/>
							{error && <Text style={commonStyles.errorText}>{error}</Text>}

							<Pressable
								style={commonStyles.submitButton}
								onPress={handleJoinGroup}
							>
								<Text style={commonStyles.submitButtonText}>
									スペースに参加する
								</Text>
							</Pressable>
						</>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}
