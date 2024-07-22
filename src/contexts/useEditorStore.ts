import { create } from "zustand";
import { Editor } from "@tiptap/react";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";

interface EditorStore {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  tableOfContents: TableOfContentData | [];
  setTableOfContents: (tableOfContents: TableOfContentData) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
  tableOfContents: [],
  setTableOfContents: (tableOfContents) => set({ tableOfContents }),
}));

export default useEditorStore;
