import { create } from "zustand";
import { Documents } from "../types/document.types";
import {
  fetchDocuments,
  fetchDocumentById,
  createDocument as createDoc,
  updateDocument as updateDoc,
  deleteDocument as deleteDoc,
  debouncedUpdateDocument,
} from "../libs/api";
import { extractTags } from "../libs/utils";
import useUIStateStore from "./useUIStateStore";

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
  updateContent: (id: string, content: string) => void;

  loadDocuments: () => Promise<void>;
  setSearchText: (searchText: string) => void;
  searchText: string;
  createDocument: (
    documentType: "note" | "journal"
  ) => Promise<Documents | null>;
  updateDocument: (
    id: string,
    updatedFields: Partial<Documents>
  ) => Promise<Documents | null>;
  deleteDocument: (id: string) => Promise<void>;
  selectDocument: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
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
  searchText: "",
  setSearchText: (search) => set({ searchText: search }),

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
      title: documentType == "journal" ? date.toLocaleDateString() : "",
      tags: [],
      type: documentType,
      updated_at: date.toISOString(),
    };

    set({ isLoading: true, error: null });
    try {
      const document = await createDoc(newDocument);
      const currentDocuments = get().documents;
      set({
        documents: [...currentDocuments, document],
        selectedDocument: document,
      });
      useUIStateStore.getState().setToast("Note created");
      return document;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      useUIStateStore.getState().setToast("Failed to create document");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateContent: (id: string, content: string) => {
    // Use the debounced API update function
    const tags = extractTags(content);
    const updatePromise = debouncedUpdateDocument(id, { content, tags });

    if (updatePromise) {
      updatePromise
        .then((updatedDoc) => {
          // Update the store with the response from the server
          const currentDocuments = get().documents;
          const updatedDocuments = currentDocuments.map((doc) =>
            doc.id === id ? updatedDoc : doc
          );
          set({ documents: updatedDocuments });
        })
        .catch((error) => {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
          useUIStateStore.getState().setToast("Failed to update document");
        });
    } else {
      set({
        error: "Update function did not return a promise.",
      });
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
      useUIStateStore.getState().setToast("Failed to update document");
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
      useUIStateStore.getState().setToast("Note deleted");
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      useUIStateStore.getState().setToast("Failed to delete document");
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
      useUIStateStore.getState().setToast("Failed to select document");
    } finally {
      set({ isLoading: false });
    }
  },

  togglePin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const currentDocuments = get().documents;
      const document = currentDocuments.find((doc) => doc.id === id);

      if (!document) {
        throw new Error("Document not found");
      }

      const updatedFields = { pinned: !document.pinned };
      const updatedDocument = await updateDoc(id, updatedFields);
      const updatedDocuments = currentDocuments.map((doc) =>
        doc.id === id ? updatedDocument : doc
      );

      set({ documents: updatedDocuments });
      useUIStateStore
        .getState()
        .setToast(`Note ${updatedFields.pinned ? "pinned" : "unpinned"} `);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      useUIStateStore.getState().setToast("Failed to toggle pin");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useDocumentStore;
