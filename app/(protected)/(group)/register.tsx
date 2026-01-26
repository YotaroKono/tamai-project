import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./register.styles";

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
		<SafeAreaView style={styles.container}>
			{/* Logo */}
			<View style={styles.logoContainer}>
				<View style={styles.logo}>
					<Text style={styles.logoText}>S</Text>
				</View>
			</View>

			{/* Welcome Message */}
			<View style={styles.welcomeContainer}>
				<View style={styles.avatarPlaceholder}>
					<Text style={styles.avatarIcon}>👤</Text>
				</View>
				<Text style={styles.welcomeText}>ようこそ、佐藤さん</Text>
				<Text style={styles.descriptionText}>
					ファミリースペースを作成するか、{"\n"}
					既存のスペースに参加してください
				</Text>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<Pressable
					style={[styles.tab, activeTab === "create" && styles.activeTab]}
					onPress={() => {
						setActiveTab("create");
						setError("");
					}}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "create" && styles.activeTabText,
						]}
					>
						作成する
					</Text>
				</Pressable>
				<Pressable
					style={[styles.tab, activeTab === "join" && styles.activeTab]}
					onPress={() => {
						setActiveTab("join");
						setError("");
					}}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "join" && styles.activeTabText,
						]}
					>
						参加する
					</Text>
				</Pressable>
			</View>

			{/* Form Content */}
			<View style={styles.formContainer}>
				{activeTab === "create" ? (
					<>
						<Text style={styles.label}>ファミリー名</Text>
						<TextInput
							style={styles.input}
							value={familyName}
							onChangeText={(text) => {
								setFamilyName(text);
								setError("");
							}}
							placeholder=""
						/>
						{error && <Text style={styles.errorText}>{error}</Text>}

						<Pressable style={styles.submitButton} onPress={handleCreateGroup}>
							<Text style={styles.submitButtonText}>スペースを作成</Text>
						</Pressable>
					</>
				) : (
					<>
						<Text style={styles.label}>招待リンク</Text>
						<TextInput
							style={styles.input}
							value={invitationLink}
							onChangeText={(text) => {
								setInvitationLink(text);
								setError("");
							}}
							placeholder=""
						/>
						{error && <Text style={styles.errorText}>{error}</Text>}

						<Pressable style={styles.submitButton} onPress={handleJoinGroup}>
							<Text style={styles.submitButtonText}>スペースに参加する</Text>
						</Pressable>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}
