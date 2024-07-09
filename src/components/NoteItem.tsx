import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { BookmarkIcon } from "@heroicons/react/16/solid";
import SmallBadge from "./common/SmallBadge";
import { NoteMetadataType } from "../types/NoteType";
import { formatDateWithoutYear } from "../libs/utils";

interface NoteItemProps {
  note: NoteMetadataType;
  handleSelectNote: (note: NoteMetadataType) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, handleSelectNote }) => {
  return (
    <IonItem button={true} onClick={() => handleSelectNote(note)}>
      <IonLabel>
        <h2 className=" md:text-lg md:font-bold">
          {note.title === "" ? "(No Title)" : note.title}
        </h2>
        <div className="line-clamp-2 mb-1 text-sm md:text-base text-gray-500">
          {note.metadata?.sample ? note.metadata.sample : ""}
        </div>
        <div className="flex justify-between items-center">
          <div className=" flex space-x-2 mr-2">
            {note.metadata?.pin && (
              <p>
                <BookmarkIcon className="h-3 w-3 inline-block" />
              </p>
            )}
            <p className="whitespace-nowrap">
              {formatDateWithoutYear(note.updatedAt)}
            </p>
          </div>
          <div>
            <div className="flex overflow-x-auto space-x-2 ">
              {note.metadata &&
                note.metadata.tags &&
                note.metadata.tags.map((tag, index) => (
                  <SmallBadge key={index} tag={tag} />
                ))}
            </div>
          </div>
        </div>
      </IonLabel>
    </IonItem>
  );
};

export default NoteItem;
