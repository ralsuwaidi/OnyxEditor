// KeyboardToolbar.tsx
import React from "react";
import useNoteStore from "../../contexts/noteStore";
import { toolbarIcons } from "./toolbarIcons";
import { ToolbarIcon } from "../../types/KeyboardToolbarType";
import { useKeyboardEditorState } from "../../hooks/useKeyboardEditorState";

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
  const editorState = useKeyboardEditorState(editor);

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
