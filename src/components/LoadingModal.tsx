import React from "react";
import { IonSpinner } from "@ionic/react";

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-background">
          <IonSpinner className="text-gray-600 dark:text-gray-200" />
        </div>
      )}
    </>
  );
};

export default LoadingModal;
