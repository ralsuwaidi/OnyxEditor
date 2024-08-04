import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Editor as CoreEditor } from '@tiptap/core';
import { IonSpinner } from "@ionic/react";
import useDocumentStore from "../../../../contexts/useDocumentStore";
import useEditorStore from "../../../../contexts/useEditorStore";
import { extensions } from "./editorExtensions";

const Editor = () => {
  const { setEditor } = useEditorStore();
  const { selectedDocument, updateContent } = useDocumentStore();

  const onUpdate = useCallback(({ editor }: { editor: CoreEditor }) => {
    if (selectedDocument) {
      updateContent(selectedDocument.id, editor.storage.markdown.getMarkdown());
    }
  }, [selectedDocument, updateContent]);

  const editor = useEditor({
    extensions,
    content: selectedDocument?.content || '',
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-md max-w-none px-4 pt-4 pb-24 focus:outline-none",
      },
    },
    onUpdate,
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && selectedDocument) {
      editor.commands.setContent(selectedDocument.content);
    }
  }, [editor, selectedDocument]);

  if (!selectedDocument) {
    return (
      <div className="flex items-center justify-center mt-4">
        <IonSpinner />
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default Editor;