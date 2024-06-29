import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { marked } from "marked";
import { Clipboard } from "@capacitor/clipboard";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

const MarkdownPaste = Extension.create({
  name: "markdownPaste",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste(view: EditorView, event: ClipboardEvent): boolean {
            event.preventDefault();
            handleMarkdownPaste(view);
            return true;
          },
        },
      }),
    ];
  },
});

async function handleMarkdownPaste(view: EditorView) {
  try {
    // Get the clipboard data using Capacitor Clipboard plugin
    const { value: pastedText } = await Clipboard.read();

    if (pastedText) {
      // Parse the markdown content to HTML
      const html = await (typeof marked(pastedText) === "string"
        ? marked(pastedText)
        : marked(pastedText));

      // Use the editor's schema to convert HTML to a document node
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(html, "text/html");
      const fragment = ProseMirrorDOMParser.fromSchema(
        view.state.schema
      ).parseSlice(parsedHtml.body);

      // Apply the parsed content to the editor
      const transaction = view.state.tr.replaceSelection(fragment);
      view.dispatch(transaction);
    }
  } catch (error) {
    console.error("Failed to read from clipboard or parse markdown", error);
  }
}

export default MarkdownPaste;
