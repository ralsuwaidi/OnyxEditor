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
} from "@ionic/react";
import { useEffect, useState } from "react";
import { add } from "ionicons/icons";
import FirestoreService from "../../services/FirestoreService";

interface NotesListPageProps {
  contentId: string;
}

interface Note {
  id: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  metadata?: object;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotes = async () => {
    const fetchedNotes = await FirestoreService.loadAllContents();
    setNotes(fetchedNotes);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNewNote = async () => {
    setLoading(true);
    await FirestoreService.createNewNote();
    await loadNotes();
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
          {loading ? (
            <IonSpinner />
          ) : (
            <IonList>
              {notes.map((note) => (
                <IonItem key={note.id}>
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
