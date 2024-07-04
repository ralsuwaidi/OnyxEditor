import { JSONContent } from "@tiptap/react";

function getSample(content: JSONContent): string {
  // Convert Tiptap JSON content to plain text
  const extractText = (nodes: any[]): string => {
    let text = "";
    nodes.forEach((node) => {
      if (node.type === "text") {
        text += node.text + " ";
      } else if (node.content) {
        text += extractText(node.content);
      }
    });
    return text;
  };

  // Get plain text from the JSON content
  const plainText = extractText(content.content || []);

  // Split the text into words and get the first 200 words
  const words = plainText.trim().split(/\s+/).slice(0, 30);

  // Join the first 200 words back into a string
  return words.join(" ");
}

export { getSample };
