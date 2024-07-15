import React from "react";
import { IonRefresher, RefresherEventDetail } from "@ionic/react";

interface SearchRefresherProps {
  onRefresh: () => void;
}

const SearchRefresher: React.FC<SearchRefresherProps> = ({ onRefresh }) => (
  <IonRefresher
    slot="fixed"
    pullFactor={0.5}
    pullMin={100}
    pullMax={200}
    onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
      onRefresh();
      event.detail.complete();
    }}
  />
);

export default SearchRefresher;
