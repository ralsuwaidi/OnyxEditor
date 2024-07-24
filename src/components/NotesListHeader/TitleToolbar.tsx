import { IonButton, IonButtons, IonTitle, IonToolbar } from "@ionic/react";
import { Plus, CaretDown, Calendar } from "@phosphor-icons/react";
import useDocumentStore from "../../contexts/useDocumentStore";

const TitleToolbar: React.FC<{
  currentView: "note" | "journal";
  setPopoverOpen: (open: boolean) => void;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ currentView, setPopoverOpen, setCalendarOpen }) => {
  const { createDocument } = useDocumentStore();

  const handleCreate = async (type: "journal" | "note") => {
    createDocument(type);
  };

  const handleCalendarToggle = () => {
    setCalendarOpen((prevState) => !prevState);
  };

  return (
    <IonToolbar>
      <IonButtons slot="start">
        {currentView === "journal" && (
          <IonButton onClick={handleCalendarToggle}>
            <Calendar size={24} />
          </IonButton>
        )}
      </IonButtons>
      <IonTitle>
        <IonButton
          className="notes-list-title-btn font-semibold"
          fill="clear"
          id="notes-list-title-popover"
          onClick={() => setPopoverOpen(true)}
        >
          {currentView === "note" ? "Notes" : "Journal"}
          <CaretDown size={16} style={{ marginLeft: "4px" }} />
        </IonButton>
      </IonTitle>

      <IonButtons slot="end">
        <IonButton onClick={() => handleCreate(currentView)}>
          <Plus size={24} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default TitleToolbar;
