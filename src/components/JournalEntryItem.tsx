import React from "react";
import { NoteMetadataType } from "../types/NoteType";
import { IonMenuToggle } from "@ionic/react";
import classNames from "classnames";

interface JournalEntryItemProps {
  entry: NoteMetadataType;
  handleSelectNote: (noteMetadata: NoteMetadataType) => void;
}

const JournalEntryItem: React.FC<JournalEntryItemProps> = ({
  entry,
  handleSelectNote,
}) => {
  const hasDreamTag = entry.metadata?.tags?.includes("dream");

  return (
    <IonMenuToggle key={entry.id} autoHide={false}>
      <div
        className={classNames("rounded-lg p-3 hover:cursor-pointer mb-2", {
          "border-2 border-purple-700 bg-purple-50 dark:border-purple-900 dark:bg-purple-200": hasDreamTag,
          "border dark:border-gray-700": !hasDreamTag,
        })}
        onClick={() => handleSelectNote(entry)}
      >
        <div className="flex flex-col ">
          <div
            className={classNames(
              `line-clamp-3 text-ellipsis text-sm md:text-base font-normal `,
              {
                "text-purple-900": hasDreamTag,
                "text-gray-600 dark:text-gray-400": !hasDreamTag,
              }
            )}
          >
            {entry.metadata?.sample}
          </div>
          <time className="text-xs font-normal leading-none text-gray-400 dark:text-gray-500 self-end mt-2">
            {entry.createdAt.toDate().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>
    </IonMenuToggle>
  );
};

export default JournalEntryItem;
