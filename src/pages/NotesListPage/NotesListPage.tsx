// components/NotesListPage.tsx
import { IonMenu, IonToast, IonContent } from "@ionic/react";
import { useRef, useState } from "react";
import { useNotesList } from "../../hooks/useNotesList";
import { useSliding } from "../../hooks/useSliding";
import NotesListHeader from "../../components/NotesListHeader/NoteListHeader";
import NotesListContent from "../../components/NotesListContent";
import JournalEntries from "../../components/JournalEntries";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const { showToast, setShowToast } = useNotesList();

  const { handleSliding } = useSliding();
  const [currentView, setCurrentView] = useState<"note" | "journal">("note");

  const menuRef = useRef<HTMLIonMenuElement | null>(null);

  return (
    <>
      <IonMenu
        className="full-menu"
        ref={menuRef}
        contentId={contentId}
        type="push"
      >
        <NotesListHeader
          currentView={currentView}
          switchView={setCurrentView}
        />

        <IonContent className="ion-padding">
          {currentView === "note" ? (
            <NotesListContent handleSliding={handleSliding} />
          ) : (
            <JournalEntries />
          )}
        </IonContent>
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
