// src/hooks/useSaveEditorContent.ts
import { useCallback } from "react";
import { Preferences } from "@capacitor/preferences";

const useSaveEditorContent = () => {
  // Function to save editor content
  const saveEditorContent = useCallback(async (content: string) => {
    await Preferences.set({
      key: "editorContent",
      value: content,
    });
  }, []);

  return { saveEditorContent };
};

export default useSaveEditorContent;
