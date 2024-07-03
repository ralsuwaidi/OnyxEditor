import { NoteMetadataType } from "../types/NoteType";

export const SortNotes = (a: NoteMetadataType, b: NoteMetadataType) => {
  // Sort pinned notes first
  if (a.metadata?.pin && !b.metadata?.pin) return -1;
  if (!a.metadata?.pin && b.metadata?.pin) return 1;

  // If both notes have the same pin status, sort by updatedAt
  return (
    new Date(b.updatedAt.toDate()).getTime() -
    new Date(a.updatedAt.toDate()).getTime()
  );
};
