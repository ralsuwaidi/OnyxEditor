import { Preferences } from "@capacitor/preferences";

export const saveEditorContent = async (content: string) => {
  await Preferences.set({
    key: "editorContent",
    value: content,
  });
};

export const loadEditorContent = async () => {
  const { value } = await Preferences.get({ key: "editorContent" });
  return value || "";
};
