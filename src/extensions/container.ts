import { Node, mergeAttributes } from "@tiptap/core";
import markdownitContainer from "markdown-it-container";

// Define an interface for the options that will be passed to the Node.create function
interface ContainerOptions {
  classes: { [key: string]: string };
}

// Create a new Node extension called 'container'
export default Node.create<ContainerOptions>({
  // Name of the node
  name: "container",

  // Specify the group of nodes to which this node belongs
  group: "block",

  // Define the content model for the node
  content: "block+",

  // Mark this node as defining its content
  defining: true,

  // Define the options for the node
  addOptions() {
    return {
      // Map semantic classes to Tailwind CSS classes
      classes: {
        info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4",
        warning:
          "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4",
        danger: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4",
      },
    };
  },

  // Define the storage for the node, including Markdown serialization and parsing
  addStorage() {
    return {
      markdown: {
        // Function to serialize the node to Markdown
        serialize: (state: any, node: any) => {
          state.write("::: " + (node.attrs.containerClass || "") + "\n"); // Write the opening container class
          state.renderContent(node); // Render the content inside the container
          state.flushClose(1); // Ensure proper new line handling
          state.write(":::"); // Write the closing container
          state.closeBlock(node); // Close the block
        },
        // Function to set up the Markdown-it parser
        parse: {
          setup: (markdownit: any) => {
            // Use markdown-it-container plugin for each class
            Object.keys(this.options.classes).forEach((className) => {
              markdownit.use(markdownitContainer, className);
            });
          },
        },
      },
    };
  },

  // Define the attributes for the node
  addAttributes() {
    return {
      containerClass: {
        default: null,
        // Function to parse the container class from the HTML
        parseHTML: (element) =>
          [...element.classList].find((className) =>
            Object.keys(this.options.classes).includes(className)
          ),
        // Function to render the container class as HTML
        renderHTML: (attributes) => ({
          class:
            this.options.classes[attributes.containerClass] ||
            attributes.containerClass,
        }),
      },
    };
  },

  // Define how the node is parsed from HTML
  parseHTML() {
    return [
      {
        tag: "div",
        // Function to get attributes from the HTML element
        getAttrs: (element) => {
          return [...element.classList].find((className) =>
            Object.keys(this.options.classes).includes(className)
          )
            ? null // Return null to indicate this element matches the node
            : false; // Return false to indicate this element does not match the node
        },
      },
    ];
  },

  // Define how the node is rendered to HTML
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
});
