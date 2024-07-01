import { Link as TiptapLink } from "@tiptap/extension-link";
import { markInputRule } from "@tiptap/core";

const linkInputRegex = /(?<!!)\[(.*?)\]\((.*?)\)$/;

const LinkExtension = TiptapLink.extend({
  addInputRules() {
    return [
      markInputRule({
        find: linkInputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, text, href] = match;
          return { href, text };
        },
      }),
    ];
  },
});

export default LinkExtension;
