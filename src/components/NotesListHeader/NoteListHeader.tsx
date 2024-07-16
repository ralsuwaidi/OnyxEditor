import React, { useState, useMemo } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonChip,
} from "@ionic/react";
import "./NotesListHeader.css";
import { add, chevronDownOutline } from "ionicons/icons";
import { NoteMetadataType } from "../../types/NoteType";

interface NotesListHeaderProps {
  handleCreateNewNote: (type: "note" | "journal") => void;
  handleInput: (ev: CustomEvent) => void;
  currentView: "note" | "journal";
  switchView: (view: "note" | "journal") => void;
  allNotes: NoteMetadataType[];
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  handleCreateNewNote,
  handleInput,
  currentView,
  switchView,
  allNotes,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleViewSwitch = (view: "note" | "journal") => {
    switchView(view);
    setPopoverOpen(false);
  };

  const handleChipSelect = (selectedTag: string) => {
    let updatedTags;
    if (selectedTags.includes(selectedTag)) {
      updatedTags = selectedTags.filter((tag) => tag !== selectedTag);
    } else {
      updatedTags = [...selectedTags, selectedTag];
    }
    setSelectedTags(updatedTags);

    // Create a custom event with the updated tags
    const customEvent = new CustomEvent("input", {
      detail: { value: updatedTags.join(" ") },
    });
    Object.defineProperty(customEvent, "target", {
      writable: true,
      value: { value: updatedTags.join(" ") },
    });

    handleInput(customEvent);
  };

  const sortedUniqueTags = useMemo(() => {
    // Count occurrences of each tag
    const tagCounts: { [key: string]: number } = {};
    allNotes.forEach((note) => {
      if (Array.isArray(note.metadata?.tags)) {
        note.metadata.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Create an array of unique tags sorted by frequency
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    // Move selected tags to the start of the list
    const selectedTagSet = new Set(selectedTags);
    const sortedTagsWithSelectedFirst = [
      ...selectedTags,
      ...sortedTags.filter((tag) => !selectedTagSet.has(tag)),
    ];

    return sortedTagsWithSelectedFirst;
  }, [allNotes, selectedTags]);

  const stopPropagation = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <IonButton
            className="notes-list-title-btn font-semibold"
            fill="clear"
            id="notes-list-title-popover"
            onClick={() => setPopoverOpen(true)}
          >
            {currentView === "note" ? "Notes" : "Journal"}
            <IonIcon
              size="small"
              icon={chevronDownOutline}
              style={{ marginLeft: "4px" }}
            />
          </IonButton>
        </IonTitle>

        <IonPopover
          isOpen={popoverOpen}
          onDidDismiss={() => setPopoverOpen(false)}
          trigger="notes-list-title-popover"
          dismissOnSelect={true}
        >
          <IonContent>
            <IonList>
              {currentView === "note" ? (
                <>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => handleViewSwitch("journal")}
                  >
                    Journal
                  </IonItem>
                </>
              ) : (
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => handleViewSwitch("note")}
                >
                  Notes
                </IonItem>
              )}
            </IonList>
          </IonContent>
        </IonPopover>

        <IonButtons slot="end">
          <IonButton onClick={() => handleCreateNewNote(currentView)}>
            <IonIcon icon={add} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar
          debounce={500}
          onIonInput={(e) => handleInput(e as CustomEvent)}
          placeholder={
            currentView === "note" ? "Search Note" : "Search Journal"
          }
        ></IonSearchbar>
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
                  className={`border flex-shrink-0 ${
                    selectedTags.includes(tag)
                      ? "border-transparent"
                      : "border-gray-400"
                  }`}
                  outline={!selectedTags.includes(tag)}
                  onClick={() => handleChipSelect(tag)}
                >
                  {tag}
                </IonChip>
              ))}
            </div>
          </div>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default NotesListHeader;
