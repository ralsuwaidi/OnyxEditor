import { Extension, KeyboardShortcutCommand } from "@tiptap/core";
import { Editor } from "@tiptap/core";

const handleEnclosingCharacters = (editor: Editor, char: string) => {
  const { from, to } = editor.state.selection;

  if (from === to) {
    // If there is no selection, just add the character
    return editor.chain().focus().insertContent(char).run();
  }
  editor
    .chain()
    .focus()
    .toggleCode()
    .setTextSelection({ from: from, to: to })
    .run();
};

const CodeEnclosing = Extension.create({
  name: "codeEnclosing",

  addKeyboardShortcuts() {
    return {
      "=": ({ editor }: { editor: Editor }) => {
        handleEnclosingCharacters(editor, "=");
        return true;
      },
      "`": ({ editor }: { editor: Editor }) => {
        handleEnclosingCharacters(editor, "`");
        return true;
      },
    } as Record<string, KeyboardShortcutCommand>;
  },
});

export default CodeEnclosing;
