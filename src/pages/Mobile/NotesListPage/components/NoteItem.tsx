import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { BookmarkIcon } from "@heroicons/react/16/solid";
import SmallBadge from "../../../../components/common/SmallBadge";
import { formatDateWithoutYear } from "../../../../libs/utils";
import { Documents } from "../../../../types/document.types";
import useFilterStore from "../../../../contexts/useFilterStore";

interface NoteItemProps {
  document: Documents;
  handleSelectNote: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ document, handleSelectNote }) => {
  const { clearFilters } = useFilterStore()

  const handleSelectClear = (id: string) => {
    clearFilters()
    handleSelectNote(id);
  };

  return (
    <IonItem button={true} onClick={() => handleSelectClear(document.id)}>
      <IonLabel>
        <h2 className=" md:text-lg md:font-bold">
          {document.title === "" ? "(No Title)" : document.title}
        </h2>
        <div className="line-clamp-2 mb-1 text-sm md:text-base text-gray-500">
          {document.content}
        </div>
        <div className="flex justify-between items-center">
          <div className=" flex space-x-2 mr-2">
            {document.pinned && (
              <p>
                <BookmarkIcon className="h-3 w-3 inline-block" />
              </p>
            )}
            <p className="whitespace-nowrap">
              {formatDateWithoutYear(document.updated_at!)}
            </p>
          </div>
          <div>
            <div className="flex overflow-x-auto space-x-2 ">
              {document.tags &&
                document.tags.map((tag, index) => (
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
