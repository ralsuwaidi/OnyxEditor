import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
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
import Focus from "@tiptap/extension-focus";
import Italic from "@tiptap/extension-italic";
import History from "@tiptap/extension-history";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";
import Strike from "@tiptap/extension-strike";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import Typography from "@tiptap/extension-typography";
import Dropcursor from "@tiptap/extension-dropcursor";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TaskList from "@tiptap/extension-task-list";
import CodeBlock from "@tiptap/extension-code-block";
import TaskItem from "@tiptap/extension-task-item";
import MarkdownPaste from "../extensions/MarkdownPaste";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";
import { useSetLink } from "../hooks/useSetLink";
import CustomHighlight from "../extensions/highlight";
import CustomCode from "../extensions/code";
import Link from "@tiptap/extension-link";
import { IonSpinner } from "@ionic/react";
import TableOfContents, {
  getHierarchicalIndexes,
} from "@tiptap-pro/extension-table-of-contents";
import { Tags } from "../extensions/tags";
import useNoteStore from "../contexts/noteStore";

const Editor = () => {
  const setEditor = useNoteStore((state) => state.setEditor);
  const setTableOfContents = useNoteStore((state) => state.setTableOfContents);
  const currentNote = useNoteStore((state) => state.currentNote);
  const updateNoteContent = useNoteStore((state) => state.updateNoteContent);

  if (currentNote == null) {
    return (
      <div className="flex items-center justify-center mt-4 ">
        <IonSpinner />
      </div>
    );
  }

  const extensions = [
    Paragraph,
    Document,
    Text,
    Bold,
    Blockquote,
    CodeBlock,
    Italic,
    ListItem,
    TaskList,
    Markdown.configure({
      transformCopiedText: true,
      linkify: true,
      tightListClass: "tight",
      transformPastedText: true,
    }),
    Tags,
    TaskItem.configure({
      nested: true,
    }),
    Typography,
    Strike,
    Image.configure({
      allowBase64: true,
      HTMLAttributes: { class: "rounded" },
    }),
    Underline,
    Focus,
    HorizontalRule,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate(content) {
        setTableOfContents(content);
      },
    }),

    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    Dropcursor,
    History.configure({
      depth: 10,
    }),
    OrderedList,
    TableCell,
    HardBreak,
    Heading.configure({
      levels: [1, 2, 3, 4, 5],
    }),
    CustomHighlight.configure({
      HTMLAttributes: {
        class:
          "dark:bg-highlight-dark bg-highlight p-1 rounded dark:text-white",
      },
    }),
    CustomCode,
    BulletList,
    MarkdownPaste,
    Link.configure({
      openOnClick: true,
      autolink: true,
      linkOnPaste: true,
    }),
  ];

  const editor = useEditor({
    extensions,
    content: currentNote.mdcontent,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-lg px-4 pt-4 xl:prose-2xl focus:outline-none pb-96 max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      updateNoteContent(currentNote.id, editor.storage.markdown.getMarkdown());
    },
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

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
