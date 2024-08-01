import React, { useCallback, useMemo } from "react";
import { IonSearchbar, IonToolbar } from "@ionic/react";
import useFilterStore from "../../../contexts/useFilterStore";
import {
  countTagOccurrences,
  moveSelectedTagsToFront,
  sortTagsByFrequency,
} from "./utils";
import useDocumentStore from "../../../contexts/useDocumentStore";
import TagRibbon from "../../mobile/TagRibbon";

const SearchToolbar: React.FC<{
  currentView: "note" | "journal";
  stopPropagation: (e: React.TouchEvent) => void;
}> = ({ currentView, stopPropagation }) => {
  const {
    setFilterText,
    toggleFilterTag,
    filterText,
    filterTags,
  } = useFilterStore();
  const { documents } = useDocumentStore();

  const sortedUniqueTags = useMemo(() => {
    const tagCounts = countTagOccurrences(documents);
    const sortedTags = sortTagsByFrequency(tagCounts);
    return moveSelectedTagsToFront(sortedTags, filterTags);
  }, [documents, filterTags]);

  const handleSearchInput = useCallback(
    (e: CustomEvent) => {
      const input = (e.target as HTMLIonSearchbarElement).value || "";
      setFilterText(input);
    },
    [setFilterText]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      toggleFilterTag(tag);
    },
    [toggleFilterTag]
  );

  return (
    <IonToolbar>
      <IonSearchbar
        debounce={500}
        onIonInput={(e) => handleSearchInput(e as CustomEvent)}
        placeholder={currentView === "note" ? "Search Note" : "Search Journal"}
        value={filterText}
      />
      {currentView === "note" && (
        <TagRibbon
          sortedUniqueTags={sortedUniqueTags}
          filterTags={filterTags}
          handleTagClick={handleTagClick}
          stopPropagation={stopPropagation}
        />
      )}
    </IonToolbar>
  );
};

export default SearchToolbar;
