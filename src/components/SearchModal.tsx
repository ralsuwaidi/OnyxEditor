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
  IonSpinner,
} from "@ionic/react";
import { useRef, useState, useEffect } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType } from "../types/NoteType";

const SearchNotesModal = ({
  dismiss,
}: {
  dismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const [noteTitles, setNoteTitles] = useState<NoteMetadataType[]>([]);
  const [results, setResults] = useState<NoteMetadataType[]>([]);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLIonInputElement>(null);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const fetchNoteTitles = async () => {
      try {
        const titlesData = await FirestoreService.getNoteTitles();
        setNoteTitles(titlesData);
        setResults(titlesData);
      } catch (error) {
        console.error("Failed to fetch note titles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteTitles();
  }, []);

  const handleInput = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(
      noteTitles.filter((note) => note.title.toLowerCase().includes(query))
    );
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
          <IonTitle>Search Notes</IonTitle>
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
          debounce={500}
          onIonInput={(ev) => handleInput(ev)}
          onClick={() => modal.current?.setCurrentBreakpoint(0.75)}
          placeholder="Search"
        ></IonSearchbar>
        {loading ? (
          <IonSpinner />
        ) : (
          <IonList>
            {results.map((result) => (
              <IonItem key={result.id}>
                <IonLabel>
                  <h2>{result.title}</h2>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SearchNotesModal;
