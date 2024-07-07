// import "./App.css";

import { IonApp, setupIonicReact } from "@ionic/react";

import EditorPage from "./pages/EditorPage/EditorPage";
import { useEffect } from "react";
import useNoteStore from "./contexts/noteStore";

setupIonicReact();

function App() {
  const initializeStore = useNoteStore((state) => state.initializeStore);
  const currentNote = useNoteStore((state) => state.currentNote);

  useEffect(() => {
    if (!currentNote) {
      initializeStore();
    }
  }, [initializeStore]);

  return (
    <>
      <IonApp>
        <EditorPage />
      </IonApp>
    </>
  );
}

export default App;
