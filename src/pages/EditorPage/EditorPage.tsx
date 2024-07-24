// EditorPage.tsx
import React from "react";
import { IonPage, IonContent, isPlatform } from "@ionic/react";
import DesktopHeader from "../../components/DesktopHeader";
import MobileEditorHeader from "../../components/MobileEditorHeader";
import Editor from "../../components/Editor";
import NotesListPage from "../NotesListPage/NotesListPage";
import Sidebar from "../../components/Sidebar";
import KeyboardToolbar from "../../components/KeyboardToolbar/KeyboardToolbar";
import LoadingModal from "../../components/LoadingModal";
import { useEditorPageLogic } from "../../hooks/useEditorPageLogic";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoteTitle from "../../components/NoteTitle";
import EditorWrapper from "../../components/EditorWrapper";
import useDocumentStore from "../../contexts/useDocumentStore";

const EditorPage: React.FC = () => {
  const {
    isKeyboardVisible,
    maxHeight,
    contentRef,
    scrollHostRef,
    sidebarMenuRef,
    scrollToTop,
  } = useEditorPageLogic();
  const { selectedDocument, isLoading } = useDocumentStore();

  if (!selectedDocument) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <NotesListPage contentId="main-content" />
      <Sidebar ref={sidebarMenuRef} />
      <IonPage id="main-content">
        {isPlatform("desktop") ? (
          <DesktopHeader />
        ) : (
          <MobileEditorHeader loading={isLoading} scrollToTop={scrollToTop} />
        )}

        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <NoteTitle
              title={
                selectedDocument.type == "note"
                  ? selectedDocument.title || ""
                  : new Date(selectedDocument.created_at).toLocaleDateString()
              }
              isDesktop={isPlatform("desktop")}
            />
            <EditorWrapper>
              <Editor />
            </EditorWrapper>
          </div>
        </IonContent>

        {isKeyboardVisible && isPlatform("ios") && <KeyboardToolbar />}
        <LoadingModal isOpen={isLoading} />
      </IonPage>
    </>
  );
};

export default EditorPage;
