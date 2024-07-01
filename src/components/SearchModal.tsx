import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef, useState } from "react";

const SearchNotesModal = ({
  dismiss,
}: {
  dismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const data = [
    "Amsterdam",
    "Buenos Aires",
    "Cairo",
    "Geneva",
    "Hong Kong",
    "Istanbul",
    "London",
    "Madrid",
    "New York",
    "Panama City",
  ];

  let [results, setResults] = useState([...data]);

  const inputRef = useRef<HTMLIonInputElement>(null);
  const modal = useRef<HTMLIonModalElement>(null);

  const handleInput = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(data.filter((d) => d.toLowerCase().indexOf(query) > -1));
  };

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
          debounce={1000}
          onIonInput={(ev) => handleInput(ev)}
          onClick={() => modal.current?.setCurrentBreakpoint(0.75)}
          placeholder="Search"
        ></IonSearchbar>
        <IonList>
          {results.map((result) => (
            <IonItem>
              <IonLabel>
                <h2>{result}</h2>
                <p>New Message</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SearchNotesModal;
