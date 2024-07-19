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
          "border border-dracula-400 bg-dracula-100 dark:border-dracula-800 dark:bg-dracula-950": hasDreamTag,
          "border dark:border-gray-700": !hasDreamTag,
        })}
        onClick={() => handleSelectNote(entry)}
      >
        <div className="flex flex-col ">
          <div
            className={classNames(
              `line-clamp-3 text-ellipsis text-sm md:text-base font-normal `,
              {
                " text-black dark:text-text-color-dark": hasDreamTag,
                "text-gray-600 dark:text-gray-400": !hasDreamTag,
              }
            )}
          >
            {entry.metadata?.sample}
          </div>
          <time
            className={classNames(
              "text-xs font-normal leading-none dark:text-gray-500 self-end mt-2",
              {
                " text-black text-opacity-80 dark:text-text-color-dark": hasDreamTag,
                "text-gray-600 dark:text-gray-400": !hasDreamTag,
              }
            )}
          >
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
