// src/services/FirestoreService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
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
  fetchAllNotes(): Promise<Array<NoteMetadataType>>;
  updateMetadata(noteMetadata: NoteMetadataType): Promise<void>;
  updateNoteWithDebounce: DebouncedFunc<
    (id: string, content: JSONContent) => Promise<void>
  >;
  updateFirestoreNote(id: string, content: JSONContent): Promise<void>;
  createNote(): Promise<NoteType>;
  deleteNoteById(noteId: string): Promise<void>;
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

  async deleteNoteById(noteId: string): Promise<void> {
    const docRef = doc(this.collectionRef, noteId);
    await this.handleError(deleteDoc(docRef), "Error deleting note:");
  }
}

export default new FirestoreService();
