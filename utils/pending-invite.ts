import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_INVITE_KEY = "pending_invite_token";

export const savePendingInviteToken = async (token: string): Promise<void> => {
	await AsyncStorage.setItem(PENDING_INVITE_KEY, token);
};

export const getPendingInviteToken = async (): Promise<string | null> => {
	return await AsyncStorage.getItem(PENDING_INVITE_KEY);
};

export const clearPendingInviteToken = async (): Promise<void> => {
	await AsyncStorage.removeItem(PENDING_INVITE_KEY);
};
