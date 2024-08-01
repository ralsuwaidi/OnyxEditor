import React, { useEffect, useState } from "react";
import { IonHeader, IonToolbar, IonTextarea } from "@ionic/react";
import useDocumentStore from "../../../../contexts/useDocumentStore";

const NoteTitle: React.FC = () => {
  const [initialTitle, setInitialTitle] = useState(" ");
  const { selectedDocument, updateDocument, isLoading } = useDocumentStore();

  useEffect(() => {
    if (selectedDocument && isLoading) {
      setInitialTitle(" ");
    }

    if (selectedDocument && !isLoading) {
      setInitialTitle(
        selectedDocument.type == "note"
          ? selectedDocument.title || ""
          : new Date(selectedDocument.created_at).toLocaleDateString()
      );
    }
  }, [isLoading, selectedDocument]);

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
