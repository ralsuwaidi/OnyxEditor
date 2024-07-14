import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
} from "@ionic/react";
import "./NotesListHeader.css";
import { add, chevronDownOutline } from "ionicons/icons"; // Import the chevron icon

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
        <IonTitle>
          <IonButton
            className="notes-list-title-btn font-semibold"
            fill="clear"
            id="notes-list-title-popover"
          >
            Notes
            <IonIcon
              size="small"
              icon={chevronDownOutline}
              style={{ marginLeft: "4px" }}
            />{" "}
          </IonButton>
        </IonTitle>

        <IonPopover trigger="notes-list-title-popover" dismissOnSelect={true}>
          <IonContent>
            <IonList>
              <IonItem button={true} detail={false}>
                Quick Note
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

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
