// src/services/FirestoreService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { DebouncedFunc, debounce } from "lodash";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import firestore from "./firebase";
import { Timestamp } from "firebase/firestore";

export interface FirestoreServiceInterface {
  loadContentWithID(documentID: string): Promise<NoteType | null>;
  getNotes(): Promise<NoteType[]>;
  getNoteTitles(): Promise<Array<NoteMetadataType>>;
  updateMetadata(documentID: string, metadata: object): Promise<void>;
  updateFirestoreNoteWithDebounce: DebouncedFunc<
    (note: NoteType) => Promise<void>
  >;
  updateFirestoreNote(note: NoteType): Promise<void>;
  createNewNote(): Promise<NoteType>;
  deleteNote(noteId: string): Promise<void>;
  getLatestNote(): Promise<Pick<NoteType, "id" | "title" | "updatedAt"> | null>;
  updateFirestoreNoteTitle(noteId: string, title: string): Promise<void>;
}

class FirestoreService implements FirestoreServiceInterface {
  private collectionRef = collection(firestore, "documents");

  private async handleError<T>(
    promise: Promise<T>,
    errorMessage: string
  ): Promise<T | null> {
    try {
      return await promise;
    } catch (error) {
      console.error(errorMessage, error);
      return null;
    }
  }

  async loadContentWithID(documentID: string): Promise<NoteType | null> {
    const docRef = doc(this.collectionRef, documentID);
    const docSnap = await this.handleError(
      getDoc(docRef),
      "Error loading document:"
    );
    if (docSnap && docSnap.exists()) {
      const savedData = docSnap.data();
      return {
        id: docRef.id,
        content: savedData.content,
        title: savedData.title,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt,
        metadata: savedData.metadata || {},
      } as NoteType;
    }
    return null;
  }

  async getNotes(): Promise<NoteType[]> {
    const querySnapshot = await this.handleError(
      getDocs(this.collectionRef),
      "Error loading documents:"
    );
    if (querySnapshot) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          metadata: data.metadata || {},
        } as NoteType;
      });
    }
    return [];
  }

  async getNoteTitles(): Promise<NoteMetadataType[]> {
    const querySnapshot = await this.handleError(
      getDocs(this.collectionRef),
      "Error loading document titles:"
    );
    if (querySnapshot) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          metadata: data.metadata || {},
        } as NoteMetadataType;
      });
    }
    return [];
  }

  async updateMetadata(documentID: string, metadata: object): Promise<void> {
    const docRef = doc(this.collectionRef, documentID);
    await this.handleError(
      updateDoc(docRef, { metadata, updatedAt: serverTimestamp() }),
      "Error updating metadata:"
    );
  }

  async isNotePinned(documentID: string): Promise<boolean> {
    const docRef = doc(this.collectionRef, documentID);
    const docSnap = await this.handleError(
      getDoc(docRef),
      "Error loading document:"
    );
    if (docSnap && docSnap.exists()) {
      const savedData = docSnap.data();
      return savedData.metadata?.pin === true;
    }
    return false;
  }

  updateFirestoreNoteWithDebounce = debounce(async (note: NoteType): Promise<
    void
  > => {
    await this.updateFirestoreNote(note);
  }, 1000);

  async updateFirestoreNote(note: NoteType): Promise<void> {
    const docRef = doc(this.collectionRef, note.id);
    await this.handleError(
      updateDoc(docRef, { ...note, updatedAt: serverTimestamp() }),
      "Error updating content:"
    );
  }

  async createNewNote(): Promise<NoteType> {
    const timestamp = Timestamp.now();
    try {
      const emptyContent = { type: "doc", content: [] };
      const newNote: Omit<NoteType, "id"> = {
        content: emptyContent,
        title: "",
        createdAt: timestamp,
        updatedAt: timestamp,
        metadata: {},
      };

      const docRef = await addDoc(this.collectionRef, newNote);

      const noteMetadata: NoteType = {
        id: docRef.id,
        title: newNote.title,
        content: emptyContent,
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt,
        metadata: newNote.metadata,
      };

      return noteMetadata;
    } catch (error) {
      console.error("Error creating new note:", error);
      throw new Error("Failed to create new note");
    }
  }

  async getLatestNote(): Promise<Pick<
    NoteType,
    "id" | "title" | "updatedAt"
  > | null> {
    const notesQuery = query(
      this.collectionRef,
      orderBy("updatedAt", "desc"),
      limit(1)
    );
    const querySnapshot = await this.handleError(
      getDocs(notesQuery),
      "Error getting latest note:"
    );
    if (querySnapshot && !querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      const data = latestDoc.data();
      return { id: latestDoc.id, title: data.title, updatedAt: data.updatedAt };
    }
    return null;
  }

  async deleteNote(noteId: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(deleteDoc(docRef), "Error deleting note:");
  }

  async updateFirestoreNoteTitle(noteId: string, title: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(
      updateDoc(docRef, { title, updatedAt: serverTimestamp() }),
      "Error updating note title:"
    );
  }
}

export default new FirestoreService();
