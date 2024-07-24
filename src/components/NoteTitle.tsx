import React, { useEffect, useState } from "react";
import { IonHeader, IonToolbar, IonTextarea } from "@ionic/react";
import useDocumentStore from "../contexts/useDocumentStore";

interface NoteTitleProps {
  title: string;
  isDesktop: boolean;
}

const NoteTitle: React.FC<NoteTitleProps> = ({ title, isDesktop }) => {
  const [initialTitle, setInitialTitle] = useState(title);
  const { selectedDocument, updateDocument } = useDocumentStore();

  useEffect(() => {
    if (selectedDocument) {
      setInitialTitle(
        selectedDocument.type == "note"
          ? selectedDocument.title || ""
          : new Date(selectedDocument.created_at).toLocaleDateString()
      );
    }
  }, [selectedDocument]);

  const handleDocumentTitle = (newTitle: string) => {
    if (selectedDocument) {
      updateDocument(selectedDocument.id, { title: newTitle });
    }
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLTextAreaElement> | CustomEvent<FocusEvent>
  ) => {
    let newTitle: string;
    if (event instanceof CustomEvent) {
      newTitle = (event.target as HTMLIonTextareaElement).value || "";
    } else {
      newTitle = event.target.value;
    }
    handleDocumentTitle(newTitle);
  };

  if (isDesktop) {
    return (
      <div className="flex justify-center mt-12">
        <textarea
          placeholder="Note Title"
          className="input w-full dark:bg-background max-w-4xl mx-auto px-4 font-extrabold text-5xl focus:outline-none resize-none overflow-hidden"
          onBlur={handleBlur}
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
          value={initialTitle}
          placeholder="Enter Title"
          onIonBlur={handleBlur}
          onIonChange={(e) => setInitialTitle(e.detail.value!)}
          autoGrow={true}
          rows={1}
        />
      </IonToolbar>
    </IonHeader>
  );
};

export default NoteTitle;
