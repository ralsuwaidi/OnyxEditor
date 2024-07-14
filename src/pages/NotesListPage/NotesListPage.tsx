import { IonMenu, IonToast } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { NoteMetadataType } from "../../types/NoteType";
import useNoteStore from "../../contexts/noteStore";
import NotesListHeader from "../../components/NotesListHeader/NoteListHeader";
import NotesListContent from "../../components/NotesListContent";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const allNotes = useNoteStore((state) => state.allNotes);
  const fetchAllNotes = useNoteStore((state) => state.fetchAllNotes);
  const createNote = useNoteStore((state) => state.createNote);
  const togglePinNote = useNoteStore((state) => state.pinNote);
  const deleteNoteById = useNoteStore((state) => state.deleteNoteById);
  const setCurrentNoteById = useNoteStore((state) => state.setCurrentNoteById);

  const [results, setResults] = useState<NoteMetadataType[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLIonMenuElement | null>(null);
  const slidingRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    setResults(allNotes);
  }, [allNotes]);

  const handleRefresh = async (event: CustomEvent) => {
    await fetchAllNotes();
    event.detail.complete();
  };

  const handleCreateNewNote = async () => {
    await createNote();
    menuRef.current?.close();
  };

  const handlePinNote = async (
    noteMetadata: NoteMetadataType,
    event: any,
    slidingItem: HTMLIonItemSlidingElement
  ) => {
    event.stopPropagation();
    try {
      togglePinNote(noteMetadata);
      setShowToast("Note pinned successfully");
    } catch (error) {
      console.error("Failed to pin note:", error);
      setShowToast("Failed to pin note");
    } finally {
      slidingItem.close();
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
    if (!slidingRef.current[noteMetadata.id]) {
      setCurrentNoteById(noteMetadata.id);
    }
    slidingRef.current[noteMetadata.id] = false;
  };

  const handleSliding = (id: string) => {
    slidingRef.current[id] = true;
  };

  const handleInput = (ev: CustomEvent) => {
    const query =
      (ev.target as HTMLIonSearchbarElement).value?.toLowerCase() || "";

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

  return (
    <>
      <IonMenu
        className="full-menu"
        ref={menuRef}
        contentId={contentId}
        type="push"
      >
        <NotesListHeader
          handleCreateNewNote={handleCreateNewNote}
          handleInput={handleInput}
        />

        <NotesListContent
          sortedNotes={sortedNotes}
          handleRefresh={handleRefresh}
          handleSliding={handleSliding}
          handleSelectNote={handleSelectNote}
          handlePinNote={handlePinNote}
          handleDeleteNote={handleDeleteNote}
        />
      </IonMenu>
      <IonToast
        isOpen={!!showToast}
        message={showToast!}
        duration={3000}
        onDidDismiss={() => setShowToast(null)}
      />
    </>
  );
}
