import { useEffect, useState } from "react";
import { useNoteContext } from "../contexts/NoteContext";
import FirestoreService from "../services/FirestoreService";
import { Note } from "../pages/NotesListPage/NotesListPage";

export const useNoteSelection = () => {
  const { selectedNoteId, setSelectedNoteId } = useNoteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotes = async () => {
    const fetchedNotes = await FirestoreService.loadAllDocumentTitles();
    setNotes(fetchedNotes);
    setLoading(false);

    // Set the latest updated note as selected if no note is selected
    if (!selectedNoteId && fetchedNotes.length > 0) {
      const latestUpdatedNote = fetchedNotes.reduce((latest, note) => {
        return latest.updatedAt.toDate() > note.updatedAt.toDate()
          ? latest
          : note;
      });
      setSelectedNoteId(latestUpdatedNote.id);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedNoteId, setSelectedNoteId]);

  return { notes, loading, loadNotes, setLoading, setSelectedNoteId };
};
