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
import { useEffect, useRef, useState } from "react";
import { pin } from "ionicons/icons";
import { SortNotes } from "../../utils/sortNotes";
import { NoteMetadataType } from "../../types/NoteType";
import { useNoteContext } from "../../hooks/useNoteContext";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  const {
    notes,
    loadAllNotes: loadNotes,
    setSelectedNoteMetadata,
  } = useNoteContext();
  const [results, setResults] = useState<NoteMetadataType[]>([]);
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
    loadNotes();
    setSelectedNoteMetadata(documentId);
    menuRef.current?.close();
  };

  const handlePinNote = async (
    id: string,
    pinned: boolean,
    event: any,
    slidingItem: HTMLIonItemSlidingElement
  ) => {
    event.stopPropagation();
    try {
      await FirestoreService.updateMetadata(id, { pin: !pinned });
      loadNotes();
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
      await FirestoreService.deleteNote(id);
      loadNotes();
      setShowToast("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setShowToast("Failed to delete note");
    }
  };

  const handleSelectNote = (noteMetadata: NoteMetadataType) => {
    if (!slidingRef.current[noteMetadata.id]) {
      setSelectedNoteMetadata(noteMetadata);
    }
    slidingRef.current[noteMetadata.id] = false;
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
      <IonMenu
        className="full-menu"
        ref={menuRef}
        contentId={contentId}
        type="push"
      >
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
            {sortedNotes.sort(SortNotes).map((note) => (
              <IonItemSliding
                key={note.id}
                onIonDrag={() => handleSliding(note.id)}
              >
                <IonMenuToggle>
                  <IonItem button={true} onClick={() => handleSelectNote(note)}>
                    <IonLabel>
                      <h2>{note.title == "" ? "(No Title)" : note.title}</h2>
                      <p>
                        {note.metadata?.pin && (
                          <>
                            <IonIcon icon={pin} />
                          </>
                        )}
                        {formatDateWithoutYear(note.updatedAt)}
                      </p>
                    </IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonItemOptions side="start">
                  <IonItemOption
                    color="primary"
                    onClick={(event) =>
                      handlePinNote(
                        note.id,
                        note.metadata?.pin || false,
                        event,
                        event.currentTarget.closest("ion-item-sliding")!
                      )
                    }
                  >
                    <IonIcon slot="end" icon={pin}></IonIcon>
                    {note.metadata?.pin ? "Unpin" : "Pin"}
                  </IonItemOption>
                </IonItemOptions>

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
