import { create } from "zustand";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import FirestoreService from "../services/FirestoreService";
import { Editor, JSONContent } from "@tiptap/react";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";

interface NoteState {
  allNotes: NoteMetadataType[];
  currentNote: NoteType | null;
  editor: Editor | null;
  tableOfContents: TableOfContentData;
  loading: boolean;
  setEditor: (editor: Editor) => void;
  fetchAllNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: () => Promise<void>;
  updateNoteMetadata: (note: NoteType) => Promise<void>;
  updateNoteContent: (id: string, content: JSONContent) => Promise<void>;
  deleteNoteById: (id: string) => Promise<void>;
  setCurrentNote: (note: NoteType | null) => void;
  setCurrentNoteById: (id: string) => Promise<void>;
  setTableOfContents: (tableOfContents: TableOfContentData) => void;
  resetNotes: () => void;
  pinNote: (noteMetadata: NoteMetadataType) => Promise<void>;
  initializeStore: () => Promise<void>;
  updateEditor: () => void;
}

const useNoteStore = create<NoteState>((set, get) => ({
  allNotes: [],
  currentNote: null,
  editor: null,
  tableOfContents: [],
  loading: false,

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
    set({ loading: true });
    try {
      const newNote = await FirestoreService.createNote();
      const newNoteMetadata: NoteMetadataType = {
        id: newNote.id,
        title: newNote.title,
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt,
        metadata: newNote.metadata,
      };
      set((state) => ({
        allNotes: [...state.allNotes, newNoteMetadata],
        currentNote: newNote,
      }));
    } catch (error) {
      console.error("Failed to create the note:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateNoteMetadata: async (note: NoteType) => {
    set({ loading: true });
    try {
      await FirestoreService.updateMetadata(note);
      const updatedNotes = await FirestoreService.fetchAllNotes();
      set({ allNotes: updatedNotes, currentNote: note });
    } catch (error) {
      console.error("Failed to update the note:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateNoteContent: async (id: string, content: JSONContent) => {
    try {
      console.log(get().currentNote);
      await FirestoreService.updateNoteWithDebounce(id, content); // Assuming this method is debounced
      set((state) => ({
        currentNote:
          state.currentNote && state.currentNote.id === id
            ? { ...state.currentNote, content }
            : state.currentNote,
        allNotes: state.allNotes.map((note) =>
          note.id === id ? { ...note, content } : note
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

      set((state) => {
        const updatedAllNotes = state.allNotes.map((note) =>
          note.id === updatedNoteMetadata.id ? updatedNoteMetadata : note
        );

        // let updatedCurrentNote = state.currentNote;
        // if (
        //   state.currentNote &&
        //   state.currentNote.id === updatedNoteMetadata.id
        // ) {
        //   updatedCurrentNote = {
        //     ...state.currentNote,
        //     metadata: updatedNoteMetadata.metadata,
        //   };
        // }

        return {
          allNotes: updatedAllNotes,
          //   currentNote: updatedCurrentNote,
        };
      });
    } catch (error) {
      console.error("Failed to pin the note:", error);
    }
  },

  initializeStore: async () => {
    set({ loading: true });
    try {
      await get().fetchAllNotes();
      const allNotes = get().allNotes;
      const sortedNotes = allNotes.sort(
        (a, b) =>
          b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
      );
      const latestNote = sortedNotes[0] || null; // Get the latest note or null if there are no notes
      await get().setCurrentNoteById(latestNote.id);
      set({ allNotes: sortedNotes });
    } catch (error) {
      console.error("Failed to initialize store:", error);
    } finally {
      set({ loading: false });
    }
  },

  setTableOfContents: (tableOfContents: TableOfContentData) => {
    set({ tableOfContents });
  },

  setCurrentNote: (note: NoteType | null) => set({ currentNote: note }),

  setEditor: (editor: Editor) => {
    set({ editor });
  },

  updateEditor: () => {
    get().editor?.commands.setContent(
      get().currentNote?.content as JSONContent
    );
  },

  resetNotes: () => set({ allNotes: [], currentNote: null, loading: false }),
}));

export default useNoteStore;
