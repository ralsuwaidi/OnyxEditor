import { IonApp, isPlatform, setupIonicReact } from "@ionic/react";
import { useEffect } from "react";
import EditorPage from "./pages/Mobile/EditorPage/EditorPage";
import DesktopPage from "./pages/Desktop/MainPage/MainPage";
import { useKeyboardSetup } from "./hooks/useKeyboardSetup";
import useDocumentStore from "./contexts/useDocumentStore";
import { getMostRecentDocument } from "./utils/documents";

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
    const initializeApp = async () => {
      if (!documents.length) {
        await loadDocuments();
      }
    };
    initializeApp();
  }, [loadDocuments, documents.length]);

  useEffect(() => {
    if (!selectedDocument && documents.length) {
      console.log("selecting first note");
      const firstNote = getMostRecentDocument(documents.filter((doc) => doc.type === "note"));
      if (firstNote) {
        selectDocument(firstNote.id);
      }
    }
  }, [documents, selectedDocument, selectDocument]);

  return (
    <IonApp>
      {isPlatform("desktop") ? <DesktopPage /> : <EditorPage />}
    </IonApp>
  );
}

export default App;