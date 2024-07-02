// src/types/NoteType.ts

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface NoteType {
  id: string;
  content: object;
  title: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  metadata?: object;
}

export type NoteMetadataType = Omit<NoteType, "content">;
