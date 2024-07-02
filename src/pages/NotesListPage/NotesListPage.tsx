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
  IonSearchbar,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
} from "@ionic/react";
import { add } from "ionicons/icons";
import FirestoreService from "../../services/FirestoreService";
import { useNoteContext } from "../../contexts/NoteContext";
import { useEffect, useRef, useState } from "react";

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
  const [showToast, setShowToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLIonMenuElement | null>(null);
  const slidingRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    setResults(notes);
  }, [notes]);

  const handleRefresh = async (event: CustomEvent) => {
    await loadNotes();
    event.detail.complete();
  };

  const handleCreateNewNote = async () => {
    const documentId = await FirestoreService.createNewNote();
    await loadNotes();
    setSelectedNoteId(documentId);
    menuRef.current?.close();
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await FirestoreService.deleteNote(id);
      await loadNotes();
      setShowToast("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setShowToast("Failed to delete note");
    }
  };

  const handleSelectNote = (id: string) => {
    if (!slidingRef.current[id]) {
      setSelectedNoteId(id);
    }
    slidingRef.current[id] = false;
  };

  const handleSliding = (id: string) => {
    slidingRef.current[id] = true;
  };

  const formatDateWithoutYear = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(date.toDate()).toLocaleDateString(undefined, options);
  };

  const handleInput = (ev: CustomEvent) => {
    const query =
      (ev.target as HTMLIonSearchbarElement).value?.toLowerCase() || "";
    setResults(
      notes.filter((note) => note.title.toLowerCase().includes(query))
    );
  };

  const sortedNotes = results.length > 0 ? results : notes;

  return (
    <>
      <IonMenu ref={menuRef} contentId={contentId} type="push">
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
            {sortedNotes
              .sort(
                (a, b) =>
                  new Date(b.updatedAt.toDate()).getTime() -
                  new Date(a.updatedAt.toDate()).getTime()
              )
              .map((note) => (
                <IonItemSliding
                  key={note.id}
                  onIonDrag={() => handleSliding(note.id)}
                >
                  <IonMenuToggle>
                    <IonItem
                      button={true}
                      onClick={() => handleSelectNote(note.id)}
                    >
                      <IonLabel>
                        <h2>{note.title}</h2>
                        <p>{formatDateWithoutYear(note.updatedAt)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonMenuToggle>

                  <IonItemOptions>
                    <IonItemOption
                      color="danger"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
          </IonList>
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
