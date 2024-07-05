import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from "@tiptap/core";

export interface TagsOptions {
  /**
   * HTML attributes to add to the tags element.
   * @default {}
   * @example { class: 'tags' }
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tags: {
      /**
       * Set a tags mark
       */
      setTags: () => ReturnType;
      /**
       * Toggle a tags mark
       */
      toggleTags: () => ReturnType;
      /**
       * Unset a tags mark
       */
      unsetTags: () => ReturnType;
    };
  }
}

/**
 * Matches tags text via `#` as input.
 */
const tagsInputRegex = /(?:^|\s)(#[^\s#]+\s|$)$/;

/**
 * Matches tags text via `#` while pasting.
 */
const tagsPasteRegex = /(?:^|\s)(#(\w+))(?=\s|$)/g;

/**
 * This extension allows you to mark text as tags.
 * @see https://tiptap.dev/api/marks/mark
 */
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
          "inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/20",
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
});
