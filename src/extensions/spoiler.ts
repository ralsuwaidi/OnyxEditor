import { Mark, mergeAttributes, markInputRule } from "@tiptap/core";
import { spoiler } from "@mdit/plugin-spoiler";

const Spoiler = Mark.create({
  name: "spoiler",
});

export default Spoiler.extend({
  /**
   * @return {{markdown: MarkdownMarkSpec}}
   */

  addOptions() {
    return {
      HTMLAttributes: {
        class:
          "bg-current rounded-custom transition-colors duration-500 ease-in-out cursor-help hover:bg-transparent focus:bg-transparent",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.spoiler",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addInputRules() {
    return [
      markInputRule({
        find: /!!([^!!]+)!!$/,
        type: this.type,
      }),
    ];
  },

  addStorage() {
    return {
      markdown: {
        serialize: { open: "!!", close: "!!", expelEnclosingWhitespace: true },
        parse: {
          setup(markdownit: any) {
            markdownit.use(spoiler);
          },
          updateDOM(element: any) {
            console.log(element);
          },
        },
      },
    };
  },
});
