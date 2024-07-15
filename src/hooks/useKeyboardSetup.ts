import { useEffect } from "react";
import { Keyboard } from "@capacitor/keyboard";
import { isPlatform } from "@ionic/react";

export const useKeyboardSetup = () => {
  useEffect(() => {
    if (!isPlatform("desktop")) {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
    }
  }, []);
};
