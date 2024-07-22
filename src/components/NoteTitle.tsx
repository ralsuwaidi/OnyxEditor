import React, { useState } from "react";
import { IonHeader, IonToolbar, IonTextarea } from "@ionic/react";

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
    const [initialTitle, setInitialTitle] = useState(title);
    return (
      <div className="flex justify-center mt-12">
        <textarea
          placeholder="Note Title"
          className="input w-full dark:bg-background max-w-4xl mx-auto px-4 font-extrabold text-5xl focus:outline-none resize-none overflow-hidden"
          onBlur={(e) => onChange(e.target.value)}
          onChange={(e) => setInitialTitle(e.target.value)}
          value={initialTitle}
          rows={1}
          style={{ minHeight: "1.5em" }}
        />
      </div>
    );
  }

  return (
    <IonHeader collapse="condense">
      <IonToolbar>
        <IonTextarea
          className="ml-3 text-3xl font-extrabold"
          value={title}
          placeholder="Enter Title"
          onIonChange={(e) => onChange(e.detail.value!)}
          autoGrow={true}
          rows={1}
        />
      </IonToolbar>
    </IonHeader>
  );
};

export default NoteTitle;
