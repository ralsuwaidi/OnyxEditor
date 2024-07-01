import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef } from "react";

const SearchNotesModal = ({
  dismiss,
}: {
  dismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonInputElement>(null);
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, "cancel")}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Welcome</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => dismiss(inputRef.current?.value, "confirm")}
              strong={true}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          onClick={() => modal.current?.setCurrentBreakpoint(0.75)}
          placeholder="Search"
        ></IonSearchbar>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=b" />
            </IonAvatar>
            <IonLabel>
              <h2>Connor Smith</h2>
              <p>Sales Rep</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=a" />
            </IonAvatar>
            <IonLabel>
              <h2>Daniel Smith</h2>
              <p>Product Designer</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=d" />
            </IonAvatar>
            <IonLabel>
              <h2>Greg Smith</h2>
              <p>Director of Operations</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=e" />
            </IonAvatar>
            <IonLabel>
              <h2>Zoey Smith</h2>
              <p>CEO</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SearchNotesModal;
