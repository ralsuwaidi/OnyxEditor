// useLoadNote.js
import { useState, useCallback } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType, NoteType } from "../types/note.types";

const useLoadNote = (noteMetadata: NoteMetadataType | null) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<NoteType | null>(null);

  const loadNote = useCallback(async () => {
    if (!noteMetadata) return;

    setLoading(true);
    try {
      const note = await FirestoreService.fetchNoteById(noteMetadata.id);
      if (note) {
        setNote(note);
      }
    } catch (error) {
      console.error("Failed to load note content", error);
    } finally {
      setLoading(false);
    }
  }, [noteMetadata]);

  return { loading, note, loadNote };
};

export default useLoadNote;
