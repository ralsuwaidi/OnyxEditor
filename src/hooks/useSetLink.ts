import { useCallback } from "react";
import { Editor } from "@tiptap/react";

export const useSetLink = (editor: Editor | null) => {
  const setLink = useCallback((): void => {
    const url = prompt("Enter the URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return setLink;
};
