import {
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, chevronDownOutline } from "ionicons/icons";
import useDocumentStore from "../../contexts/useDocumentStore";

const TitleToolbar: React.FC<{
  currentView: "note" | "journal";
  setPopoverOpen: (open: boolean) => void;
}> = ({ currentView, setPopoverOpen }) => {
  const { createDocument } = useDocumentStore();

  const handleCreate = async (type: "journal" | "note") => {
    createDocument(type);
  };

  return (
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
      <IonButtons slot="end">
        <IonButton onClick={() => handleCreate(currentView)}>
          <IonIcon icon={add} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default TitleToolbar;
