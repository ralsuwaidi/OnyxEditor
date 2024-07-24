// src/components/Header.tsx
import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonMenuToggle,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
} from "@ionic/react";
import { chevronBack, ellipsisVertical, trash } from "ionicons/icons";
import useDocumentStore from "../contexts/useDocumentStore";
import { Documents } from "../types/document.types";

interface HeaderProps {
  loading: boolean;
  scrollToTop: () => void;
}

const MobileEditorHeader: React.FC<HeaderProps> = ({
  loading,
  scrollToTop,
}) => {
  const [popoverState, setPopoverState] = useState({
    showPopover: false,
    event: undefined,
  });
  const { deleteDocument, selectedDocument } = useDocumentStore();

  const openPopover = (e: any) => {
    e.persist();
    setPopoverState({ showPopover: true, event: e });
  };

  const deleteNote = () => {
    if (selectedDocument) {
      deleteDocument(selectedDocument.id);
    }
    setPopoverState({ showPopover: false, event: undefined });
  };

  const getTitle = (document: Documents) => {
    const title =
      document.type == "note" ? document.title || "" : document.created_at;
    return title;
  };

  return (
    <IonHeader translucent={false}>
      <IonToolbar>
        <IonButtons slot="secondary">
          <IonMenuToggle>
            <IonButton>
              <IonIcon
                className="text-gray-300"
                slot="icon-only"
                icon={chevronBack}
              ></IonIcon>
            </IonButton>
          </IonMenuToggle>
        </IonButtons>
        <IonTitle onClick={scrollToTop} style={{ cursor: "pointer" }}>
          {!loading && selectedDocument ? getTitle(selectedDocument) : " "}
        </IonTitle>
        <IonButtons slot="primary">
          <IonButton onClick={openPopover}>
            <IonIcon
              className="text-gray-300"
              slot="icon-only"
              size="small"
              icon={ellipsisVertical}
            ></IonIcon>
          </IonButton>
          <IonPopover
            event={popoverState.event}
            isOpen={popoverState.showPopover}
            onDidDismiss={() =>
              setPopoverState({ showPopover: false, event: undefined })
            }
          >
            <IonContent>
              <IonList>
                <IonMenuToggle>
                  <IonItem button onClick={deleteNote}>
                    <IonIcon icon={trash} slot="start" />
                    Delete Note
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </IonContent>
          </IonPopover>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default MobileEditorHeader;
