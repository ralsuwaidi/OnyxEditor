import { supabase } from "../services/supabaseClient";
import { Documents } from "../types/document.types";
import debounce from "lodash/debounce";

export async function fetchDocuments(): Promise<Array<Documents>> {
  console.log("Fetching all documents");
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error.message);
    throw new Error(error.message);
  }

  console.log(`Fetched ${data?.length || 0} documents`);
  return data || [];
}

export async function createDocument(
  newDocument: Omit<Documents, "id">
): Promise<Documents> {
  console.log("Creating new document:", newDocument);
  const { data, error } = await supabase
    .from("documents")
    .insert([newDocument])
    .select();

  if (error) {
    console.error("Error creating document:", error.message);
    throw new Error(error.message);
  }

  console.log("Document created successfully:", data![0]);
  return data![0];
}

export async function updateDocument(
  id: string,
  updatedFields: Partial<Documents>
): Promise<Documents> {
  console.log(`Updating document ${id}:`, updatedFields);

  // Add the current timestamp to updatedFields
  const fieldsWithTimestamp = {
    ...updatedFields,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("documents")
    .update(fieldsWithTimestamp)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating document:", error.message);
    throw new Error(error.message);
  }

  console.log("Document updated successfully:", data![0]);
  return data![0];
}

export async function deleteDocument(id: string): Promise<void> {
  console.log(`Deleting document ${id}`);
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting document:", error.message);
    throw new Error(error.message);
  }

  console.log(`Document ${id} deleted successfully`);
}

export async function fetchDocumentById(id: string): Promise<Documents> {
  console.log(`Fetching document ${id}`);
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching document:", error.message);
    throw new Error(error.message);
  }

  console.log("Document fetched successfully:", data);
  return data;
}

export const debouncedUpdateDocument = debounce(
  async (id: string, updatedFields: Partial<Documents>): Promise<Documents> => {
    console.log(`Debounced update for document ${id}:`, updatedFields);
    return updateDocument(id, updatedFields);
  },
  1000 // 1 second debounce time, adjust as needed
);

// Log when debounced function is called
debouncedUpdateDocument.cancel = () => {
  console.log("Cancelling debounced update");
  if (typeof debouncedUpdateDocument.flush === "function") {
    debouncedUpdateDocument.flush();
  }
};
