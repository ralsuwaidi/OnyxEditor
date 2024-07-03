import { useRef } from "react";
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
import { chevronBack, ellipsisVertical } from "ionicons/icons";
import NotesListPage from "../NotesListPage/NotesListPage";
import SearchModal from "../../components/SearchModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useNoteContext } from "../../contexts/NoteContext";
import { useMaxHeight } from "../../hooks/useMaxHeight";
import Sidebar from "../../components/Sidebar";

export default function EditorPage() {
  const { title, updateNoteTitle } = useNoteContext();
  const [present, dismiss] = useIonModal(SearchModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });
  const sidebarMenuRef = useRef<HTMLIonMenuElement | null>(null);

  const maxHeight = useMaxHeight();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    if (scrollHostRef.current) {
      scrollHostRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <NotesListPage contentId="main-content" />
      <Sidebar ref={sidebarMenuRef} />
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
            <IonTitle onClick={scrollToTop} style={{ cursor: "pointer" }}>
              {title}
            </IonTitle>
            <IonButtons slot="primary">
              <IonMenuToggle menu="sidebarMenu">
                <IonButton>
                  <IonIcon
                    className="text-gray-300"
                    slot="icon-only"
                    size="small"
                    icon={ellipsisVertical}
                  ></IonIcon>
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
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
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <Editor />
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
