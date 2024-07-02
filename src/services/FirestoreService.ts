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
} from "firebase/firestore";
import { DebouncedFunc, debounce } from "lodash";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import firestore from "./firebase";

export interface FirestoreServiceInterface {
  loadContentWithID(documentID: string): Promise<NoteType | null>;
  getNotes(): Promise<NoteType[]>;
  getNoteTitles(): Promise<Array<NoteMetadataType>>;
  updateMetadata(documentID: string, metadata: object): Promise<void>;
  updateContentWithDebounce: DebouncedFunc<
    (documentID: string, content: object, title: string) => Promise<void>
  >;
  updateContent(
    documentID: string,
    content: object,
    title: string
  ): Promise<void>;
  createNewNote(): Promise<void>;
  getLatestNote(): Promise<Pick<NoteType, "id" | "title" | "updatedAt"> | null>;
  updateNoteTitle(noteId: string, title: string): Promise<void>;
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

  updateContentWithDebounce = debounce(
    async (
      documentID: string,
      content: object,
      title: string
    ): Promise<void> => {
      await this.updateContent(documentID, content, title);
    },
    1000
  );

  async updateContent(
    documentID: string,
    content: object,
    title: string
  ): Promise<void> {
    const docRef = doc(this.collectionRef, documentID);
    await this.handleError(
      updateDoc(docRef, { content, title, updatedAt: new Date() }),
      "Error updating content:"
    );
  }

  async createNewNote(): Promise<void> {
    const timestamp = new Date();
    await this.handleError(
      addDoc(this.collectionRef, {
        content: { type: "doc", content: [] },
        title: "New Note",
        createdAt: timestamp,
        updatedAt: timestamp,
        metadata: {},
      }),
      "Error creating new note:"
    );
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

  async updateNoteTitle(noteId: string, title: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(
      updateDoc(docRef, { title, updatedAt: serverTimestamp() }),
      "Error updating note title:"
    );
  }
}

export default new FirestoreService();
