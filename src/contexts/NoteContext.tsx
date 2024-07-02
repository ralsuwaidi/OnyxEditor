import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import FirestoreService from "../services/FirestoreService";

export interface NoteContextProps {
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  updateNoteTitle: (title: string) => void;
  loading: boolean;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState<string>("Header");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeNote = async () => {
      setLoading(true);
      const latestNote = await FirestoreService.getLatestNote();
      if (latestNote) {
        setSelectedNoteId(latestNote.id);
        setTitle(latestNote.title);
      }
      setLoading(false);
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
        loading,
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
