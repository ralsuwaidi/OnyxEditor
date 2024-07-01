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
  IonMenu,
  IonMenuToggle,
  IonRefresher,
  // IonAlert,
  useIonAlert,
  // IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import Editor from "../../components/Editor";
import { useEffect, useState } from "react";
import { chevronBack, ellipsisVertical } from "ionicons/icons";

export default function EditorPage() {
  const [maxHeight, setMaxHeight] = useState("calc(100vh - 100px)");
  const [title, setTitle] = useState("Header");
  const [presentAlert] = useIonAlert();

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

  function handleAlert(event: CustomEvent<RefresherEventDetail>) {
    presentAlert({
      header: "Alert",
      subHeader: "Pull Action",
      message: "You pulled to refresh!",
      buttons: ["OK"],
    });
    event.detail.complete();
  }

  return (
    <>
      <IonMenu contentId="main-content" type="push">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          This is the menu content.
        </IonContent>
      </IonMenu>
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
              onIonRefresh={handleAlert}
            ></IonRefresher>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonInput
                  className="ml-3 text-3xl font-extrabold"
                  value={title}
                  placeholder="Enter Title"
                  onIonChange={(e) => setTitle(e.detail.value!)}
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
