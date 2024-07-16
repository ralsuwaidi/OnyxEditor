import React, { useState } from "react";
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
import { add, chevronDownOutline } from "ionicons/icons";

interface NotesListHeaderProps {
  handleCreateNewNote: (type: "note" | "journal") => void;
  handleInput: (ev: CustomEvent) => void;
  currentView: "note" | "journal";
  switchView: (view: "note" | "journal") => void;
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  handleCreateNewNote,
  handleInput,
  currentView,
  switchView,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleViewSwitch = (view: "note" | "journal") => {
    switchView(view);
    setPopoverOpen(false);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <IonButton
            className="notes-list-title-btn font-semibold"
            fill="clear"
            id="notes-list-title-popover"
            onClick={() => setPopoverOpen(true)}
          >
            {currentView === "note" ? "Notes" : "Journal"}
            <IonIcon
              size="small"
              icon={chevronDownOutline}
              style={{ marginLeft: "4px" }}
            />
          </IonButton>
        </IonTitle>

        <IonPopover
          isOpen={popoverOpen}
          onDidDismiss={() => setPopoverOpen(false)}
          trigger="notes-list-title-popover"
          dismissOnSelect={true}
        >
          <IonContent>
            <IonList>
              {currentView === "note" ? (
                <>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => handleViewSwitch("journal")}
                  >
                    Journal
                  </IonItem>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => handleCreateNewNote("note")}
                  >
                    Quick Note
                  </IonItem>
                </>
              ) : (
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => handleViewSwitch("note")}
                >
                  Notes
                </IonItem>
              )}
            </IonList>
          </IonContent>
        </IonPopover>

        <IonButtons slot="end">
          <IonButton onClick={() => handleCreateNewNote(currentView)}>
            <IonIcon icon={add} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar
          debounce={500}
          onIonInput={handleInput}
          placeholder={
            currentView === "note" ? "Search Note" : "Search Journal"
          }
        ></IonSearchbar>
      </IonToolbar>
    </IonHeader>
  );
};

export default NotesListHeader;
