// useEditorPageLogic.ts
import { useEffect, useRef, useState } from "react";
import { useIonModal } from "@ionic/react";
import { useKeyboardState } from "@ionic/react-hooks/keyboard";
import useNoteStore from "../contexts/noteStore";
import { useMaxHeight } from "./useMaxHeight";
import SearchNotesModal from "../components/SearchModal";

export const useEditorPageLogic = () => {
  const currentNote = useNoteStore((state) => state.currentNote);
  const loading = useNoteStore((state) => state.loading);
  const updateNoteMetadata = useNoteStore((state) => state.updateNoteMetadata);
  const editor = useNoteStore((state) => state.editor);
  const [title, setTitle] = useState(currentNote?.title || "");
  const sidebarMenuRef = useRef<HTMLIonMenuElement | null>(null);
  const maxHeight = useMaxHeight();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const [presentSearchModal, dismissSearchModal] = useIonModal(
    SearchNotesModal,
    {
      dismiss: (data: string, role: string) => dismissSearchModal(data, role),
    }
  );
  const { isOpen: isKeyboardOpen } = useKeyboardState();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (isKeyboardOpen !== undefined) {
      setIsKeyboardVisible(isKeyboardOpen);
    }
  }, [isKeyboardOpen]);

  useEffect(() => {
    setTitle(currentNote?.title || "");
  }, [currentNote]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (currentNote) {
      const updatedNote = { ...currentNote, title: newTitle };
      updateNoteMetadata(updatedNote);
      editor?.commands.focus();
    }
  };

  const scrollToTop = () => {
    scrollHostRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSearchModal = () => {
    presentSearchModal({
      onWillDismiss: (ev: CustomEvent<any>) => {
        if (ev.detail.role === "confirm") {
          console.log("confirmed");
        }
      },
    });
  };

  return {
    currentNote,
    loading,
    title,
    editor,
    isKeyboardVisible,
    maxHeight,
    contentRef,
    scrollHostRef,
    sidebarMenuRef,
    handleTitleChange,
    scrollToTop,
    openSearchModal,
  };
};