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

const EditorPage: React.FC = () => {
  const {
    currentNote,
    loading,
    title,
    isKeyboardVisible,
    maxHeight,
    contentRef,
    scrollHostRef,
    sidebarMenuRef,
    handleTitleChange,
    scrollToTop,
    openSearchModal,
  } = useEditorPageLogic();

  if (!currentNote) {
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
          <MobileEditorHeader
            loading={loading}
            currentNoteTitle={currentNote.title}
            scrollToTop={scrollToTop}
          />
        )}

        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <SearchRefresher onRefresh={openSearchModal} />
            <NoteTitle
              title={title}
              onChange={handleTitleChange}
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
