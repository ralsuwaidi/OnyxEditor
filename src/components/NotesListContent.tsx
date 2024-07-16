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
import { NoteMetadataType } from "../types/NoteType";
import NoteItem from "./NoteItem";
import { SortNotes } from "../utils/sortNotes";

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
  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
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
