import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuToggle,
  IonRefresher,
  useIonModal,
  RefresherEventDetail,
} from "@ionic/react";
import Editor from "../../components/Editor";
import { useEffect, useState } from "react";
import { chevronBack, ellipsisVertical } from "ionicons/icons";
import NotesListPage from "../NotesListPage/NotesListPage";
import SearchModal from "../../components/SearchModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useNoteContext } from "../../contexts/NoteContext";

export default function EditorPage() {
  const { title, updateNoteTitle } = useNoteContext();
  const [maxHeight, setMaxHeight] = useState("calc(100vh - 100px)");
  const [present, dismiss] = useIonModal(SearchModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  useEffect(() => {
    const updateMaxHeight = () => {
      const offset = 110;
      setMaxHeight(`calc(100vh - ${offset}px)`);
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  function openModal(event: CustomEvent<RefresherEventDetail>) {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "confirm") {
          console.log("confirmed");
        }
        event.detail.complete();
      },
    });
  }

  const handleTitleChange = (e: CustomEvent) => {
    const newTitle = e.detail.value as string;
    updateNoteTitle(newTitle);
  };

  return (
    <>
      <NotesListPage contentId="main-content" />
      <IonPage id="main-content">
        <IonHeader translucent={false}>
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon
                    className="text-gray-300"
                    slot="icon-only"
                    icon={chevronBack}
                  ></IonIcon>
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="primary">
              <IonButton>
                <IonIcon
                  className="text-gray-300"
                  slot="icon-only"
                  size="small"
                  icon={ellipsisVertical}
                ></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={false} fullscreen={false}>
          <div
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <IonRefresher
              slot="fixed"
              pullFactor={0.5}
              pullMin={100}
              pullMax={200}
              onIonRefresh={openModal}
            ></IonRefresher>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonInput
                  className="ml-3 text-3xl font-extrabold"
                  value={title}
                  placeholder="Enter Title"
                  onIonChange={handleTitleChange}
                />
              </IonToolbar>
            </IonHeader>
            <Editor />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
