// import "./App.css";
import Editor from "./Editor";
import "@ionic/react/css/core.css";

import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import { useEffect, useState } from "react";

setupIonicReact();

function App() {
  const [maxHeight, setMaxHeight] = useState("calc(100vh - 100px)");

  useEffect(() => {
    const updateMaxHeight = () => {
      const offset = 50; // Replace with your desired offset value
      setMaxHeight(`calc(100vh - ${offset}px)`);
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  return (
    <>
      <IonApp>
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
      </IonApp>
    </>
  );
}

export default App;
