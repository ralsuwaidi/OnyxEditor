import React, { useRef } from "react";
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

  // Create a ref to store references to all sliding items
  const slidingItemsRef = useRef<{ [key: string]: HTMLIonItemSlidingElement }>(
    {}
  );

  const handleLocalRefresh = async (event: CustomEvent) => {
    await loadDocuments();
    event.detail.complete();
  };

  const handlePinNote = async (id: string) => {
    await togglePin(id);
    // Close the sliding item
    if (slidingItemsRef.current[id]) {
      slidingItemsRef.current[id].close();
    }
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
              ref={(el) => {
                if (el) {
                  slidingItemsRef.current[document.id] = el;
                }
              }}
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
                  onClick={() => handlePinNote(document.id)}
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
