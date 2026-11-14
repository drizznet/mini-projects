import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "lockin-auth-session";

type LocalAuthSession = {
  email: string;
  accessToken?: string;
  signedInAt: string;
};

export async function getAuthToken(): Promise<string | undefined> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return undefined;
    const session = JSON.parse(raw) as LocalAuthSession;
    return session.accessToken;
  } catch {
    return undefined;
  }
}

export async function hasAuthSession(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return Boolean(raw);
}
