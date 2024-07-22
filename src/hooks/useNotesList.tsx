// hooks/useNotesList.ts
import { useState, useEffect } from "react";
import useNoteStore from "../contexts/noteStore";
import { NoteMetadataType } from "../types/note.types";

export function useNotesList() {
  const allNotes = useNoteStore((state) => state.allNotes);
  const fetchAllNotes = useNoteStore((state) => state.fetchAllNotes);
  const createNote = useNoteStore((state) => state.createNote);
  const togglePinNote = useNoteStore((state) => state.pinNote);
  const deleteNoteById = useNoteStore((state) => state.deleteNoteById);
  const setCurrentNoteById = useNoteStore((state) => state.setCurrentNoteById);

  const [results, setResults] = useState<NoteMetadataType[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setResults(allNotes);
  }, [allNotes]);

  const handleRefresh = async (event: CustomEvent) => {
    await fetchAllNotes();
    event.detail.complete();
  };

  const handleCreateNewNote = async (type: "note" | "journal") => {
    await createNote(type);
  };

  const handlePinNote = async (noteMetadata: NoteMetadataType) => {
    try {
      togglePinNote(noteMetadata);
      setShowToast("Note pinned successfully");
    } catch (error) {
      console.error("Failed to pin note:", error);
      setShowToast("Failed to pin note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      deleteNoteById(id);
      setShowToast("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setShowToast("Failed to delete note");
    }
  };

  const handleSelectNote = (noteMetadata: NoteMetadataType) => {
    setCurrentNoteById(noteMetadata.id);
  };

  const handleInput = (query: string) => {
    setResults(
      allNotes.filter((note) => {
        const titleMatches = note.title.toLowerCase().includes(query);
        const tagsMatch = note.metadata?.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return titleMatches || tagsMatch;
      })
    );
  };

  const sortedNotes = results.length > 0 ? results : allNotes;

  return {
    sortedNotes,
    showToast,
    setShowToast,
    handleRefresh,
    handleCreateNewNote,
    handlePinNote,
    handleDeleteNote,
    handleSelectNote,
    handleInput,
  };
}
