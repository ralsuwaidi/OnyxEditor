// JournalEntries.tsx
import React from "react";
import { IonRefresher, IonRefresherContent } from "@ionic/react";
import JournalEntryItem from "./JournalEntryItem";
import useDocumentStore from "../../contexts/useDocumentStore";
import useFilterStore from "../../contexts/useFilterStore";
import { Documents } from "../../types/document.types";
import dayjs from "dayjs";

interface JournalEntriesProps { }

interface GroupedEntries {
  [date: string]: Documents[];
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ }) => {
  const journalEntries = useDocumentStore((state) =>
    state.documents.filter((document) => document.type == "journal")
  );
  const { loadDocuments } = useDocumentStore();
  const selectedDate = useFilterStore((state) => state.selectedDate);

  const handleLocalRefresh = async (event: CustomEvent) => {
    await loadDocuments();
    event.detail.complete();
  };

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

  // Filter entries based on selected date
  const filteredEntries = selectedDate
    ? journalEntries.filter((entry) =>
      dayjs(entry.created_at).isSame(selectedDate, "day")
    )
    : journalEntries;

  // Group entries by date
  const groupedEntries: GroupedEntries = filteredEntries.reduce(
    (acc: GroupedEntries, entry: Documents) => {
      const date = new Date(entry.created_at).toLocaleDateString("en-US", {
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
      <IonRefresher slot="fixed" onIonRefresh={handleLocalRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <ol className="relative border-s border-gray-200 px-2 dark:border-gray-700">
        {sortedDates.map((date: string) => (
          <li key={date} className="mb-7 ms-4">
            <div className="absolute w-3 h-3 bg-slate-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-2 text-sm font-normal leading-none text-black dark:text-text-color-dark">
              {date === today
                ? "Today"
                : date === yesterdayString
                  ? "Yesterday"
                  : date}
            </time>
            {groupedEntries[date]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((entry: Documents) => (
                <JournalEntryItem key={entry.id} entry={entry} />
              ))}
          </li>
        ))}
      </ol>
    </>
  );
};

export default JournalEntries;
