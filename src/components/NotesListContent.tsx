import React, { useRef, useCallback, useEffect, useState } from "react";
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
import { Documents } from "../types/document.types";

interface NotesListContentProps {
  handleSliding: (id: string) => void;
}

const NotesListContent: React.FC<NotesListContentProps> = React.memo(
  ({ handleSliding }) => {
    const {
      loadDocuments,
      documents,
      selectDocument,
      togglePin,
      deleteDocument,
    } = useDocumentStore();
    const [filteredDocs, setFilteredDocs] = useState<Documents[]>([]);

    // Create a ref to store references to all sliding items
    const slidingItemsRef = useRef<{
      [key: string]: HTMLIonItemSlidingElement;
    }>({});

    const handleLocalRefresh = useCallback(
      async (event: CustomEvent) => {
        await loadDocuments();
        event.detail.complete();
      },
      [loadDocuments]
    );

    const handlePinNote = useCallback(
      async (id: string) => {
        await togglePin(id);
        // Close the sliding item
        if (slidingItemsRef.current[id]) {
          slidingItemsRef.current[id].close();
        }
      },
      [togglePin]
    );

    useEffect(() => {
      const sortedAndFilteredDocs = documents
        .filter((document) => document.type === "note")
        .sort((a, b) => {
          // First, sort by pinned status
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;

          // If both are pinned or both are unpinned, sort by updated_at
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;

          return dateB - dateA;
        });

      setFilteredDocs(sortedAndFilteredDocs);
    }, [documents]);

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
  }
);

export default NotesListContent;
