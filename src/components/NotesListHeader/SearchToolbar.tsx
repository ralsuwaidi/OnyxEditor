import { IonSearchbar, IonToolbar } from "@ionic/react";

const SearchToolbar: React.FC<{
  currentView: "note" | "journal";
  handleInput: (ev: CustomEvent) => void;
  sortedUniqueTags: string[];
  selectedTags: string[];
  handleChipSelect: (tag: string) => void;
  stopPropagation: (e: React.TouchEvent) => void;
}> = ({
  currentView,
  handleInput,
  sortedUniqueTags,
  selectedTags,
  handleChipSelect,
  stopPropagation,
}) => (
  <IonToolbar>
    <IonSearchbar
      debounce={500}
      onIonInput={(e) => handleInput(e as CustomEvent)}
      placeholder={currentView === "note" ? "Search Note" : "Search Journal"}
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
                selectedTags.includes(tag)
                  ? "border rounded bg-slate-950 text-white dark:border-slate-700 "
                  : " rounded bg-[#e5e5e5] dark:bg-gray-400/10 dark:text-gray-400 dark:ring-1 dark:ring-inset dark:ring-gray-400/20"
              }`}
              onClick={() => handleChipSelect(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    )}
  </IonToolbar>
);

export default SearchToolbar;
