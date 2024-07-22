import React from "react";
import {
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonMenuToggle,
} from "@ionic/react";
import { NoteMetadataType } from "../types/note.types";
import NoteItem from "./NoteItem";
import { SortNotes } from "../utils/sortNotes";
import useDocumentStore from "../contexts/useDocumentStore";

interface NotesListContentProps {
  sortedNotes: NoteMetadataType[];
  handleRefresh: (event: CustomEvent) => void;
  handleSliding: (id: string) => void;
  handleSelectNote: (noteMetadata: NoteMetadataType) => void;
  handlePinNote: (
    noteMetadata: NoteMetadataType,
    event: any,
    slidingItem: HTMLIonItemSlidingElement
  ) => void;
  handleDeleteNote: (id: string) => void;
}

const NotesListContent: React.FC<NotesListContentProps> = ({
  sortedNotes,
  handleRefresh,
  handleSliding,
  handleSelectNote,
  handlePinNote,
  handleDeleteNote,
}) => {
  const { loadDocuments } = useDocumentStore();

  const handleLocalRefresh = (event: CustomEvent) => {
    // TODO: add await on load docs
    loadDocuments();
    handleRefresh(event);
  };

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleLocalRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        {sortedNotes
          .filter(
            (note) => note.metadata?.type === "note" || !note.metadata?.type
          )
          .sort(SortNotes)
          .map((note) => (
            <IonItemSliding
              key={note.id}
              onIonDrag={() => handleSliding(note.id)}
            >
              <IonMenuToggle>
                <NoteItem note={note} handleSelectNote={handleSelectNote} />
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
    </>
  );
};

export default NotesListContent;
