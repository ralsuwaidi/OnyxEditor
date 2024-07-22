import { NoteMetadataType } from "../../types/note.types";

const countTagOccurrences = (notes: NoteMetadataType[]) => {
  const tagCounts: { [key: string]: number } = {};
  notes.forEach((note) => {
    if (Array.isArray(note.metadata?.tags)) {
      note.metadata.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
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
