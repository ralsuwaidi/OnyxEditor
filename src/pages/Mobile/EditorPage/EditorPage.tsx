// EditorPage.tsx
import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import EditorMobileHeader from "./components/EditorMobileHeader";
import Editor from "./components/Editor";
import NotesListPage from "../NotesListPage/NotesListPage";
import KeyboardToolbar from "./components/KeyboardToolbar";
import LoadingModal from "../../../components/LoadingModal";
import { useEditorPageLogic } from "../../../hooks/useEditorPageLogic";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoteTitle from "./components/NoteTitle";
import EditorWrapper from "./components/EditorWrapper";
import useDocumentStore from "../../../contexts/useDocumentStore";
import QuickActionModal from "./components/QuickNoteModal";

const EditorPage: React.FC = () => {
  const {
    isKeyboardVisible,
    maxHeight,
    contentRef,
    scrollHostRef,
    scrollToTop,
  } = useEditorPageLogic();
  const { selectedDocument, isLoading } = useDocumentStore();

  if (!selectedDocument) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <NotesListPage contentId="main-content" />
      <IonPage id="main-content">
        <EditorMobileHeader loading={isLoading} scrollToTop={scrollToTop} />
        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <NoteTitle />
            <EditorWrapper>
              <Editor />
            </EditorWrapper>
          </div>
          <QuickActionModal />
        </IonContent>

        {isKeyboardVisible && <KeyboardToolbar />}
        <LoadingModal isOpen={isLoading} />
      </IonPage>
    </>
  );
};

export default EditorPage;
