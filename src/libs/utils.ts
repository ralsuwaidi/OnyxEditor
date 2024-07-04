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

function extractTagsFromJSON(content: JSONContent): string[] {
  const tags: string[] = [];

  const extractTextAndFindTags = (nodes: any[]): void => {
    nodes.forEach((node) => {
      if (node.type === "text") {
        const tagRegex = /#(\w+)/g;
        let match;
        while ((match = tagRegex.exec(node.text)) !== null) {
          tags.push(match[1]);
        }
      } else if (node.content) {
        extractTextAndFindTags(node.content);
      }
    });
  };

  if (content.content) {
    extractTextAndFindTags(content.content);
  }

  return tags;
}

export { getSample, extractTagsFromJSON };
