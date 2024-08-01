import React from "react";
import { IonSpinner } from "@ionic/react";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <IonSpinner />
  </div>
);

export default LoadingSpinner;
