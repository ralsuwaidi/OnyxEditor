import { useEffect } from "react";
import { Editor } from "@tiptap/react";
import firestoreService from "../services/FirestoreService";

export const useLoadEditorContent = (
  editor: Editor | null,
  setTitle: (title: string) => void,
  documentID: string
) => {
  useEffect(() => {
    const loadContent = async () => {
      const savedData = await firestoreService.loadContentWithID(documentID);
      if (savedData) {
        const { content, title } = savedData;
        if (editor && content) {
          editor.commands.setContent(content); // No need to parse content
        }
        if (title) {
          setTitle(title);
        }
      }
    };

    if (editor) {
      loadContent();
    }
  }, [editor, setTitle, documentID]);
};
