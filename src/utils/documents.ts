// utils.ts

import { Documents } from "../types/document.types";

export const getMostRecentDocument = (
  documents: Documents[]
): Documents | null => {
  if (!documents.length) return null;

  return documents.reduce((mostRecent, current) => {
    return new Date(current.updated_at) > new Date(mostRecent.updated_at)
      ? current
      : mostRecent;
  });
};

export const sortDocumentsByUpdatedAt = (
  documents: Documents[]
): Documents[] => {
  return documents.slice().sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA; // Descending order
  });
};
