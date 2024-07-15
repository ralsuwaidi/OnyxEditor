// types.ts
import { Editor } from "@tiptap/core";
import { IconProps } from "@phosphor-icons/react";

export type Level = 1 | 2 | 3 | 4;

export interface EditorState {
  canUndo: boolean;
  canRedo: boolean;
  canIndent: boolean;
  canOutdent: boolean;
  isListItemOrTaskItem: boolean;
  isTextSelected: boolean;
  currentHeaderLevel: Level | null;
  isHeader: boolean;
}

export interface ToolbarIcon {
  name: string;
  icon: React.ForwardRefExoticComponent<IconProps>;
  action: (editor: Editor) => void;
  isDisabled?: (state: EditorState) => boolean;
  isActive?: (state: EditorState) => boolean;
  isVisible?: (state: EditorState) => boolean; // New property
}
