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
import SearchRefresher from "../../components/SearchRefresher";
import { useEditorPageLogic } from "../../hooks/useEditorPageLogic";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoteTitle from "../../components/NoteTitle";
import EditorWrapper from "../../components/EditorWrapper";
import useDocumentStore from "../../contexts/useDocumentStore";

const EditorPage: React.FC = () => {
  const {
    loading,
    isKeyboardVisible,
    maxHeight,
    contentRef,
    scrollHostRef,
    sidebarMenuRef,
    scrollToTop,
    openSearchModal,
  } = useEditorPageLogic();
  const { selectedDocument, updateDocument } = useDocumentStore();

  if (!selectedDocument) {
    return <LoadingSpinner />;
  }

  const handleDocumentTitle = (newTitle: string) => {
    if (selectedDocument) {
      updateDocument(selectedDocument.id, { title: newTitle });
    }
  };

  return (
    <>
      <NotesListPage contentId="main-content" />
      <Sidebar ref={sidebarMenuRef} />
      <IonPage id="main-content">
        {isPlatform("desktop") ? (
          <DesktopHeader />
        ) : (
          <MobileEditorHeader loading={loading} scrollToTop={scrollToTop} />
        )}

        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <SearchRefresher onRefresh={openSearchModal} />
            <NoteTitle
              title={selectedDocument.title || ""}
              onChange={handleDocumentTitle}
              isDesktop={isPlatform("desktop")}
            />
            <EditorWrapper>
              <Editor />
            </EditorWrapper>
          </div>
        </IonContent>

        {isKeyboardVisible && isPlatform("ios") && <KeyboardToolbar />}
        <LoadingModal isOpen={loading} />
      </IonPage>
    </>
  );
};

export default EditorPage;
