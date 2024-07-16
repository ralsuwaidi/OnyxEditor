import React from "react";
import useNoteStore from "../contexts/noteStore";
import { NoteMetadataType } from "../types/NoteType";
import { IonMenuToggle, IonRefresher, IonRefresherContent } from "@ionic/react";

interface JournalEntriesProps {
  handleSelectNote: (noteMetadata: NoteMetadataType) => void;
  handleRefresh: (event: CustomEvent) => void;
}

interface GroupedEntries {
  [date: string]: NoteMetadataType[];
}

const JournalEntries: React.FC<JournalEntriesProps> = ({
  handleSelectNote,
  handleRefresh,
}) => {
  const journalEntries = useNoteStore((state) => state.journalEntries);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Group entries by date
  const groupedEntries: GroupedEntries = journalEntries.reduce(
    (acc: GroupedEntries, entry: NoteMetadataType) => {
      const date = entry.createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {}
  );

  // Sort dates in descending order
  const sortedDates: string[] = Object.keys(groupedEntries).sort(
    (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <ol className="relative border-s border-gray-200 px-2 dark:border-gray-700">
        {sortedDates.map((date: string) => (
          <li key={date} className="mb-7 ms-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {date === today
                ? "Today"
                : date === yesterdayString
                ? "Yesterday"
                : date}
            </time>
            {groupedEntries[date]
              .sort(
                (a, b) =>
                  b.createdAt.toDate().getTime() -
                  a.createdAt.toDate().getTime()
              )
              .map((entry: NoteMetadataType) => (
                <IonMenuToggle key={entry.id} autoHide={false}>
                  <div
                    className="border dark:border-gray-700 rounded p-3 hover:cursor-pointer mb-2"
                    onClick={() => handleSelectNote(entry)}
                  >
                    <div className="flex flex-col">
                      <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">
                        {entry.metadata?.sample}
                      </p>
                      <time className="text-xs font-normal leading-none text-gray-400 dark:text-gray-500 self-end mt-2">
                        {entry.createdAt.toDate().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>
                </IonMenuToggle>
              ))}
          </li>
        ))}
      </ol>
    </>
  );
};

export default JournalEntries;
