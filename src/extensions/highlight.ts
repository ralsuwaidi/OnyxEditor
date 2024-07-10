import Highlight from "@tiptap/extension-highlight";
import markdownitMark from "markdown-it-mark";

// Extend the Highlight extension to add custom keyboard shortcuts and markdown parsing/serialization
const CustomHighlight = Highlight.extend({
  addKeyboardShortcuts() {
    return {
      "=": ({ editor }) => {
        const { from, to, empty } = editor.state.selection;

        const selectedText = editor.state.doc.textBetween(from, to, " ");
        const isHighlighted = editor.isActive("highlight");

        if (empty) {
          return false;
        }

        if (isHighlighted) {
          // If already highlighted, remove the highlight
          editor.chain().focus().unsetHighlight().run();
        } else {
          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContentAt(from, `==${selectedText}==`)
            .setTextSelection({ from: from, to: to })
            .run();
        }

        return true;
      },
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight(),
      Space: ({ editor }) => {
        const { from, to } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(from - 1, from, " ");
        const isHighlighted = editor.isActive("highlight");

        if (textBefore === " " && isHighlighted) {
          editor
            .chain()
            .focus()
            .deleteRange({ from: from - 1, to })
            .unsetHighlight()
            .insertContent(" ")
            .setTextSelection(from + 1)
            .run();
          return true;
        }
        return false;
      },
    };
  },

  addStorage() {
    return {
      markdown: {
        serialize: {
          open: "==",
          close: "==",
        },
        parse: {
          setup(markdownit: any) {
            markdownit.use(markdownitMark);
          },
          updateDOM(node: any) {
            if (node.tagName === "mark") {
              node.setAttribute("data-highlight", "true");
            }
            return node;
          },
        },
      },
    };
  },
});

export default CustomHighlight;
