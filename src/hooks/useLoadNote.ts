// useLoadNote.js
import { useState, useCallback } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType, NoteType } from "../types/NoteType";
import { getSample } from "../libs/utils";

const useLoadNote = (noteMetadata: NoteMetadataType | null) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<NoteType | null>(null);

  const loadNote = useCallback(async () => {
    if (!noteMetadata) return;

    setLoading(true);
    try {
      const note = await FirestoreService.loadContentWithID(noteMetadata.id);
      if (note) {
        setNote(note);
      }
    } catch (error) {
      console.error("Failed to load note content", error);
    } finally {
      setLoading(false);
    }
  }, [noteMetadata]);

  const updateNote = useCallback(async (updatedNote: NoteType) => {
    try {
      // Generate the sample and update the metadata
      const sampleData = getSample(updatedNote.content);
      const updatedMetadata = { ...updatedNote.metadata, sample: sampleData };

      const newUpdatedNote = {
        ...updatedNote,
        metadata: updatedMetadata,
      };

      await FirestoreService.updateFirestoreNoteWithDebounce(newUpdatedNote);
      setNote(newUpdatedNote);
    } catch (error) {
      console.error("Failed to update note content", error);
    }
  }, []);

  return { loading, note, loadNote, updateNote };
};

export default useLoadNote;
