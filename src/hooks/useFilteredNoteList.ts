import { useEffect, useState } from "react";
import { Documents } from "../types/document.types";
import useFilterStore from "../contexts/useFilterStore";
import useDocumentStore from "../contexts/useDocumentStore";

const useFilteredNoteList = () => {
  const { documents } = useDocumentStore();
  const { filterTags, filterText } = useFilterStore();
  const [filteredDocs, setFilteredDocs] = useState<Documents[]>([]);

  useEffect(() => {
    let sortedAndFilteredDocs = documents.filter(
      (document) => document.type === "note"
    );

    // Filter by Tags if any are selected
    if (filterTags.length > 0) {
      sortedAndFilteredDocs = sortedAndFilteredDocs.filter((document) =>
        filterTags.some((tag) => document.tags.includes(tag))
      );
    }

    // Filter by Text if filterText is not empty
    if (filterText) {
      const lowerCaseFilterText = filterText.toLowerCase();
      sortedAndFilteredDocs = sortedAndFilteredDocs.filter(
        (document) =>
          document.title!.toLowerCase().includes(lowerCaseFilterText) ||
          document.content!.toLowerCase().includes(lowerCaseFilterText)
      );
    }

    // Sort the filtered documents
    sortedAndFilteredDocs.sort((a, b) => {
      // First, sort by pinned status
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // If both are pinned or both are unpinned, sort by updated_at
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();

      return dateB - dateA;
    });

    setFilteredDocs(sortedAndFilteredDocs);
  }, [documents, filterTags, filterText]);

  return filteredDocs;
};

export default useFilteredNoteList;
