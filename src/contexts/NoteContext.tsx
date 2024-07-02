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

export interface NoteContextProps {
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  title: string;
  updateNoteTitle: (title: string) => void;
  loading: boolean;
  setEditorInstance: (editor: Editor | null) => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState<string>("Header");
  const [loading, setLoading] = useState<boolean>(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const initializeNote = useCallback(async () => {
    setLoading(true);
    try {
      const latestNote = await FirestoreService.getLatestNote();
      if (latestNote) {
        setSelectedNoteId(latestNote.id);
        setTitle(latestNote.title);
      }
    } catch (error) {
      console.error("Failed to initialize note", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeNote();
  }, [initializeNote]);

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

  const setEditorInstance = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

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
      setEditorInstance,
    }),
    [selectedNoteId, title, updateNoteTitle, loading, setEditorInstance]
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
