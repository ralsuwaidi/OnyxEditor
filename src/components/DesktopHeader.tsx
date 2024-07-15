import React from "react";
import { IonMenuToggle } from "@ionic/react";

const DesktopHeader: React.FC = () => (
  <IonMenuToggle>
    <div className="fixed top-3 left-3 m-4 z-10">
      <button className="btn btn-square bg-gray-100 p-2 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </div>
  </IonMenuToggle>
);

export default DesktopHeader;
