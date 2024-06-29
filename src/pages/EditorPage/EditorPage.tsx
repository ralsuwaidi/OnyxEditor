import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Editor from "../../components/Editor";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const [maxHeight, setMaxHeight] = useState("calc(100vh - 100px)");

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
  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar>
          <IonTitle>Header</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} fullscreen={false}>
        <div
          className="ion-content-scroll-host  overflow-auto overscroll-contain"
          style={{ maxHeight }}
        >
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Header</IonTitle>
            </IonToolbar>
          </IonHeader>
          <Editor />
        </div>
      </IonContent>
    </IonPage>
  );
}
