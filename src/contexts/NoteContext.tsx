import React, { createContext, useContext, useState, ReactNode } from "react";

interface NoteContextProps {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <NoteContext.Provider value={{ selectedNoteId, setSelectedNoteId }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = (): NoteContextProps => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
