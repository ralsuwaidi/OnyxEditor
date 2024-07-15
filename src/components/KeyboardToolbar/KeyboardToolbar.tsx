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
  TextHOne,
  TextHTwo,
  TextHThree,
  TextHFour,
} from "@phosphor-icons/react";
import useNoteStore from "../../contexts/noteStore";
import { Level } from "@tiptap/extension-heading";

const KeyboardToolbar = () => {
  const editor = useNoteStore((state) => state.editor);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [canIndent, setCanIndent] = useState(false);
  const [canOutdent, setCanOutdent] = useState(false);
  const [isListItemOrTaskItem, setIsListItemOrTaskItem] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [currentHeaderLevel, setCurrentHeaderLevel] = useState<Level | null>(
    null
  );
  const [isHeader, setIsHeader] = useState(false);

  useEffect(() => {
    if (editor) {
      const updateToolbar = () => {
        setCanUndo(editor.can().undo());
        setCanRedo(editor.can().redo());
        setCanIndent(
          editor.can().sinkListItem("listItem") ||
            editor.can().sinkListItem("taskItem")
        );
        setCanOutdent(
          editor.can().liftListItem("listItem") ||
            editor.can().liftListItem("taskItem")
        );
        setIsListItemOrTaskItem(
          editor.isActive("listItem") || editor.isActive("taskItem")
        );
        setIsTextSelected(editor.state.selection.empty === false);

        // Check for header level
        const levels: Level[] = [1, 2, 3, 4];
        let foundHeader = false;
        for (const level of levels) {
          if (editor.isActive("heading", { level })) {
            setCurrentHeaderLevel(level);
            foundHeader = true;
          }
        }
        setIsHeader(foundHeader);
        if (!foundHeader) {
          setCurrentHeaderLevel(null);
        }
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
      editor.chain().focus().sinkListItem("listItem").run() ||
        editor.chain().focus().sinkListItem("taskItem").run();
    }
  };

  const handleOutdent = () => {
    if (editor) {
      editor.chain().focus().liftListItem("listItem").run() ||
        editor.chain().focus().liftListItem("taskItem").run();
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

  const handleHeader = (level: Level) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="absolute inset-x-0 dark:bg-[#2B2B2B] bg-[#CACDD2] bottom-0 flex justify-between items-center">
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 py-2 px-4 min-w-max">
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
          {isListItemOrTaskItem && (
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
          {isHeader &&
            [1, 2, 3, 4].map((level) => (
              <button
                key={level}
                onClick={() => handleHeader(level as Level)}
                className={`${
                  currentHeaderLevel === level
                    ? "text-gray-400 dark:text-gray-600"
                    : ""
                }`}
              >
                {level === 1 && <TextHOne size={24} />}
                {level === 2 && <TextHTwo size={24} />}
                {level === 3 && <TextHThree size={24} />}
                {level === 4 && <TextHFour size={24} />}
              </button>
            ))}
        </div>
      </div>
      <div className="flex-shrink-0 py-2 px-4">
        <X size={24} />
      </div>
    </div>
  );
};

export default KeyboardToolbar;
