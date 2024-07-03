import { useContext } from "react";
import NoteContext, { NoteContextProps } from "../contexts/NoteContext";

export const useNoteContext = (): NoteContextProps => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
