import { Documents } from "../../types/document.types";

const countTagOccurrences = (documents: Documents[]) => {
  const tagCounts: { [key: string]: number } = {};
  documents.forEach((document) => {
    // Ensure tags is an array
    if (Array.isArray(document.tags)) {
      document.tags.forEach((tag) => {
        if (tag) {
          // Ensure the tag is not empty
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    }
  });
  return tagCounts;
};

const sortTagsByFrequency = (tagCounts: { [key: string]: number }) => {
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
};

const moveSelectedTagsToFront = (
  sortedTags: string[],
  selectedTags: string[]
) => {
  const selectedTagSet = new Set(selectedTags);
  return [
    ...selectedTags,
    ...sortedTags.filter((tag) => !selectedTagSet.has(tag)),
  ];
};

export { countTagOccurrences, sortTagsByFrequency, moveSelectedTagsToFront };
