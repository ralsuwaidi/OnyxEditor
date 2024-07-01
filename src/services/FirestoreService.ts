import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firebase";
import { debounce } from "lodash";

interface EditorData {
  id: string; // Include the document ID
  content: object; // No longer stringifying content
  title: string;
  createdAt: any; // Using any to allow for Firestore timestamp
  updatedAt: any; // Using any to allow for Firestore timestamp
  metadata?: object; // Optional metadata field
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
        const docRef = doc(firestore, this.collectionName, documentID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // If document exists, update it
          await updateDoc(docRef, {
            content, // Saving content directly
            title,
            updatedAt: serverTimestamp(), // Set updated timestamp
          });
        } else {
          // If document doesn't exist, create it
          await setDoc(docRef, {
            content, // Saving content directly
            title,
            createdAt: serverTimestamp(), // Set created timestamp
            updatedAt: serverTimestamp(), // Set updated timestamp
          });
        }
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
        createdAt: serverTimestamp(), // Set created timestamp
        updatedAt: serverTimestamp(), // Set updated timestamp
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
        const savedData = docSnap.data();
        return {
          id: docRef.id,
          content: savedData.content, // Content is already an object
          title: savedData.title,
          createdAt: savedData.createdAt,
          updatedAt: savedData.updatedAt,
          metadata: savedData.metadata || {}, // Load metadata if it exists
        } as EditorData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error loading document:", error);
      return null;
    }
  }

  // Load all documents (for cases where IDs are auto-generated)
  async loadAllContents(): Promise<Array<EditorData> | []> {
    try {
      const querySnapshot = await getDocs(
        collection(firestore, this.collectionName)
      );
      const documents = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content, // Content is already an object
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          metadata: data.metadata || {}, // Load metadata if it exists
        } as EditorData;
      });
      return documents;
    } catch (error) {
      console.error("Error loading documents:", error);
      return [];
    }
  }

  // Load all document titles and IDs with timestamps
  async loadAllDocumentTitles(): Promise<
    | Array<{
        id: string;
        title: string;
        createdAt: any;
        updatedAt: any;
        metadata?: object;
      }>
    | []
  > {
    try {
      const querySnapshot = await getDocs(
        collection(firestore, this.collectionName)
      );
      const documents = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          metadata: data.metadata || {}, // Load metadata if it exists
        };
      });
      return documents;
    } catch (error) {
      console.error("Error loading documents:", error);
      return [];
    }
  }

  // Update metadata for a specific document ID
  async updateMetadata(documentID: string, metadata: object): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, documentID);
      await updateDoc(docRef, {
        metadata,
        updatedAt: serverTimestamp(), // Update the updatedAt timestamp
      });
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  }

  updateContentWithDebounce = debounce(
    async (
      documentID: string,
      content: object,
      title: string
    ): Promise<void> => {
      try {
        const docRef = doc(firestore, this.collectionName, documentID);
        await updateDoc(docRef, {
          content,
          title,
          updatedAt: new Date(), // Update the updatedAt timestamp
        });
      } catch (error) {
        console.error("Error updating content with debounce:", error);
      }
    },
    1000
  );

  async updateContent(
    documentID: string,
    content: object,
    title: string
  ): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, documentID);
      await updateDoc(docRef, {
        content,
        title,
        updatedAt: new Date(), // Update the updatedAt timestamp
      });
    } catch (error) {
      console.error("Error updating content:", error);
    }
  }

  async createNewNote(): Promise<void> {
    try {
      const timestamp = new Date();
      await addDoc(collection(firestore, this.collectionName), {
        content: {},
        title: "New Note",
        createdAt: timestamp,
        updatedAt: timestamp,
        metadata: {},
      });
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }
}

export default new FirestoreService();
