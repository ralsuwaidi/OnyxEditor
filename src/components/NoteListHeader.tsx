import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { add } from "ionicons/icons";

interface NotesListHeaderProps {
  handleCreateNewNote: () => void;
  handleInput: (ev: CustomEvent) => void;
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  handleCreateNewNote,
  handleInput,
}) => {
  return (
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
  );
};

export default NotesListHeader;
