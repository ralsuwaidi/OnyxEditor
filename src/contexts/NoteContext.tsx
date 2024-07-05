import React, {
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Editor } from "@tiptap/react";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import useLoadNotes from "../hooks/useLoadNotes";
import useLoadNote from "../hooks/useLoadNote";

export interface NoteContextProps {
  note: NoteType | null;
  updateNote: (note: NoteType) => void;
  notes: NoteMetadataType[];
  loadAllNotes: () => void;
  selectedNoteMetadata: NoteMetadataType | null;
  setSelectedNoteMetadata: (noteMetadata: NoteMetadataType) => void;
  loading: boolean;
  setEditorInstance: (editor: Editor | null) => void;
  editor: Editor | null;
  TOCItems: TableOfContentData;
  setTOCItemsInstance: (items: TableOfContentData) => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [
    selectedNoteMetadata,
    setSelectedNoteMetadata,
  ] = useState<NoteMetadataType | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [TOCItems, setTOCItems] = useState<TableOfContentData>([]);

  const { loading: loadingNotes, notes, loadAllNotes } = useLoadNotes();
  const { loading: loadingNote, note, loadNote, updateNote } = useLoadNote(
    selectedNoteMetadata
  );

  const setTOCItemsInstance = useCallback((items: TableOfContentData) => {
    setTOCItems(items);
  }, []);

  const setEditorInstance = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

  useEffect(() => {
    loadAllNotes();
  }, [loadAllNotes]);

  useEffect(() => {
    if (!selectedNoteMetadata && notes.length > 0) {
      const latestUpdatedNote = notes.reduce((latest, note) =>
        latest.updatedAt.toDate() > note.updatedAt.toDate() ? latest : note
      );
      setSelectedNoteMetadata(latestUpdatedNote);
    }
  }, [notes, selectedNoteMetadata]);

  useEffect(() => {
    if (loadingNote && editor) {
      editor.commands.setContent("Loading");
    }
  }, [loadingNote, editor]);

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(note.content);
    }
  }, [editor, note]);

  useEffect(() => {
    if (selectedNoteMetadata) {
      loadNote();
    }
  }, [selectedNoteMetadata, loadNote]);

  const contextValue = useMemo(
    () => ({
      note,
      updateNote,
      selectedNoteMetadata,
      setSelectedNoteMetadata,
      loading: loadingNotes || loadingNote,
      notes,
      editor,
      setEditorInstance,
      TOCItems,
      setTOCItemsInstance,
      loadAllNotes,
    }),
    [
      note,
      updateNote,
      selectedNoteMetadata,
      setSelectedNoteMetadata,
      loadingNotes,
      loadingNote,
      notes,
      editor,
      setEditorInstance,
      TOCItems,
      setTOCItemsInstance,
      loadAllNotes,
    ]
  );

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  );
};

export default NoteContext;
