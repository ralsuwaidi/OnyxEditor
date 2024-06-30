import Highlight from "@tiptap/extension-highlight";

// 2. Overwrite the keyboard shortcuts
const CustomHighlight = Highlight.extend({
  addKeyboardShortcuts() {
    return {
      "=": ({ editor }) => {
        const { from, to } = editor.state.selection;

        const selectedText = editor.state.doc.textBetween(from, to, " ");
        const textBefore = editor.state.doc.textBetween(from - 1, from, " ");
        const textAfter = editor.state.doc.textBetween(to, to + 1, " ");

        if (textBefore === "=" && textAfter === "=") {
          editor
            .chain()
            .focus()
            .deleteRange({ from: from - 1, to: from })
            .deleteRange({ from: to - 1, to: to })
            .setTextSelection({ from: from - 1, to: to - 1 })
            .setHighlight()
            .run();
        } else {
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
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight(),
      Space: ({ editor }) => {
        const { from, to } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(from - 1, from, " ");
        const isHighlighted = editor.isActive("highlight"); // Check if the current text is highlighted

        if (textBefore === " " && isHighlighted) {
          editor
            .chain()
            .focus()
            .deleteRange({ from: from - 1, to }) // Adjusted to delete the range including the two spaces
            .unsetHighlight()
            .insertContent(" ")
            .setTextSelection(from + 1) // Adjusted to correctly position the cursor after the new space
            .run();
          return true;
        }
        return false;
      },
    };
  },
});

export default CustomHighlight;
