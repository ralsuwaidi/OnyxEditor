import Code from "@tiptap/extension-code";

// 2. Overwrite the keyboard shortcuts
const CustomCode = Code.extend({
  addKeyboardShortcuts() {
    return {
      "`": ({ editor }) => {
        const { from, to, empty } = editor.state.selection;

        if (empty) {
          const { from } = editor.state.selection;
          const text = editor.state.doc.textBetween(
            0,
            editor.state.doc.content.size,
            " "
          );
          const startBacktick = text.lastIndexOf("`", from);

          if (startBacktick !== -1) {
            return editor
              .chain()
              .focus()
              .deleteRange({ from: startBacktick + 2, to: startBacktick + 3 })
              .setTextSelection({ from: startBacktick + 2, to: from })
              .toggleCode()
              .setTextSelection({ from: to, to: to })
              .toggleCode()
              .insertContent(" ")
              .run();
          }

          return editor.chain().focus().insertContent("`").run();
        }

        editor
          .chain()
          .focus()
          .toggleCode()
          .setTextSelection({ from: from, to: to })
          .run();

        return true;
      },
    };
  },
});

export default CustomCode;
