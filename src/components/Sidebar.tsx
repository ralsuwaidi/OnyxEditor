import React, { forwardRef } from "react";
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { TableOfContents } from "./TableOfContents/TableOfContents";
import useEditorStore from "../contexts/useEditorStore";

const MemorizedToC = React.memo(TableOfContents);

const Sidebar = forwardRef<HTMLIonMenuElement>((_, ref) => {
  const { editor, tableOfContents } = useEditorStore();

  return (
    <IonMenu ref={ref} side="end" contentId="main-content" menuId="sidebarMenu">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contents</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="table-of-contents">
          <MemorizedToC editor={editor} items={tableOfContents} menuRef={ref} />{" "}
        </div>
      </IonContent>
    </IonMenu>
  );
});

export default Sidebar;
