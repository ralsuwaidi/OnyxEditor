import { Extension } from "@tiptap/core";

const HighlightExtension = Extension.create({
  name: "customEqualKey",

  addKeyboardShortcuts() {
    return {
      "=": ({ editor }) => {
        const { from, to } = editor.state.selection;

        if (from === to) {
          // If there is no selection, just add an equal sign
          return editor.chain().focus().insertContent("=").run();
        }

        const selectedText = editor.state.doc.textBetween(from, to, " ");
        const textBefore = editor.state.doc.textBetween(from - 1, from, " ");
        const textAfter = editor.state.doc.textBetween(to, to + 1, " ");

        if (textBefore === "=" && textAfter === "=") {
          // If text is already wrapped with equal signs, remove them and apply highlight
          editor
            .chain()
            .focus()
            .deleteRange({ from: from - 1, to: from })
            .deleteRange({ from: to - 1, to: to })
            .setTextSelection({ from: from - 1, to: to - 1 })
            .setHighlight()
            .run();
        } else {
          // Otherwise, add equal signs
          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContentAt(from, `=${selectedText}=`)
            .setTextSelection({ from: from + 1, to: to + 1 })
            .run();
        }

        return true;
      },
    };
  },
});

export { HighlightExtension as CustomEqualKeyExtension };
