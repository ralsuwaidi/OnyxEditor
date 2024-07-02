// import "./App.css";

import { IonApp, setupIonicReact } from "@ionic/react";

import EditorPage from "./pages/EditorPage/EditorPage";
import { NoteProvider } from "./contexts/NoteContext";

setupIonicReact();

function App() {
  return (
    <>
      <IonApp>
        <NoteProvider>
          <EditorPage />
        </NoteProvider>
      </IonApp>
    </>
  );
}

export default App;
