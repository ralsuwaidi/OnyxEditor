// hooks/useUpdateDocument.ts
import { useState, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import useDocumentStore from "../contexts/useDocumentStore";
import { Documents } from "../types/document.types";

export const useUpdateDocument = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const documents = useDocumentStore((state) => state.documents);

  const updateDocument = useCallback(
    async (id: string, updates: Partial<Omit<Documents, "id">>) => {
      setIsUpdating(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("documents")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const updatedDocuments = documents.map((doc: Documents) =>
            doc.id === id ? { ...doc, ...data } : doc
          );
          setDocuments(updatedDocuments);
        }

        return data as Documents;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [setDocuments, documents]
  );

  return {
    updateDocument,
    isUpdating,
    error,
  };
};
