import { useState, useCallback } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType } from "../types/NoteType";

const useLoadNotes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteMetadataType[]>([]);

  const loadAllNotes = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNotes = await FirestoreService.fetchAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, notes, loadAllNotes };
};

export default useLoadNotes;
