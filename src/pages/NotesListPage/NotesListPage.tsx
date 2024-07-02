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

  return (
    <>
      <IonMenu contentId={contentId} type="push">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
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
              {notes.map((note) => (
                <IonItem
                  key={note.id}
                  className="hover:bg-gray-50"
                  onClick={() => handleSelectNote(note.id)}
                >
                  <IonLabel>
                    <h2>{note.title}</h2>
                    <p>
                      {/* Created at: {note.createdAt.toDate().toLocaleString()} */}
                    </p>
                    <p>
                      {/* Updated at: {note.updatedAt.toDate().toLocaleString()} */}
                    </p>
                    {note.metadata && (
                      <p>Metadata: {JSON.stringify(note.metadata)}</p>
                    )}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonContent>
      </IonMenu>
    </>
  );
}
