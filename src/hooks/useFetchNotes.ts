// src/hooks/useFetchNoteTitles.ts

import { useState, useEffect } from "react";
import FirestoreService from "../services/FirestoreService";
import { NoteMetadataType } from "../types/NoteType";

export const useFetchNoteTitles = () => {
  const [noteTitles, setNoteTitles] = useState<NoteMetadataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoteTitles = async () => {
      try {
        const titlesData = await FirestoreService.getNoteTitles();
        setNoteTitles(titlesData);
      } catch (error) {
        console.error("Failed to fetch note titles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteTitles();
  }, []);

  return { noteTitles, loading };
};
