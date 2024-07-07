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
import { useEffect, useRef, useState } from "react";
// Import Heroicons pin
import { BookmarkIcon } from "@heroicons/react/16/solid";
import { SortNotes } from "../../utils/sortNotes";
import { NoteMetadataType } from "../../types/NoteType";
import useNoteStore from "../../contexts/noteStore";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  // const {
  //   notes,
  //   loadAllNotes: loadNotes,
  //   setSelectedNoteMetadata,
  // } = useNoteContext();

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
      await togglePinNote(noteMetadata);
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
      allNotes.filter((note) => note.title.toLowerCase().includes(query))
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
                      <div className="line-clamp-2 text-sm text-gray-500">
                        {note.metadata?.sample ? note.metadata.sample : ""}
                      </div>
                      <div className="flex justify-between">
                        <div className=" flex space-x-2 mr-2">
                          {note.metadata?.pin && (
                            <p>
                              <BookmarkIcon className="h-3 w-3 inline-block" />
                            </p>
                          )}
                          <p className="whitespace-nowrap">
                            {formatDateWithoutYear(note.updatedAt)}
                          </p>
                        </div>
                        <div>
                          <div className="flex overflow-x-auto space-x-2">
                            {note.metadata &&
                              note.metadata.tags &&
                              note.metadata.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 whitespace-nowrap"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonItemOptions side="start">
                  <IonItemOption
                    className="min-w-24"
                    color="primary"
                    onClick={(event) =>
                      handlePinNote(
                        note,
                        event,
                        event.currentTarget.closest("ion-item-sliding")!
                      )
                    }
                  >
                    {note.metadata?.pin ? "Unpin" : "Pin"}
                  </IonItemOption>
                </IonItemOptions>

                <IonItemOptions>
                  <IonItemOption
                    className="min-w-24"
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
