// src/components/Header.tsx
import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonMenuToggle,
} from "@ionic/react";
import { chevronBack, ellipsisVertical } from "ionicons/icons";

interface HeaderProps {
  loading: boolean;
  currentNoteTitle: string | undefined;
  scrollToTop: () => void;
}

const MobileEditorHeader: React.FC<HeaderProps> = ({
  loading,
  currentNoteTitle,
  scrollToTop,
}) => {
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
          {!loading && currentNoteTitle ? currentNoteTitle : " "}
        </IonTitle>
        <IonButtons slot="primary">
          <IonMenuToggle menu="sidebarMenu">
            <IonButton>
              <IonIcon
                className="text-gray-300"
                slot="icon-only"
                size="small"
                icon={ellipsisVertical}
              ></IonIcon>
            </IonButton>
          </IonMenuToggle>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default MobileEditorHeader;
