import React, { useState } from "react";
import { IonHeader } from "@ionic/react";
import "./NotesListHeader.css";
import TitleToolbar from "./TitleToolbar";
import ViewSwitcherPopover from "./ViewSwitcherPopover";
import SearchToolbar from "./SearchToolbar";
import { Collapse } from "@mui/material";
import DatePicker from "../DatePicker";

interface NotesListHeaderProps {
  currentView: "note" | "journal";
  switchView: (view: "note" | "journal") => void;
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  currentView,
  switchView,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleViewSwitch = (view: "note" | "journal") => {
    switchView(view);
    setPopoverOpen(false);
  };

  const stopPropagation = (e: React.TouchEvent) => e.stopPropagation();

  return (
    <IonHeader>
      <TitleToolbar
        currentView={currentView}
        setPopoverOpen={setPopoverOpen}
        setCalendarOpen={setCalendarOpen}
      />
      <ViewSwitcherPopover
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        currentView={currentView}
        handleViewSwitch={handleViewSwitch}
      />
      {currentView === "note" && (
        <SearchToolbar
          currentView={currentView}
          stopPropagation={stopPropagation}
        />
      )}
      {currentView === "journal" && (
        <div className="bg-[#f7f7f7] dark:bg-[--onyx-dark-color-bg]">
          <Collapse in={calendarOpen}>
            <DatePicker />
          </Collapse>
        </div>
      )}
    </IonHeader>
  );
};

export default NotesListHeader;
