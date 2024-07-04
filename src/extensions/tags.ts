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
const tagsPasteRegex = /(?:^|\s)(#[^\s#]+)(?=\s|$)/g;

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
        class: "text-blue-500 font-bold bg-blue-100 px-1 py-0.5 rounded-md",
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
