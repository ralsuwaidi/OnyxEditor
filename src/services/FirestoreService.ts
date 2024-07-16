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
  Firestore,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { debounce, DebouncedFunc } from "lodash";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import firestore from "./firebase";
import { Timestamp } from "firebase/firestore";
import { extractTags, getSample } from "../libs/utils";

export interface FirestoreServiceInterface {
  fetchNoteById(id: string): Promise<NoteType>;
  fetchAllNotes(): Promise<NoteMetadataType[]>;
  updateMetadata(noteMetadata: NoteMetadataType): Promise<void>;
  updateNoteWithDebounce: DebouncedFunc<
    (id: string, mdcontent: string) => Promise<void>
  >;
  updateFirestoreNote(id: string, mdcontent: string): Promise<void>;
  createNote(): Promise<NoteType>;
  deleteNoteById(noteId: string): Promise<void>;
}

class FirestoreService implements FirestoreServiceInterface {
  private readonly collectionRef: ReturnType<typeof collection>;

  constructor(private readonly db: Firestore) {
    this.collectionRef = collection(this.db, "documents");
  }

  private async handleError<T>(
    promise: Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  private getDocRef(id: string): DocumentReference {
    return doc(this.collectionRef, id);
  }

  async fetchNoteById(id: string): Promise<NoteType> {
    const docRef = this.getDocRef(id);
    const docSnap = await this.handleError<DocumentSnapshot>(
      getDoc(docRef),
      `Error loading document with ID ${id}`
    );

    if (docSnap.exists()) {
      const savedData = docSnap.data();
      return {
        id: docRef.id,
        title: savedData.title,
        mdcontent: savedData.mdcontent,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt,
        metadata: savedData.metadata || {},
      } as NoteType;
    } else {
      throw new Error(`Note with ID ${id} does not exist.`);
    }
  }

  async fetchAllNotes(): Promise<NoteMetadataType[]> {
    const querySnapshot = await this.handleError<QuerySnapshot>(
      getDocs(this.collectionRef),
      "Error loading document titles"
    );

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

  async updateMetadata(noteMetadata: NoteMetadataType): Promise<void> {
    const docRef = this.getDocRef(noteMetadata.id);
    await this.handleError(
      updateDoc(docRef, {
        ...noteMetadata,
        updatedAt: serverTimestamp(),
      }),
      `Error updating metadata for note with ID ${noteMetadata.id}`
    );
  }

  updateNoteWithDebounce: DebouncedFunc<
    (id: string, mdcontent: string) => Promise<void>
  > = debounce(async (id: string, mdcontent: string): Promise<void> => {
    await this.updateFirestoreNote(id, mdcontent);
  }, 1000);

  async updateFirestoreNote(id: string, mdcontent: string): Promise<void> {
    const docRef = this.getDocRef(id);
    const sampleData = getSample(mdcontent);
    const tags = extractTags(mdcontent);

    const updateData = {
      mdcontent,
      "metadata.sample": sampleData,
      "metadata.tags": tags,
      updatedAt: serverTimestamp(),
    };

    await this.handleError(
      updateDoc(docRef, updateData),
      `Error updating content for note with ID ${id}`
    );
  }

  async createNote(type: "journal" | "note" = "note"): Promise<NoteType> {
    const timestamp = Timestamp.now();
    const dateString = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // "July 15, 2024"

    const newNote: Omit<NoteType, "id"> = {
      title: type === "journal" ? dateString : "",
      mdcontent: "",
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {
        type: type,
      },
    };

    const docRef = await this.handleError(
      addDoc(this.collectionRef, newNote),
      "Error creating new note"
    );

    return {
      id: docRef.id,
      ...newNote,
    };
  }

  async deleteNoteById(noteId: string): Promise<void> {
    const docRef = this.getDocRef(noteId);
    await this.handleError(
      deleteDoc(docRef),
      `Error deleting note with ID ${noteId}`
    );
  }
}

export default new FirestoreService(firestore);
