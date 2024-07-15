import { create } from "zustand";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import FirestoreService from "../services/FirestoreService";
import { Editor } from "@tiptap/react";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import { debounce } from "lodash";

interface NoteState {
  allNotes: NoteMetadataType[];
  currentNote: NoteType | null;
  editor: Editor | null;
  tableOfContents: TableOfContentData;
  loading: boolean;
}

interface NoteActions {
  setEditor: (editor: Editor) => void;
  fetchAllNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: () => Promise<void>;
  updateNoteMetadata: (note: NoteType) => Promise<void>;
  updateNoteContent: (id: string, mdcontent: string) => Promise<void>;
  deleteNoteById: (id: string) => Promise<void>;
  setCurrentNoteById: (id: string) => Promise<void>;
  setTableOfContents: (tableOfContents: TableOfContentData) => void;
  resetNotes: () => void;
  pinNote: (noteMetadata: NoteMetadataType) => Promise<void>;
  initializeStore: () => Promise<void>;
  updateEditor: () => void;
}

type NoteStore = NoteState & NoteActions;

const initialState: NoteState = {
  allNotes: [],
  currentNote: null,
  editor: null,
  tableOfContents: [],
  loading: false,
};

const useNoteStore = create<NoteStore>((set, get) => {
  const debouncedUpdateMetadata = debounce(async (note: NoteType) => {
    try {
      await FirestoreService.updateMetadata(note);
      const updatedNotes = await FirestoreService.fetchAllNotes();
      set({ allNotes: updatedNotes, currentNote: note });
    } catch (error) {
      console.error("Failed to update the note:", error);
    }
  }, 1000);

  return {
    ...initialState,

    setEditor: (editor: Editor) => set({ editor }),

    fetchAllNotes: async () => {
      try {
        const notes = await FirestoreService.fetchAllNotes();
        set({ allNotes: notes });
      } catch (error) {
        console.error("Failed to fetch all notes:", error);
      }
    },

    fetchNoteById: async (id: string) => {
      set({ loading: true });
      try {
        const note = await FirestoreService.fetchNoteById(id);
        set({ currentNote: note });
      } catch (error) {
        console.error("Failed to fetch the note:", error);
      } finally {
        set({ loading: false });
      }
    },

    createNote: async () => {
      try {
        const newNote = await FirestoreService.createNote();
        set((state) => ({
          allNotes: [...state.allNotes, newNote],
        }));
        await get().setCurrentNoteById(newNote.id);
      } catch (error) {
        console.error("Failed to create the note:", error);
      }
    },

    updateNoteMetadata: async (note: NoteType) => {
      debouncedUpdateMetadata(note);
    },

    updateNoteContent: async (id: string, mdcontent: string) => {
      try {
        await FirestoreService.updateNoteWithDebounce(id, mdcontent);
        set((state) => ({
          currentNote:
            state.currentNote?.id === id
              ? { ...state.currentNote, mdcontent }
              : state.currentNote,
          allNotes: state.allNotes.map((note) =>
            note.id === id ? { ...note, mdcontent } : note
          ),
        }));
      } catch (error) {
        console.error("Failed to update the note:", error);
      }
    },

    deleteNoteById: async (id: string) => {
      set({ loading: true });
      try {
        await FirestoreService.deleteNoteById(id);
        const updatedNotes = await FirestoreService.fetchAllNotes();
        set({ allNotes: updatedNotes });
      } catch (error) {
        console.error("Failed to delete the note:", error);
      } finally {
        set({ loading: false });
      }
    },

    setCurrentNoteById: async (id: string) => {
      set({ loading: true });
      try {
        const note = await FirestoreService.fetchNoteById(id);
        set({ currentNote: note });
        get().updateEditor();
      } catch (error) {
        console.error("Failed to fetch and set the current note:", error);
      } finally {
        set({ loading: false });
      }
    },

    pinNote: async (noteMetadata: NoteMetadataType) => {
      try {
        const updatedNoteMetadata = {
          ...noteMetadata,
          metadata: {
            ...noteMetadata.metadata,
            pin: !noteMetadata.metadata?.pin,
          },
        };

        await get().updateNoteMetadata(updatedNoteMetadata as NoteType);

        set((state) => ({
          allNotes: state.allNotes.map((note) =>
            note.id === updatedNoteMetadata.id ? updatedNoteMetadata : note
          ),
        }));
      } catch (error) {
        console.error("Failed to pin the note:", error);
      }
    },

    initializeStore: async () => {
      set({ loading: true });
      try {
        await get().fetchAllNotes();
        const sortedNotes = [...get().allNotes].sort((a, b) => {
          const dateA = a.updatedAt?.toDate?.() || new Date(0);
          const dateB = b.updatedAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        const latestNote = sortedNotes[0];
        if (latestNote) {
          await get().setCurrentNoteById(latestNote.id);
        }
        set({ allNotes: sortedNotes });
      } catch (error) {
        console.error("Failed to initialize store:", error);
      } finally {
        set({ loading: false });
      }
    },

    setTableOfContents: (tableOfContents: TableOfContentData) =>
      set({ tableOfContents }),

    updateEditor: () => {
      const mdContent = get().currentNote?.mdcontent;
      get().editor?.commands.setContent(mdContent || "");
    },

    resetNotes: () => set(initialState),
  };
});

export default useNoteStore;
