// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
