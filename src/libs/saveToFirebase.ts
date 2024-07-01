import { doc, setDoc } from "firebase/firestore";
import firestore from "../services/firebase";
import { debounce } from "lodash";

// Document ID for your single-page document
const DOCUMENT_ID = "single-page-document";

const saveEditorContent = debounce(
  async (content: object, title: string): Promise<void> => {
    try {
      await setDoc(doc(firestore, "documents", DOCUMENT_ID), {
        content,
        title,
      });
    } catch (error) {
      console.error("Error saving document:", error);
    }
  },
  1000
);

export { saveEditorContent };
