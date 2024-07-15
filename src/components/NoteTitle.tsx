import React from "react";
import { IonHeader, IonToolbar, IonInput } from "@ionic/react";

interface NoteTitleProps {
  title: string;
  onChange: (newTitle: string) => void;
  isDesktop: boolean;
}

const NoteTitle: React.FC<NoteTitleProps> = ({
  title,
  onChange,
  isDesktop,
}) => {
  if (isDesktop) {
    return (
      <div className="flex justify-center mt-12">
        <input
          type="text"
          placeholder="Note Title"
          className="input w-full max-w-4xl mx-auto px-4 font-extrabold text-5xl focus:outline-none"
          onChange={(e) => onChange(e.target.value)}
          value={title}
        />
      </div>
    );
  }

  return (
    <IonHeader collapse="condense">
      <IonToolbar>
        <IonInput
          className="ml-3 text-3xl font-extrabold"
          value={title}
          placeholder="Enter Title"
          onIonChange={(e) => onChange(e.detail.value!)}
        />
      </IonToolbar>
    </IonHeader>
  );
};

export default NoteTitle;
