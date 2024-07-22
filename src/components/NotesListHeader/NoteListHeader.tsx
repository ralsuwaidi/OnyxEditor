import React, { useState, useMemo } from "react";
import { IonHeader } from "@ionic/react";
import "./NotesListHeader.css";
import { NoteMetadataType } from "../../types/note.types";
import TitleToolbar from "./TitleToolbar";
import ViewSwitcherPopover from "./ViewSwitcherPopover";
import SearchToolbar from "./SearchToolbar";
import {
  countTagOccurrences,
  moveSelectedTagsToFront,
  sortTagsByFrequency,
} from "./utils";

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
    const updatedTags = selectedTags.includes(selectedTag)
      ? selectedTags.filter((tag) => tag !== selectedTag)
      : [...selectedTags, selectedTag];

    setSelectedTags(updatedTags);
    triggerCustomInputEvent(updatedTags);
  };

  const triggerCustomInputEvent = (tags: string[]) => {
    const customEvent = new CustomEvent("input", {
      detail: { value: tags.join(" ") },
    });
    Object.defineProperty(customEvent, "target", {
      writable: true,
      value: { value: tags.join(" ") },
    });
    handleInput(customEvent);
  };

  const sortedUniqueTags = useMemo(() => {
    const tagCounts = countTagOccurrences(allNotes);
    const sortedTags = sortTagsByFrequency(tagCounts);
    return moveSelectedTagsToFront(sortedTags, selectedTags);
  }, [allNotes, selectedTags]);

  const stopPropagation = (e: React.TouchEvent) => e.stopPropagation();

  return (
    <IonHeader>
      <TitleToolbar
        currentView={currentView}
        setPopoverOpen={setPopoverOpen}
        handleCreateNewNote={handleCreateNewNote}
      />
      <ViewSwitcherPopover
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        currentView={currentView}
        handleViewSwitch={handleViewSwitch}
      />
      <SearchToolbar
        currentView={currentView}
        handleInput={handleInput}
        sortedUniqueTags={sortedUniqueTags}
        selectedTags={selectedTags}
        handleChipSelect={handleChipSelect}
        stopPropagation={stopPropagation}
      />
    </IonHeader>
  );
};

export default NotesListHeader;
