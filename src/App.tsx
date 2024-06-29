// import "./App.css";

import { IonApp, setupIonicReact } from "@ionic/react";

import EditorPage from "./pages/EditorPage/EditorPage";

setupIonicReact();

function App() {
  return (
    <>
      <IonApp>
        <EditorPage />
      </IonApp>
    </>
  );
}

export default App;
