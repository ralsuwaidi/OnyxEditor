// useEditorPageLogic.ts
import { useEffect, useRef, useState } from "react";
import { useKeyboardState } from "@ionic/react-hooks/keyboard";
import { useMaxHeight } from "./useMaxHeight";
import useDocumentStore from "../contexts/useDocumentStore";
import useEditorStore from "../contexts/useEditorStore";

export const useEditorPageLogic = () => {
  const currentNote = useDocumentStore((state) => state.selectedDocument);
  const loading = useDocumentStore((state) => state.isLoading);
  const editor = useEditorStore((state) => state.editor);
  const [title, setTitle] = useState(currentNote?.title || "");
  const sidebarMenuRef = useRef<HTMLIonMenuElement | null>(null);
  const maxHeight = useMaxHeight();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    scrollHostRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
    scrollToTop,
  };
};
