import { Timestamp } from "firebase/firestore";

export interface NoteType {
  id: string;
  mdcontent: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    pin?: boolean;
    sample?: string;
    tags?: string[];
    type?: "journal" | "quick note" | "note";
  };
}

export type NoteMetadataType = Omit<NoteType, "mdcontent">;
