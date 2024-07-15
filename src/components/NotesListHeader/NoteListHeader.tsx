// components/NotesListHeader/NotesListHeader.tsx
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
  handleCreateNewNote: () => void;
  handleInput: (ev: CustomEvent) => void;
  currentView: "notes" | "journal";
  switchView: (view: "notes" | "journal") => void;
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  handleCreateNewNote,
  handleInput,
  currentView,
  switchView,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleViewSwitch = (view: "notes" | "journal") => {
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
            {currentView === "notes" ? "Notes" : "Journal"}
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
              {currentView === "notes" ? (
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
                    onClick={handleCreateNewNote}
                  >
                    Quick Note
                  </IonItem>
                </>
              ) : (
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => handleViewSwitch("notes")}
                >
                  Notes
                </IonItem>
              )}
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
          placeholder={
            currentView === "notes" ? "Search Note" : "Search Journal"
          }
        ></IonSearchbar>
      </IonToolbar>
    </IonHeader>
  );
};

export default NotesListHeader;
