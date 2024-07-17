import { IonChip, IonSearchbar, IonToolbar } from "@ionic/react";

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
        <div className="flex w-full overflow-x-scroll no-scrollbar space-x-2">
          {sortedUniqueTags.map((tag) => (
            <IonChip
              key={tag}
              className={`text-xs py-1 px-2 flex-shrink-0 ${
                selectedTags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleChipSelect(tag)}
            >
              {tag}
            </IonChip>
          ))}
        </div>
      </div>
    )}
  </IonToolbar>
);

export default SearchToolbar;
