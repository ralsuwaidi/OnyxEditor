import React, { useRef } from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import useUIStateStore from '../../../../contexts/useUIStateStore';
import Editor from './Editor';
import useDocumentStore from '../../../../contexts/useDocumentStore';

const QuickActionModal: React.FC = () => {
    const isOpen = useUIStateStore(state => state.quickActionModal);
    const closeQuickActionModal = useUIStateStore(state => state.closeQuickActionModal);
    const modal = useRef<HTMLIonModalElement>(null);
    const page = useRef<HTMLDivElement>(null);
    const { deleteDocument, selectedDocument } = useDocumentStore()

    function handleDismiss() {
        modal.current?.dismiss();
        closeQuickActionModal();
    }

    function cancel() {
        if (selectedDocument) {
            deleteDocument(selectedDocument?.id)
        }
    }



    return (
        <div ref={page}>
            <IonModal isOpen={isOpen} ref={modal} onDidDismiss={handleDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Modal</IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={() => cancel()}>Cancel</IonButton>
                        </IonButtons>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => handleDismiss()}>Confirm</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <Editor />
                </IonContent>
            </IonModal>
        </div>
    );
};

export default QuickActionModal;
