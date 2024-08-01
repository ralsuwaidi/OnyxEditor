// toolbarIcons.ts
import {
  ArrowBendUpLeft,
  ArrowBendUpRight,
  X,
  TextIndent,
  TextOutdent,
  TextB,
  TextItalic,
  Highlighter,
  Link,
  TextHOne,
  TextHTwo,
  TextHThree,
  TextHFour,
} from "@phosphor-icons/react";
import { Editor } from "@tiptap/core";
import { ToolbarIcon } from "../../../../types/KeyboardToolbarType";

export const toolbarIcons: ToolbarIcon[] = [
  {
    name: "undo",
    icon: ArrowBendUpLeft,
    action: (editor: Editor) => editor.chain().focus().undo().run(),
    isDisabled: (state) => !state.canUndo,
  },
  {
    name: "redo",
    icon: ArrowBendUpRight,
    action: (editor: Editor) => editor.chain().focus().redo().run(),
    isDisabled: (state) => !state.canRedo,
  },
  {
    name: "indent",
    icon: TextIndent,
    action: (editor: Editor) =>
      editor.chain().focus().sinkListItem("listItem").run() ||
      editor.chain().focus().sinkListItem("taskItem").run(),
    isDisabled: (state) => !state.canIndent,
    isVisible: (state) => state.isListItemOrTaskItem,
  },
  {
    name: "outdent",
    icon: TextOutdent,
    action: (editor: Editor) =>
      editor.chain().focus().liftListItem("listItem").run() ||
      editor.chain().focus().liftListItem("taskItem").run(),
    isDisabled: (state) => !state.canOutdent,
    isVisible: (state) => state.isListItemOrTaskItem,
  },
  {
    name: "bold",
    icon: TextB,
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    isVisible: (state) => state.isTextSelected,
  },
  {
    name: "italic",
    icon: TextItalic,
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    isVisible: (state) => state.isTextSelected,
  },
  {
    name: "highlight",
    icon: Highlighter,
    action: (editor: Editor) => editor.chain().focus().toggleHighlight().run(),
    isVisible: (state) => state.isTextSelected,
  },
  {
    name: "link",
    icon: Link,
    action: (editor: Editor) => {
      const url = prompt("Enter the URL");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    isVisible: (state) => state.isTextSelected,
  },
  {
    name: "h1",
    icon: TextHOne,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (state) => state.currentHeaderLevel === 1,
    isVisible: (state) => state.isHeader,
  },
  {
    name: "h2",
    icon: TextHTwo,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (state) => state.currentHeaderLevel === 2,
    isVisible: (state) => state.isHeader,
  },
  {
    name: "h3",
    icon: TextHThree,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (state) => state.currentHeaderLevel === 3,
    isVisible: (state) => state.isHeader,
  },
  {
    name: "h4",
    icon: TextHFour,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: (state) => state.currentHeaderLevel === 4,
    isVisible: (state) => state.isHeader,
  },
  {
    name: "close",
    icon: X,
    action: (editor: Editor) => editor.commands.blur(),
  },
];
