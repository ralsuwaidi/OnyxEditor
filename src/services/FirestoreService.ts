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
import { JSONContent } from "@tiptap/core";
import { extractTags, getSample } from "../libs/utils";

export interface FirestoreServiceInterface {
  fetchNoteById(id: string): Promise<NoteType>;
  getNotes(): Promise<NoteType[]>;
  fetchAllNotes(): Promise<Array<NoteMetadataType>>;
  updateNoteMetadata(noteMetadata: NoteMetadataType): Promise<void>;
  updateMetadata(noteMetadata: NoteMetadataType): Promise<void>;
  updateNoteWithDebounce: DebouncedFunc<
    (id: string, content: JSONContent) => Promise<void>
  >;
  updateFirestoreNote(id: string, content: JSONContent): Promise<void>;
  createNote(): Promise<NoteType>;
  deleteNoteById(noteId: string): Promise<void>;
  getLatestNote(): Promise<Pick<NoteType, "id" | "title" | "updatedAt"> | null>;
  updateFirestoreNoteTitle(noteId: string, title: string): Promise<void>;
  updateNote: (note: NoteType) => Promise<void>;
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

  async fetchNoteById(id: string): Promise<NoteType> {
    const docRef = doc(this.collectionRef, id);
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
    } else {
      throw new Error(`Note with ID ${id} does not exist.`);
    }
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

  async fetchAllNotes(): Promise<NoteMetadataType[]> {
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

  async updateMetadata(noteMetadata: NoteMetadataType): Promise<void> {
    const docRef = doc(this.collectionRef, noteMetadata.id);
    await this.handleError(
      updateDoc(docRef, {
        ...noteMetadata,
        updatedAt: serverTimestamp(),
      }),
      "Error updating metadata:"
    );
  }

  updateNoteWithDebounce = debounce(
    async (id: string, content: JSONContent): Promise<void> => {
      await this.updateFirestoreNote(id, content);
    },
    1000
  );

  async updateFirestoreNote(id: string, content: JSONContent): Promise<void> {
    const docRef = doc(this.collectionRef, id);

    // Generate the sample and update the metadata
    const sampleData = getSample(content);
    const tags = extractTags(content);

    // Create the update object
    const updateData = {
      content: content,
      "metadata.sample": sampleData,
      "metadata.tags": tags,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  }

  async createNote(): Promise<NoteType> {
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

  async deleteNoteById(noteId: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(deleteDoc(docRef), "Error deleting note:");
  }

  async updateNoteMetadata(noteMetadata: NoteMetadataType): Promise<void> {
    const docRef = doc(this.collectionRef, noteMetadata.id);
    await this.handleError(
      updateDoc(docRef, { ...noteMetadata, updatedAt: serverTimestamp() }),
      "Error updating note metadata:"
    );
  }

  async updateFirestoreNoteTitle(noteId: string, title: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(
      updateDoc(docRef, { title, updatedAt: serverTimestamp() }),
      "Error updating note title:"
    );
  }

  async updateNote(note: NoteType): Promise<void> {
    const docRef = doc(this.collectionRef, note.id);

    // Generate the sample and update the metadata
    const sampleData = getSample(note.content);
    const tags = extractTags(note.content);
    const updatedMetadata = {
      ...note.metadata,
      sample: sampleData,
      tags: tags,
    };

    // Create the update object
    const updateData = {
      ...note,
      metadata: updatedMetadata,
      updatedAt: serverTimestamp(),
    };

    await this.handleError(
      updateDoc(docRef, updateData),
      "Error updating note:"
    );
  }
}

export default new FirestoreService();
