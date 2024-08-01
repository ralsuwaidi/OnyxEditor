// EditorPage.tsx
import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import EditorMobileHeader from "../../components/mobile/EditorMobileHeader";
import Editor from "../../components/mobile/Editor";
import NotesListPage from "./NotesListPage";
import KeyboardToolbar from "../../components/mobile/KeyboardToolbar/KeyboardToolbar";
import LoadingModal from "../../components/mobile/LoadingModal";
import { useEditorPageLogic } from "../../hooks/useEditorPageLogic";
import LoadingSpinner from "../../components/mobile/LoadingSpinner";
import NoteTitle from "../../components/mobile/NoteTitle";
import EditorWrapper from "../../components/mobile/EditorWrapper";
import useDocumentStore from "../../contexts/useDocumentStore";
import QuickActionModal from "../../components/mobile/QuickNoteModal";

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
