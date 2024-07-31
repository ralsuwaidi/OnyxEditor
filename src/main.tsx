import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./styles/variables.css";
import "./styles/editor.css";
import useUIStateStore from "./contexts/useUIStateStore.ts";
import useDocumentStore from "./contexts/useDocumentStore.ts";

declare global {
  interface Window {
    handleQuickAction: (type: string) => void;
  }
}

window.handleQuickAction = (type) => {
  console.log({ type });
  const openQuickActionModal = useUIStateStore.getState().openQuickActionModal;
  const createNote = useDocumentStore.getState().createDocument;
  createNote("note")
  openQuickActionModal();
};


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
