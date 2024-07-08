import { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonInput,
  IonRefresher,
  useIonModal,
  RefresherEventDetail,
  IonSpinner,
  IonMenuToggle,
} from "@ionic/react";
import Editor from "../../components/Editor";
import NotesListPage from "../NotesListPage/NotesListPage";
import SearchModal from "../../components/SearchModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMaxHeight } from "../../hooks/useMaxHeight";
import Sidebar from "../../components/Sidebar";
import useNoteStore from "../../contexts/noteStore";
import { isPlatform } from "@ionic/react";
import MobileEditorHeader from "../../components/MobileEditorHeader";

export default function EditorPage() {
  const currentNote = useNoteStore((state) => state.currentNote);
  const loading = useNoteStore((state) => state.loading);
  const updateNoteMetadata = useNoteStore((state) => state.updateNoteMetadata);
  const editor = useNoteStore((state) => state.editor);
  const [title, setTitle] = useState(currentNote?.title || "");
  const sidebarMenuRef = useRef<HTMLIonMenuElement | null>(null);
  const maxHeight = useMaxHeight();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const [present, dismiss] = useIonModal(SearchModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  function openModal(event: CustomEvent<RefresherEventDetail>) {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "confirm") {
          console.log("confirmed");
        }
        event.detail.complete();
      },
    });
  }

  useEffect(() => {
    setTitle(currentNote?.title || "");
  }, [currentNote]);

  const handleDesktopTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleTitleChange = (e: any) => {
    let newTitle;
    if (!isPlatform("desktop")) {
      newTitle = e.detail.value as string;
    } else {
      newTitle = title;
    }

    if (currentNote) {
      const updatedNote = { ...currentNote, title: newTitle };
      updateNoteMetadata(updatedNote);
      editor?.commands.focus();
    }
  };

  const scrollToTop = () => {
    if (scrollHostRef.current) {
      scrollHostRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (loading) {
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    } else {
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;

      if (modal) {
        modal.close();
      }
    }
  }, [loading]);

  if (currentNote == null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IonSpinner />
      </div>
    );
  }

  return (
    <>
      <NotesListPage contentId="main-content" />
      <Sidebar ref={sidebarMenuRef} />
      <IonPage id="main-content">
        {isPlatform("desktop") ? (
          <>
            <IonMenuToggle>
              <div className="fixed top-3 left-3 m-4 z-10">
                <button className="btn btn-square bg-gray-100 p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
            </IonMenuToggle>
          </>
        ) : (
          <MobileEditorHeader
            loading={loading}
            currentNoteTitle={currentNote?.title}
            scrollToTop={scrollToTop}
          />
        )}

        <IonContent ref={contentRef} scrollY={false} fullscreen={false}>
          <div
            ref={scrollHostRef}
            className="ion-content-scroll-host overflow-auto overscroll-contain"
            style={{ maxHeight }}
          >
            <IonRefresher
              slot="fixed"
              pullFactor={0.5}
              pullMin={100}
              pullMax={200}
              onIonRefresh={openModal}
            ></IonRefresher>
            {isPlatform("desktop") ? (
              <div className="flex justify-center mt-12">
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input w-full max-w-4xl mx-auto px-4 font-extrabold text-5xl focus:outline-none"
                  onChange={handleDesktopTitleChange}
                  value={title}
                  onBlur={handleTitleChange}
                />
              </div>
            ) : (
              <IonHeader collapse="condense">
                <IonToolbar>
                  <IonInput
                    className="ml-3 text-3xl font-extrabold"
                    value={currentNote?.title || ""}
                    placeholder="Enter Title"
                    onIonChange={handleTitleChange}
                  />
                </IonToolbar>
              </IonHeader>
            )}

            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <Editor />
              </div>
            </div>
          </div>
        </IonContent>
        <dialog id="my_modal_1" className="modal">
          <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-background">
            <IonSpinner className="text-gray-600 dark:text-gray-200" />
          </div>
        </dialog>
      </IonPage>
    </>
  );
}
