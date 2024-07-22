// hooks/useNotesList.ts
import { useState } from "react";

export function useNotesList() {
  const [showToast, setShowToast] = useState<string | null>(null);

  return {
    showToast,
    setShowToast,
  };
}
