import React, { forwardRef } from "react";
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useNoteContext } from "../hooks/useNoteContext";
import { TableOfContents } from "./TableOfContents/TableOfContents";

const MemorizedToC = React.memo(TableOfContents);

const Sidebar = forwardRef<HTMLIonMenuElement>((_, ref) => {
  const { editor, TOCItems } = useNoteContext();
  return (
    <IonMenu ref={ref} side="end" contentId="main-content" menuId="sidebarMenu">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contents</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="table-of-contents">
          <MemorizedToC editor={editor} items={TOCItems} menuRef={ref} />{" "}
        </div>
      </IonContent>
    </IonMenu>
  );
});

export default Sidebar;
