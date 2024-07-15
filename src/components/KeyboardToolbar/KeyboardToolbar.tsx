import { useEffect, useState } from "react";
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
} from "@phosphor-icons/react";
import useNoteStore from "../../contexts/noteStore";
import "./KeyboardToolbar.css";

const KeyboardToolbar = () => {
  const editor = useNoteStore((state) => state.editor);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [canIndent, setCanIndent] = useState(false);
  const [canOutdent, setCanOutdent] = useState(false);
  const [isListItem, setIsListItem] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);

  useEffect(() => {
    if (editor) {
      const updateToolbar = () => {
        setCanUndo(editor.can().undo());
        setCanRedo(editor.can().redo());
        setCanIndent(editor.can().sinkListItem("listItem"));
        setCanOutdent(editor.can().liftListItem("listItem"));
        setIsListItem(editor.isActive("listItem"));
        setIsTextSelected(editor.state.selection.empty === false);
      };

      updateToolbar();

      // Listen to editor state updates to update the button states
      editor.on("update", updateToolbar);
      editor.on("selectionUpdate", updateToolbar);

      // Clean up event listeners on unmount
      return () => {
        editor.off("update", updateToolbar);
        editor.off("selectionUpdate", updateToolbar);
      };
    }
  }, [editor]);

  const handleUndo = () => {
    if (editor) {
      editor.chain().focus().undo().run();
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.chain().focus().redo().run();
    }
  };

  const handleIndent = () => {
    if (editor) {
      editor.chain().focus().sinkListItem("listItem").run();
    }
  };

  const handleOutdent = () => {
    if (editor) {
      editor.chain().focus().liftListItem("listItem").run();
    }
  };

  const handleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const handleItalic = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  const handleHighlight = () => {
    if (editor) {
      editor.chain().focus().toggleHighlight().run();
    }
  };

  const handleLink = () => {
    if (editor) {
      const url = prompt("Enter the URL");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  return (
    <div
      className={`absolute inset-x-0 dark:bg-[#2B2B2B] bg-[#CACDD2] bottom-0 flex justify-between items-center px-4`}
    >
      <div className="flex space-x-4 py-2">
        <ArrowBendUpLeft
          className={canUndo ? "" : "text-gray-400 dark:text-gray-600"}
          onClick={handleUndo}
          size={24}
        />
        <ArrowBendUpRight
          className={canRedo ? "" : "text-gray-400 dark:text-gray-600"}
          onClick={handleRedo}
          size={24}
        />
        {isListItem && (
          <>
            <TextIndent
              className={canIndent ? "" : "text-gray-400 dark:text-gray-600"}
              onClick={handleIndent}
              size={24}
            />
            <TextOutdent
              className={canOutdent ? "" : "text-gray-400 dark:text-gray-600"}
              onClick={handleOutdent}
              size={24}
            />
          </>
        )}
        {isTextSelected && (
          <>
            <TextB onClick={handleBold} size={24} />
            <TextItalic onClick={handleItalic} size={24} />
            <Highlighter onClick={handleHighlight} size={24} />
            <Link onClick={handleLink} size={24} />
          </>
        )}
      </div>
      <div className="flex items-center justify-end space-x-4 py-2">
        <X size={24} />
      </div>
    </div>
  );
};

export default KeyboardToolbar;
