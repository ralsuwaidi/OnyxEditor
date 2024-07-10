import { Node, mergeAttributes } from "@tiptap/core";
import markdownitContainer from "markdown-it-container";

interface ContainerOptions {
  classes: { [key: string]: string };
}

export default Node.create<ContainerOptions>({
  name: "container",

  group: "block",

  content: "block+",

  defining: true,

  addOptions() {
    return {
      classes: {
        info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4",
        warning:
          "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4",
        danger: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4",
      },
    };
  },

  addStorage() {
    return {
      markdown: {
        serialize: (state: any, node: any) => {
          state.write("::: " + (node.attrs.containerClass || "") + "\n");
          state.renderContent(node);
          state.flushClose(1);
          state.write(":::");
          state.closeBlock(node);
        },
        parse: {
          setup: (markdownit: any) => {
            Object.keys(this.options.classes).forEach((className) => {
              markdownit.use(markdownitContainer, className);
            });
          },
        },
      },
    };
  },

  addAttributes() {
    return {
      containerClass: {
        default: null,
        parseHTML: (element) =>
          [...element.classList].find((className) =>
            Object.keys(this.options.classes).includes(className)
          ),
        renderHTML: (attributes) => ({
          class:
            this.options.classes[attributes.containerClass] ||
            attributes.containerClass,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (element) => {
          return [...element.classList].find((className) =>
            Object.keys(this.options.classes).includes(className)
          )
            ? null
            : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
});
