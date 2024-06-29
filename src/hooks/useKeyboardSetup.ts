import { useEffect } from "react";
import { Keyboard } from "@capacitor/keyboard";

export const useKeyboardSetup = () => {
  useEffect(() => {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  }, []);
};
