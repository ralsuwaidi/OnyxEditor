import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from "@tiptap/core";

export interface TagOptions {
  /**
   * HTML attributes to add to the tag element.
   * @default {}
   * @example { class: 'tag' }
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tag: {
      /**
       * Set a tag mark
       */
      setTag: () => ReturnType;
      /**
       * Toggle a tag mark
       */
      toggleTag: () => ReturnType;
      /**
       * Unset a tag mark
       */
      unsetTag: () => ReturnType;
    };
  }
}

/**
 * Matches tags via `#` as input followed by a space.
 */
export const tagInputRegex = /(#\w+)\s$/;

/**
 * Matches tags via `#` while pasting followed by a space.
 */
export const tagPasteRegex = /(#\w+)\s/g;

export const Tag = Mark.create<TagOptions>({
  name: "tag",
  inline: true,
  inclusive: false,
  exitable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class:
          "tag inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 no-underline px-1 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/20",
      },
    };
  },

  addAttributes() {
    return {
      tag: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.tag",
        getAttrs: (element) => ({
          tag: element.getAttribute("data-tag"),
        }),
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

  addCommands() {
    return {
      setTag: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleTag: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetTag: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: tagInputRegex,
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
        find: tagPasteRegex,
        type: this.type,
        getAttributes: (match) => ({
          tag: match[1],
        }),
      }),
    ];
  },
});

export default Tag;
