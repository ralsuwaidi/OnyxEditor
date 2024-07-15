// components/NotesListPage.tsx
import { IonMenu, IonToast } from "@ionic/react";
import { useRef } from "react";
import { useNotesList } from "../../hooks/useNotesList";
import { useSliding } from "../../hooks/useSliding";
import { NoteMetadataType } from "../../types/NoteType";
import NotesListHeader from "../../components/NotesListHeader/NoteListHeader";
import NotesListContent from "../../components/NotesListContent";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const {
    sortedNotes,
    showToast,
    setShowToast,
    handleRefresh,
    handleCreateNewNote,
    handlePinNote,
    handleDeleteNote,
    handleSelectNote,
    handleInput,
  } = useNotesList();

  const { handleSliding, isSliding, resetSliding } = useSliding();

  const menuRef = useRef<HTMLIonMenuElement | null>(null);

  const handleNoteSelect = (noteMetadata: NoteMetadataType) => {
    if (!isSliding(noteMetadata.id)) {
      handleSelectNote(noteMetadata);
    }
    resetSliding(noteMetadata.id);
  };

  const handleCreateNote = async () => {
    await handleCreateNewNote();
    menuRef.current?.close();
  };

  return (
    <>
      <IonMenu
        className="full-menu"
        ref={menuRef}
        contentId={contentId}
        type="push"
      >
        <NotesListHeader
          handleCreateNewNote={handleCreateNote}
          handleInput={(ev: CustomEvent) =>
            handleInput(
              (ev.target as HTMLIonSearchbarElement).value?.toLowerCase() || ""
            )
          }
        />

        <NotesListContent
          sortedNotes={sortedNotes}
          handleRefresh={handleRefresh}
          handleSliding={handleSliding}
          handleSelectNote={handleNoteSelect}
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
