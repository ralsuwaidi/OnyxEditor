import { useEditor, EditorContent } from "@tiptap/react";
import { useKeyboardSetup } from "../hooks/useKeyboardSetup";
import BulletList from "@tiptap/extension-bullet-list";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Focus from "@tiptap/extension-focus";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import { saveEditorContent } from "../libs/editorPreferences";
import Typography from "@tiptap/extension-typography";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import LinkExtension from "../extensions/Link";
import CodeEnclosing from "../extensions/CodeEnclosing";
import TaskList from "@tiptap/extension-task-list";
import CodeBlock from "@tiptap/extension-code-block";
import TaskItem from "@tiptap/extension-task-item";
import MarkdownPaste from "../extensions/MarkdownPaste";
import { useLoadEditorContent } from "../hooks/useLoadEditorContent";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";
import { useSetLink } from "../hooks/useSetLink";
import CustomHighlight from "../extensions/highlight";

const extensions = [
  Paragraph,
  Document,
  Text,
  Bold,
  Code,
  CodeBlock,
  Italic,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "What's the title?";
      }

      return "Can you add some further context?";
    },
  }),
  ListItem,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Typography,
  Strike,
  Image,
  Underline,
  Focus,
  HorizontalRule,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  Dropcursor,
  OrderedList,
  TableCell,
  HardBreak,
  Heading.configure({
    levels: [1, 2, 3, 4, 5],
  }),

  // custom
  // BulletListExtension,
  // HighlightMark,
  CustomHighlight.configure({
    HTMLAttributes: {
      class: "dark:bg-highlight-dark bg-highlight p-1 rounded",
    },
  }),
  BulletList,
  MarkdownPaste,
  LinkExtension.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
  }),
  CodeEnclosing,
];

const content = `
Test
`;

const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose p-4 lg:prose-lg xl:prose-2xl focus:outline-none pb-80",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      saveEditorContent(JSON.stringify(json));
    },
  });

  useKeyboardSetup();

  useLoadEditorContent(editor);

  const setLink = useSetLink(editor);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <BubbleMenu editor={editor} setLink={setLink} />}
      {editor && <FloatingMenu editor={editor} />}
    </>
  );
};

export default Editor;
