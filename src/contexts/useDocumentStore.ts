import { create } from "zustand";
import { Documents } from "../types/document.types";
import {
  fetchDocuments,
  fetchDocumentById,
  createDocument as createDoc,
  updateDocument as updateDoc,
  deleteDocument as deleteDoc,
} from "../libs/api"; // Ensure these methods are correctly imported

interface DocumentStore {
  documents: Documents[];
  setDocuments: (documents: Documents[]) => void;
  clearDocuments: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  selectedDocument: Documents | null;
  setSelectedDocument: (document: Documents | null) => void;
  loadDocuments: () => Promise<void>;
  createDocument: (
    documentType: "note" | "journal"
  ) => Promise<Documents | null>;
  updateDocument: (
    id: string,
    updatedFields: Partial<Documents>
  ) => Promise<Documents | null>;
  deleteDocument: (id: string) => Promise<void>;
  selectDocument: (id: string) => Promise<void>;
}

const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  setDocuments: (documents) => set({ documents }),
  clearDocuments: () => set({ documents: [] }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  selectedDocument: null,
  setSelectedDocument: (document) => set({ selectedDocument: document }),

  loadDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await fetchDocuments();
      set({ documents });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createDocument: async (documentType) => {
    const date = new Date();
    const newDocument = {
      content: "",
      created_at: date.toISOString(),
      pinned: false,
      sample: null,
      title: "",
      tags: [],
      type: documentType,
      updated_at: date.toISOString(),
    };

    set({ isLoading: true, error: null });
    try {
      const document = await createDoc(newDocument);
      const currentDocuments = get().documents;
      set({ documents: [...currentDocuments, document] });
      return document;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDocument: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const document = await updateDoc(id, updatedFields);
      const currentDocuments = get().documents;
      const updatedDocuments = currentDocuments.map((doc) =>
        doc.id === id ? document : doc
      );
      set({ documents: updatedDocuments });
      return document;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(id);
      const currentDocuments = get().documents;
      const updatedDocuments = currentDocuments.filter((doc) => doc.id !== id);
      set({ documents: updatedDocuments });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  selectDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const document = await fetchDocumentById(id);
      set({ selectedDocument: document });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useDocumentStore;
