import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonButtons,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonMenuToggle,
  IonRippleEffect,
} from "@ionic/react";
import { add } from "ionicons/icons";
import FirestoreService from "../../services/FirestoreService";
import { useNoteSelection } from "../../hooks/useNotesSelection";

interface NotesListPageProps {
  contentId: string;
}

export interface Note {
  id: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  metadata?: object;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const {
    notes,
    loading,
    loadNotes,
    setLoading,
    setSelectedNoteId,
  } = useNoteSelection();

  const handleRefresh = async (event: CustomEvent) => {
    await loadNotes();
    event.detail.complete();
  };

  const handleCreateNewNote = async () => {
    setLoading(true);
    await FirestoreService.createNewNote();
    await loadNotes();
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const formatDateWithoutYear = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(date.toDate()).toLocaleDateString(undefined, options);
  };

  const sortedNotes = [...notes].sort(
    (a, b) => b.updatedAt.toDate() - a.updatedAt.toDate()
  );

  return (
    <>
      <IonMenu contentId={contentId} type="push">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Notes</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCreateNewNote}>
                <IonIcon icon={add} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          {loading ? (
            <IonSpinner />
          ) : (
            <IonList>
              {sortedNotes.map((note) => (
                <IonMenuToggle
                  key={note.id}
                  className="hover:bg-gray-50 ion-activatable"
                >
                  <IonItem onClick={() => handleSelectNote(note.id)}>
                    <IonLabel>
                      <h2>{note.title}</h2>
                      <p>{formatDateWithoutYear(note.updatedAt)}</p>
                    </IonLabel>
                    <IonRippleEffect></IonRippleEffect>
                  </IonItem>
                </IonMenuToggle>
              ))}
            </IonList>
          )}
        </IonContent>
      </IonMenu>
    </>
  );
}
