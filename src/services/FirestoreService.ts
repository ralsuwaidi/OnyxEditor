import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import firestore from "./firebase";
import { debounce } from "lodash";

// Define types for content and title
interface EditorData {
  content: object; // No longer stringifying content
  title: string;
}

class FirestoreService {
  private collectionName: string;

  constructor() {
    this.collectionName = "documents";
  }

  // Save editor content with a specific document ID
  saveContentWithID = debounce(
    async (
      content: object,
      title: string,
      documentID: string
    ): Promise<void> => {
      try {
        await setDoc(doc(firestore, this.collectionName, documentID), {
          content, // Saving content directly
          title,
        });
      } catch (error) {
        console.error("Error saving document:", error);
      }
    },
    1000
  );

  // Save editor content with an auto-generated document ID
  saveContent = debounce(async (content: object, title: string): Promise<
    void
  > => {
    try {
      await addDoc(collection(firestore, this.collectionName), {
        content, // Saving content directly
        title,
      });
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }, 1000);

  // Load content for a specific document ID
  async loadContentWithID(documentID: string): Promise<EditorData | null> {
    try {
      const docRef = doc(firestore, this.collectionName, documentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const savedData = docSnap.data() as EditorData;
        return {
          content: savedData.content, // Content is already an object
          title: savedData.title,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error loading document:", error);
      return null;
    }
  }

  // Load all documents (for cases where IDs are auto-generated)
  async loadAllContents(): Promise<
    Array<{ id: string; content: object; title: string }> | []
  > {
    try {
      const querySnapshot = await getDocs(
        collection(firestore, this.collectionName)
      );
      const documents = querySnapshot.docs.map((doc) => {
        const data = doc.data() as EditorData;
        return {
          id: doc.id,
          content: data.content, // Content is already an object
          title: data.title,
        };
      });
      return documents;
    } catch (error) {
      console.error("Error loading documents:", error);
      return [];
    }
  }
}

export default new FirestoreService();
