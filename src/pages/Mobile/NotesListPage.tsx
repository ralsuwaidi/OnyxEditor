// components/NotesListPage.tsx
import { IonMenu, IonToast, IonContent, IonPage } from "@ionic/react";
import { useRef, useState } from "react";
import NotesListHeader from "../../components/mobile/NotesListHeader/NoteListHeader";
import NotesListContent from "../../components/mobile/NotesListContent";
import JournalEntries from "../../components/mobile/JournalEntries";
import "./notesListPage.css";
import useUIStateStore from "../../contexts/useUIStateStore";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const [currentView, setCurrentView] = useState<"note" | "journal">("note");

  const menuRef = useRef<HTMLIonMenuElement | null>(null);

  const { toast, setToast } = useUIStateStore(); // Use the toast store

  return (
    <IonPage className="ion-page-black-background">
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
            <NotesListContent />
          ) : (
            <JournalEntries />
          )}
        </IonContent>
      </IonMenu>
      <IonToast
        isOpen={!!toast.message}
        message={toast.message!}
        duration={3000}
        onDidDismiss={() => setToast(null)}
      />
    </IonPage>
  );
}
