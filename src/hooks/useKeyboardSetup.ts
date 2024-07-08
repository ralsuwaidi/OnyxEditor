import { useEffect } from "react";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { isPlatform } from "@ionic/react";

export const useKeyboardSetup = () => {
  useEffect(() => {
    if (!isPlatform("desktop")) {
      Keyboard.setAccessoryBarVisible({ isVisible: true });
    } else {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
      Keyboard.removeAllListeners();
    }
  }, []);
};
