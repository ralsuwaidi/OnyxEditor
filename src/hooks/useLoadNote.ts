import { useState, useCallback } from "react";
import FirestoreService from "../services/FirestoreService";

const useLoadNote = (noteId: string | null) => {
  const [loading, setLoading] = useState(false);
  const [noteContent, setNoteContent] = useState<object>({});
  const [noteTitle, setNoteTitle] = useState("");

  const loadNote = useCallback(async () => {
    if (!noteId) return;

    setLoading(true);
    try {
      const note = await FirestoreService.loadContentWithID(noteId);
      if (note) {
        setNoteContent(note.content);
        setNoteTitle(note.title);
      }
    } catch (error) {
      console.error("Failed to load note content", error);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  return { loading, noteContent, noteTitle, loadNote };
};

export default useLoadNote;
