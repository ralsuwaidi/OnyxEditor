// KeyboardToolbar.tsx
import React, { useEffect, useState } from "react";
import useNoteStore from "../../contexts/noteStore";
import { Editor } from "@tiptap/core";
import { toolbarIcons } from "./toolbarIcons";
import { EditorState, ToolbarIcon } from "../../types/KeyboardToolbarType";

const useEditorState = (editor: Editor | null): EditorState => {
  const [state, setState] = useState<EditorState>({
    canUndo: false,
    canRedo: false,
    canIndent: false,
    canOutdent: false,
    isListItemOrTaskItem: false,
    isTextSelected: false,
    currentHeaderLevel: null,
    isHeader: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      setState({
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        canIndent:
          editor.can().sinkListItem("listItem") ||
          editor.can().sinkListItem("taskItem"),
        canOutdent:
          editor.can().liftListItem("listItem") ||
          editor.can().liftListItem("taskItem"),
        isListItemOrTaskItem:
          editor.isActive("listItem") || editor.isActive("taskItem"),
        isTextSelected: editor.state.selection.empty === false,
        currentHeaderLevel: [1, 2, 3, 4].find((level) =>
          editor.isActive("heading", { level })
        ) as EditorState["currentHeaderLevel"],
        isHeader: [1, 2, 3, 4].some((level) =>
          editor.isActive("heading", { level })
        ),
      });
    };

    updateToolbar();
    editor.on("update", updateToolbar);
    editor.on("selectionUpdate", updateToolbar);

    return () => {
      editor.off("update", updateToolbar);
      editor.off("selectionUpdate", updateToolbar);
    };
  }, [editor]);

  return state;
};

interface ToolbarButtonProps {
  icon: ToolbarIcon["icon"];
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  onClick,
  disabled = false,
  isActive = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${isActive ? "text-gray-400 dark:text-gray-600" : ""} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    <Icon size={24} />
  </button>
);

const KeyboardToolbar: React.FC = () => {
  const editor = useNoteStore((state) => state.editor);
  const editorState = useEditorState(editor);

  const handleAction = (action: ToolbarIcon["action"]) => {
    if (editor && action) {
      action(editor);
    }
  };

  return (
    <div className="absolute py-2 inset-x-0 dark:bg-[#2B2B2B] bg-[#CACDD2] bottom-0 flex justify-between items-center">
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 px-4 min-w-max">
          {toolbarIcons
            .filter((icon) => icon.name !== "close")
            .map((icon) =>
              icon.isVisible ? (
                icon.isVisible(editorState) && (
                  <ToolbarButton
                    key={icon.name}
                    icon={icon.icon}
                    onClick={() => handleAction(icon.action)}
                    disabled={
                      icon.isDisabled ? icon.isDisabled(editorState) : false
                    }
                    isActive={
                      icon.isActive ? icon.isActive(editorState) : false
                    }
                  />
                )
              ) : (
                <ToolbarButton
                  key={icon.name}
                  icon={icon.icon}
                  onClick={() => handleAction(icon.action)}
                  disabled={
                    icon.isDisabled ? icon.isDisabled(editorState) : false
                  }
                  isActive={icon.isActive ? icon.isActive(editorState) : false}
                />
              )
            )}
        </div>
      </div>
      <div className="flex-shrink-0 px-4">
        <ToolbarButton
          icon={toolbarIcons.find((icon) => icon.name === "close")!.icon}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default KeyboardToolbar;
