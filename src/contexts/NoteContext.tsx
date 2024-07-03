import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import FirestoreService from "../services/FirestoreService";
import { Editor } from "@tiptap/react";
import { NoteMetadataType } from "../types/NoteType";

export interface NoteContextProps {
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  title: string;
  updateNoteTitle: (title: string) => void;
  loading: boolean;
  notes: NoteMetadataType[];
  setEditorInstance: (editor: Editor | null) => void;
  loadNotes: () => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState<string>("Loading");
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteMetadataType[]>([]);
  const [editor, setEditor] = useState<Editor | null>(null);

  const setEditorInstance = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNotes = await FirestoreService.getNoteTitles();
      setNotes(fetchedNotes);

      // Set the latest updated note as selected if no note is selected
      if (!selectedNoteId && fetchedNotes.length > 0) {
        const latestUpdatedNote = fetchedNotes.reduce((latest, note) => {
          return latest.updatedAt.toDate() > note.updatedAt.toDate()
            ? latest
            : note;
        });
        setSelectedNoteId(latestUpdatedNote.id);
        setTitle(latestUpdatedNote.title);
      }
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const updateNoteTitle = useCallback(
    async (newTitle: string) => {
      if (selectedNoteId) {
        try {
          await FirestoreService.updateNoteTitle(selectedNoteId, newTitle);
          setTitle(newTitle);
        } catch (error) {
          console.error("Failed to update note title", error);
        }
      }
    },
    [selectedNoteId]
  );

  useEffect(() => {
    if (selectedNoteId && editor) {
      const loadContent = async () => {
        try {
          const note = await FirestoreService.loadContentWithID(selectedNoteId);
          if (note) {
            editor.commands.setContent(note.content);
            setTitle(note.title);
          }
        } catch (error) {
          console.error("Failed to load note content", error);
        }
      };
      loadContent();
    }
  }, [selectedNoteId, editor]);

  const contextValue = useMemo(
    () => ({
      selectedNoteId,
      setSelectedNoteId,
      title,
      updateNoteTitle,
      loading,
      notes,
      setEditorInstance,
      loadNotes,
    }),
    [
      selectedNoteId,
      title,
      updateNoteTitle,
      loading,
      notes,
      setEditorInstance,
      loadNotes,
    ]
  );

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  );
};

export const useNoteContext = (): NoteContextProps => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
