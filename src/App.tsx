// import "./App.css";

import { IonApp, setupIonicReact } from "@ionic/react";

import EditorPage from "./pages/EditorPage/EditorPage";
import { useEffect } from "react";
import useNoteStore from "./contexts/noteStore";
import { useKeyboardSetup } from "./hooks/useKeyboardSetup";

setupIonicReact();

function App() {
  const initializeStore = useNoteStore((state) => state.initializeStore);
  const currentNote = useNoteStore((state) => state.currentNote);

  useKeyboardSetup();

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
