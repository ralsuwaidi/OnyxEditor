import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Editor } from "@tiptap/react";
import { NoteMetadataType } from "../types/NoteType";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import useLoadNotes from "../hooks/useLoadNotes";
import FirestoreService from "../services/FirestoreService";

export interface NoteContextProps {
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  title: string;
  updateNoteTitle: (title: string) => void;
  loading: boolean;
  notes: NoteMetadataType[];
  setEditorInstance: (editor: Editor | null) => void;
  editor: Editor | null;
  TOCItems: TableOfContentData;
  setTOCItemsInstance: (items: TableOfContentData) => void;
  loadAllNotes: () => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState<string>("Loading");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [TOCItems, setTOCItems] = useState<TableOfContentData>([]); // Initialize as an empty array

  const setTOCItemsInstance = useCallback((items: TableOfContentData) => {
    setTOCItems(items);
  }, []);

  const setEditorInstance = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

  const { loading, notes, loadAllNotes } = useLoadNotes(
    selectedNoteId,
    setSelectedNoteId,
    setTitle
  );

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
      editor,
      setEditorInstance,
      TOCItems,
      setTOCItemsInstance,
      loadAllNotes,
    }),
    [
      selectedNoteId,
      title,
      updateNoteTitle,
      loading,
      notes,
      editor,
      setTOCItemsInstance,
      TOCItems,
      setEditorInstance,
      loadAllNotes,
    ]
  );

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  );
};

export default NoteContext;
