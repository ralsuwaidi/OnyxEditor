import React, {
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Editor, JSONContent } from "@tiptap/react";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import useLoadNotes from "../hooks/useLoadNotes";
import useLoadNote from "../hooks/useLoadNote";
import FirestoreService from "../services/FirestoreService";

export interface NoteContextProps {
  note: NoteType | null;
  notes: NoteMetadataType[];
  loadAllNotes: () => void;
  selectedNoteMetadata: NoteMetadataType | null;
  setSelectedNoteMetadata: (noteMetadata: NoteMetadataType) => void;
  loading: boolean;
  setEditorInstance: (editor: Editor | null) => void;
  editor: Editor | null;
  noteContent: JSONContent;
  setNoteContent: (content: JSONContent) => void;
  TOCItems: TableOfContentData;
  noteMetadata: NoteMetadataType | null;
  setNoteMetadata: (noteMetadata: NoteMetadataType | null) => void;
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
  const [noteContent, setNoteContent] = useState<JSONContent>([]);
  const [noteMetadata, setNoteMetadata] = useState<NoteMetadataType | null>(
    null
  );
  const [TOCItems, setTOCItems] = useState<TableOfContentData>([]);
  const [editor, setEditor] = useState<Editor | null>(null);

  const { loading: loadingNotes, notes, loadAllNotes } = useLoadNotes();
  const { loading: loadingNote, note, loadNote } = useLoadNote(
    selectedNoteMetadata
  );

  // when note content changes send the changes to firebase
  useEffect(() => {
    const updateNoteContent = async () => {
      try {
        if (selectedNoteMetadata && selectedNoteMetadata.id) {
          await FirestoreService.updateNoteWithDebounce(
            selectedNoteMetadata.id,
            noteContent
          );
        }
      } catch (error) {
        console.error("Failed to update note content", error);
      }
    };

    if (noteContent) {
      updateNoteContent();
    }
  }, [noteContent]);

  // update firestore note metadata when it changes
  useEffect(() => {
    const updateNoteMetadata = async () => {
      try {
        if (noteMetadata) {
          await FirestoreService.updateNoteMetadata(noteMetadata);
        }
      } catch (error) {
        console.error("Failed to update note content", error);
      }
    };

    if (noteMetadata) {
      updateNoteMetadata();
    }
  }, [noteMetadata]);

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
      selectedNoteMetadata,
      setSelectedNoteMetadata,
      loading: loadingNotes || loadingNote,
      notes,
      noteMetadata,
      editor,
      noteContent,
      setEditorInstance,
      TOCItems,
      setNoteMetadata,
      setNoteContent,
      setTOCItemsInstance,
      loadAllNotes,
    }),
    [
      note,
      selectedNoteMetadata,
      setSelectedNoteMetadata,
      loadingNotes,
      loadingNote,
      notes,
      setNoteMetadata,
      noteContent,
      editor,
      setNoteContent,
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
