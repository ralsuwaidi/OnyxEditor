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

function extractTags(content: JSONContent): string[] {
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

const formatDateWithoutYear = (date: any) => {
  const inputDate = new Date(date.toDate());
  const today = new Date();
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6);

  // Check if the input date is today
  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  // Check if the input date is within the last 6 days
  if (inputDate >= sixDaysAgo && inputDate < today) {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return inputDate.toLocaleDateString(undefined, options);
  }

  // Otherwise, return the formatted date
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return inputDate.toLocaleDateString(undefined, options);
};

export { getSample, extractTags, formatDateWithoutYear };
