import { useEffect } from "react";
import { Editor } from "@tiptap/react";
import FirestoreService from "../services/FirestoreService";
import { useNoteContext } from "../contexts/NoteContext";

export const useLoadSelectedNote = (
  editor: Editor | null,
  setTitle: (title: string) => void
) => {
  const { selectedNoteId } = useNoteContext();

  useEffect(() => {
    if (selectedNoteId) {
      console.log("trying to load note:", selectedNoteId);
      const loadContent = async () => {
        const note = await FirestoreService.loadContentWithID(selectedNoteId);
        if (note) {
          editor?.commands.setContent(note.content);
          setTitle(note.title);
        }
      };
      loadContent();
    }
  }, [selectedNoteId, editor, setTitle]);
};
