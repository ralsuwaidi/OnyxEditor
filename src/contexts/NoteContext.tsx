import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import FirestoreService from "../services/FirestoreService";

interface NoteContextProps {
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  updateNoteTitle: (title: string) => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState<string>("Header");

  useEffect(() => {
    const initializeNote = async () => {
      const latestNote = await FirestoreService.getLatestNote();
      if (latestNote) {
        setSelectedNoteId(latestNote.id);
        setTitle(latestNote.title);
      }
    };
    initializeNote();
  }, []);

  const updateNoteTitle = (newTitle: string) => {
    if (selectedNoteId) {
      FirestoreService.updateNoteTitle(selectedNoteId, newTitle);
      setTitle(newTitle);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        selectedNoteId,
        setSelectedNoteId,
        title,
        setTitle,
        updateNoteTitle,
      }}
    >
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
