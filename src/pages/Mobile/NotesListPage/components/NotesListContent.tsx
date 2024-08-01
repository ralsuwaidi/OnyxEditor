import React, { useRef, useCallback } from "react";
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
import useDocumentStore from "../../../../contexts/useDocumentStore";
import useFilteredNoteList from "../../../../hooks/useFilteredNoteList";
import { useSliding } from "../../../../hooks/useSliding";

const NotesListContent: React.FC = React.memo(() => {
  const { loadDocuments, selectDocument, togglePin, deleteDocument } = useDocumentStore();
  const { handleSliding } = useSliding();
  const filteredDocs = useFilteredNoteList();



  // Create a ref to store references to all sliding items
  const slidingItemsRef = useRef<{ [key: string]: HTMLIonItemSlidingElement }>({});

  const handleLocalRefresh = useCallback(async (event: CustomEvent) => {
    await loadDocuments();
    event.detail.complete();
  }, [loadDocuments]);

  const handlePinNote = useCallback(async (id: string) => {
    await togglePin(id);
    // Close the sliding item
    if (slidingItemsRef.current[id]) {
      slidingItemsRef.current[id].close();
    }
  }, [togglePin]);

  // Clear and reinitialize refs whenever the filteredDocs change
  React.useEffect(() => {
    const newRefs: { [key: string]: HTMLIonItemSlidingElement } = {};
    filteredDocs.forEach((document) => {
      if (slidingItemsRef.current[document.id]) {
        newRefs[document.id] = slidingItemsRef.current[document.id];
      }
    });
    slidingItemsRef.current = newRefs;
  }, [filteredDocs]);

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleLocalRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        {filteredDocs.map((document) => (
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
              <NoteItem document={document} handleSelectNote={selectDocument} />
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
});

export default NotesListContent;
