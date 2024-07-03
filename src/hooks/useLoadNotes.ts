import { useState, useCallback, useEffect } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType } from "../types/NoteType";

const useLoadNotes = (
  selectedNoteId: string,
  setSelectedNoteId: (id: string) => void,
  setTitle: (title: string) => void
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteMetadataType[]>([]);

  const loadAllNotes = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNotes = await FirestoreService.getNoteTitles();
      setNotes(fetchedNotes);

      if (!selectedNoteId && fetchedNotes.length > 0) {
        const latestUpdatedNote = fetchedNotes.reduce((latest, note) =>
          latest.updatedAt.toDate() > note.updatedAt.toDate() ? latest : note
        );
        setSelectedNoteId(latestUpdatedNote.id);
        setTitle(latestUpdatedNote.title);
      }
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setLoading(false);
    }
  }, [selectedNoteId, setSelectedNoteId, setTitle]);

  useEffect(() => {
    loadAllNotes();
  }, [loadAllNotes]);

  return { loading, notes, loadAllNotes };
};

export default useLoadNotes;
