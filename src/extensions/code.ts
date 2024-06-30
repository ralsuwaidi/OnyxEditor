import Code from "@tiptap/extension-code";

// 2. Overwrite the keyboard shortcuts
const CustomCode = Code.extend({
  addKeyboardShortcuts() {
    return {
      "`": ({ editor }) => {
        const { from, to, empty } = editor.state.selection;

        if (empty) {
          return false;
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
