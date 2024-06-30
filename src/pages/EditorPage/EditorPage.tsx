import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
} from "@ionic/react";
import Editor from "../../components/Editor";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const [maxHeight, setMaxHeight] = useState("calc(100vh - 100px)");
  const [title, setTitle] = useState("Header");

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
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} fullscreen={false}>
        <div
          className="ion-content-scroll-host  overflow-auto overscroll-contain"
          style={{ maxHeight }}
        >
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
  );
}
