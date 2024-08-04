import { MergeDeep } from "type-fest";
import { Tables } from "./database.types";

// or using MergeDeep if you prefer that approach
export type Documents = MergeDeep<Tables<"documents">, { updated_at: string }>;
