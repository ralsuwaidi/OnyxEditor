// import "./App.css";

import { IonApp, setupIonicReact } from "@ionic/react";
import EditorPage from "./pages/EditorPage/EditorPage";
import { useEffect } from "react";
import { useKeyboardSetup } from "./hooks/useKeyboardSetup";
import useDocumentStore from "./contexts/useDocumentStore";

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
        <EditorPage />
      </IonApp>
    </>
  );
}

export default App;
