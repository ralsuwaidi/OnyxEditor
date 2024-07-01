import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface NotesListPageProps {
  contentId: string;
}

export default function NotesListPage({ contentId }: NotesListPageProps) {
  return (
    <>
      <IonMenu contentId={contentId} type="push">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          This is the menu content.
        </IonContent>
      </IonMenu>
    </>
  );
}
