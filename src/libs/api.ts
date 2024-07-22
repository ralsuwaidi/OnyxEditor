import { supabase } from "../services/supabaseClient";
import { Documents } from "../types/document.types";

export async function fetchDocuments(): Promise<Array<Documents>> {
  const { data, error } = await supabase.from("documents").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createDocument(
  newDocument: Omit<Documents, "id">
): Promise<Documents> {
  const { data, error } = await supabase
    .from("documents")
    .insert([newDocument])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data![0];
}

export async function updateDocument(
  id: string,
  updatedFields: Partial<Documents>
): Promise<Documents> {
  const { data, error } = await supabase
    .from("documents")
    .update(updatedFields)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data![0];
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchDocumentById(id: string): Promise<Documents> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
