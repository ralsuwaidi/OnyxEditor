import React, { useState } from "react";
import { IonHeader, IonToolbar } from "@ionic/react";
import "./NotesListHeader.css";
import TitleToolbar from "./TitleToolbar";
import ViewSwitcherPopover from "./ViewSwitcherPopover";
import SearchToolbar from "./SearchToolbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Collapse in={calendarOpen}>
          <IonToolbar>
            <DatePicker />
          </IonToolbar>
        </Collapse>
      </LocalizationProvider>
    </IonHeader>
  );
};

export default NotesListHeader;
