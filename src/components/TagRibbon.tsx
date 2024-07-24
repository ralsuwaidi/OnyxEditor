import classNames from "classnames";
import React from "react";

interface TagRibbonProps {
  sortedUniqueTags: string[];
  filterTags: string[];
  handleTagClick: (tag: string) => void;
  stopPropagation: (e: React.TouchEvent) => void;
}

const TagRibbon: React.FC<TagRibbonProps> = ({
  sortedUniqueTags,
  filterTags,
  handleTagClick,
  stopPropagation,
}) => {
  return (
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
            <span
              className={classNames(
                filterTags.includes(tag) ? "" : " opacity-60"
              )}
            >
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagRibbon;
