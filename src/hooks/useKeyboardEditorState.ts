import { useEffect, useState } from "react";
import { EditorState as KeyboardEditorStateType } from "../types/KeyboardToolbarType";
import { Editor } from "@tiptap/react";

export const useKeyboardEditorState = (
  editor: Editor | null
): KeyboardEditorStateType => {
  const [state, setState] = useState<KeyboardEditorStateType>({
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
        ) as KeyboardEditorStateType["currentHeaderLevel"],
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
