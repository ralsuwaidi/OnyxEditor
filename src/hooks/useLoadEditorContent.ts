import { useEffect } from "react";
import { Editor } from "@tiptap/react";
import { loadEditorContent } from "../libs/editorPreferences";

export const useLoadEditorContent = (editor: Editor | null) => {
  useEffect(() => {
    const loadContent = async () => {
      const savedContent = await loadEditorContent();
      if (editor && savedContent) {
        editor.commands.setContent(JSON.parse(savedContent));
      }
    };

    loadContent();
  }, [editor]);
};
