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
import NoteItem from "./NoteItem";
import useDocumentStore from "../contexts/useDocumentStore";

interface NotesListContentProps {
  handleSliding: (id: string) => void;
}

const NotesListContent: React.FC<NotesListContentProps> = ({
  handleSliding,
}) => {
  const {
    loadDocuments,
    documents,
    selectDocument,
    togglePin,
    deleteDocument,
  } = useDocumentStore();

  const handleLocalRefresh = async (event: CustomEvent) => {
    await loadDocuments();
    event.detail.complete();
  };

  const handlePinNote = async (
    id: string,
    event: React.MouseEvent<HTMLIonItemOptionElement, MouseEvent>
  ) => {
    await togglePin(id);
    event.currentTarget.closest("ion-item-sliding")!;
  };

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleLocalRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        {documents
          .filter((document) => document.type === "note")
          .map((document) => (
            <IonItemSliding
              key={document.id}
              onIonDrag={() => handleSliding(document.id)}
            >
              <IonMenuToggle>
                <NoteItem
                  document={document}
                  handleSelectNote={selectDocument}
                />
              </IonMenuToggle>

              <IonItemOptions side="start">
                <IonItemOption
                  className="min-w-24"
                  color="primary"
                  onClick={(event) => handlePinNote(document.id, event)}
                >
                  {document.pinned ? "Unpin" : "Pin"}
                </IonItemOption>
              </IonItemOptions>

              <IonItemOptions>
                <IonItemOption
                  className="min-w-24"
                  color="danger"
                  onClick={() => deleteDocument(document.id)}
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
