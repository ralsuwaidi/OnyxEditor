// import "./App.css";

import { IonApp, isPlatform, setupIonicReact } from "@ionic/react";
import EditorPage from "./pages/Mobile/EditorPage/EditorPage";
import { useEffect } from "react";
import { useKeyboardSetup } from "./hooks/useKeyboardSetup";
import useDocumentStore from "./contexts/useDocumentStore";
import DesktopPage from "./pages/Desktop/DesktopPage/DesktopPage";

setupIonicReact();

function App() {
  const {
    loadDocuments,
    selectDocument,
    selectedDocument,
    documents,
  } = useDocumentStore();

  useKeyboardSetup();

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDocument == null) {
        loadDocuments();
        const firstNote = documents.find((doc) => doc.type === "note");
        if (firstNote) {
          selectDocument(firstNote.id);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDocument == null) {
        const firstNote = documents.find((doc) => doc.type === "note");
        if (firstNote) {
          selectDocument(firstNote.id);
        }
      }
    };
    fetchData();
  }, [documents]);

  return (
    <>
      <IonApp>
        {isPlatform("desktop") ? <DesktopPage /> : <EditorPage />}
      </IonApp>
    </>
  );
}

export default App;
