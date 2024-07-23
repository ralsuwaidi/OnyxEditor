import React, { useCallback, useMemo } from "react";
import { IonSearchbar, IonToolbar } from "@ionic/react";
import useFilterStore from "../../contexts/useFilterStore";
import {
  countTagOccurrences,
  moveSelectedTagsToFront,
  sortTagsByFrequency,
} from "./utils";
import useDocumentStore from "../../contexts/useDocumentStore";

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
        <div
          className="flex overflow-x-hidden w-full mb-2"
          onTouchStart={stopPropagation}
          onTouchMove={stopPropagation}
        >
          <div className="flex w-full overflow-x-scroll no-scrollbar space-x-2 pl-3">
            {sortedUniqueTags.map((tag) => (
              <div
                key={tag}
                className={`text-xs py-0.5 px-1 flex-shrink-0 ${
                  filterTags.includes(tag)
                    ? "border rounded bg-slate-950 text-white dark:border-slate-700"
                    : "rounded bg-[#e5e5e5] dark:bg-gray-400/10 dark:text-gray-400 dark:ring-1 dark:ring-inset dark:ring-gray-400/20"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}
    </IonToolbar>
  );
};

export default SearchToolbar;
