import { IonContent, IonItem, IonList, IonPopover } from "@ionic/react";

const ViewSwitcherPopover: React.FC<{
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
  currentView: "note" | "journal";
  handleViewSwitch: (view: "note" | "journal") => void;
}> = ({ popoverOpen, setPopoverOpen, currentView, handleViewSwitch }) => (
  <IonPopover
    isOpen={popoverOpen}
    onDidDismiss={() => setPopoverOpen(false)}
    trigger="notes-list-title-popover"
    dismissOnSelect={true}
  >
    <IonContent>
      <IonList>
        <IonItem
          button={true}
          detail={false}
          onClick={() =>
            handleViewSwitch(currentView === "note" ? "journal" : "note")
          }
        >
          {currentView === "note" ? "Journal" : "Notes"}
        </IonItem>
      </IonList>
    </IonContent>
  </IonPopover>
);

export default ViewSwitcherPopover;
