import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from "@tiptap/core";
import markdownitHashtag from "markdown-it-hashtag";
import { PluginSimple } from "markdown-it";
import MarkdownIt from "markdown-it";

export interface TagsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tags: {
      setTags: () => ReturnType;
      toggleTags: () => ReturnType;
      unsetTags: () => ReturnType;
    };
  }
}

const tagsInputRegex = /(?:^|\s)(#[^\s#]+\s|$)$/;
const tagsPasteRegex = /(?:^|\s)(#(\w+))(?=\s|$)/g;

export const Tags = Mark.create<TagsOptions>({
  name: "tags",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-tags]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-tags": true,
        class:
          "inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-1 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/20",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTags: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleTags: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetTags: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-#": () => this.editor.commands.toggleTags(),
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: tagsInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          tag: match[1],
        }),
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: tagsPasteRegex,
        type: this.type,
      }),
    ];
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: any, mark: any) {
          state.write(`#${mark.attrs.tag} `);
          state.closeMark(mark);
        },
        parse: {
          setup(markdownit: MarkdownIt) {
            markdownit.use(markdownitHashtag as PluginSimple, {
              hashtagRegExp: "\\w+",
              preceding: "^|\\s",
            });

            markdownit.renderer.rules.hashtag_open = (tokens, idx) => {
              const tagName = tokens[idx].content.toLowerCase();
              return `<a href="/tags/${tagName}" class="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 no-underline px-1 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/20">`;
            };

            markdownit.renderer.rules.hashtag_text = (tokens, idx) => {
              return `#${tokens[idx].content}`;
            };

            markdownit.renderer.rules.hashtag_close = () => {
              return "</a>";
            };
          },
        },
      },
    };
  },
});

export default Tags;
