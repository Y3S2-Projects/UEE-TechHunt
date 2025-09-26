import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDraft = async (draft: object) => {
  try {
    await AsyncStorage.setItem("onboarding:draft:v1", JSON.stringify(draft));
  } catch (err) {
    console.warn("Failed to save draft", err);
  }
};

export const loadDraft = async () => {
  try {
    const raw = await AsyncStorage.getItem("onboarding:draft:v1");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Failed to load draft", err);
    return null;
  }
};
