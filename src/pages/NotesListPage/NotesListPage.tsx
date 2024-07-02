import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonMenuToggle,
  IonRippleEffect,
  IonSearchbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import FirestoreService from "../../services/FirestoreService";
import { useNoteContext } from "../../contexts/NoteContext";
import { useState } from "react";

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
  const { notes, loadNotes, setSelectedNoteId } = useNoteContext();
  const [results, setResults] = useState<Note[]>([]);

  const handleRefresh = async (event: CustomEvent) => {
    await loadNotes();
    event.detail.complete();
  };

  const handleCreateNewNote = async () => {
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

  const handleInput = (ev: CustomEvent) => {
    const query =
      (ev.target as HTMLIonSearchbarElement).value?.toLowerCase() || "";
    setResults(
      notes.filter((note) => note.title.toLowerCase().includes(query))
    );
  };

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
          <IonToolbar>
            <IonSearchbar
              debounce={500}
              onIonInput={handleInput}
              placeholder="Search Note"
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonList>
            {results.length > 0
              ? results.map((note) => (
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
                ))
              : sortedNotes.map((note) => (
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
        </IonContent>
      </IonMenu>
    </>
  );
}
