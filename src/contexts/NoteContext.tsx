import React, {
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Editor } from "@tiptap/react";
import { NoteMetadataType } from "../types/NoteType";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import useLoadNotes from "../hooks/useLoadNotes";
import useLoadNote from "../hooks/useLoadNote";
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

  const { loading: loadingNotes, notes, loadAllNotes } = useLoadNotes();
  const {
    loading: loadingNote,
    noteContent,
    noteTitle,
    loadNote,
  } = useLoadNote(selectedNoteId);

  const [title, setTitle] = useState<string>("Loading");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [TOCItems, setTOCItems] = useState<TableOfContentData>([]);

  const setTOCItemsInstance = useCallback((items: TableOfContentData) => {
    setTOCItems(items);
  }, []);

  const setEditorInstance = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

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
    loadAllNotes();
  }, [loadAllNotes]);

  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      const latestUpdatedNote = notes.reduce((latest, note) =>
        latest.updatedAt.toDate() > note.updatedAt.toDate() ? latest : note
      );
      setSelectedNoteId(latestUpdatedNote.id);
      setTitle(latestUpdatedNote.title);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (selectedNoteId) {
      loadNote();
    }
  }, [selectedNoteId, loadNote]);

  useEffect(() => {
    if (editor && noteContent) {
      editor.commands.setContent(noteContent);
      setTitle(noteTitle);
    }
  }, [editor, noteContent, noteTitle]);

  const contextValue = useMemo(
    () => ({
      selectedNoteId,
      setSelectedNoteId,
      title,
      updateNoteTitle,
      loading: loadingNotes || loadingNote,
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
      loadingNotes,
      loadingNote,
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
