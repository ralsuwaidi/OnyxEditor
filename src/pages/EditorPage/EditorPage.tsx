// src/pages/EditorPage/EditorPage.tsx
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
  IonSpinner,
} from "@ionic/react";
import Editor from "../../components/Editor";
import { chevronBack, ellipsisVertical } from "ionicons/icons";
import NotesListPage from "../NotesListPage/NotesListPage";
import SearchModal from "../../components/SearchModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useNoteContext } from "../../contexts/NoteContext";
import { useMaxHeight } from "../../hooks/useMaxHeight";

export default function EditorPage() {
  const { title, loading, updateNoteTitle } = useNoteContext();
  const [present, dismiss] = useIonModal(SearchModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  const maxHeight = useMaxHeight();

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
            {loading ? <IonSpinner /> : <Editor />}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
