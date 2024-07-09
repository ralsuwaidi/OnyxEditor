// src/types/NoteType.ts

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
  };
}

export type NoteMetadataType = Omit<NoteType, "mdcontent">;
