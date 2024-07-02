// src/hooks/useMaxHeight.ts
import { useState, useEffect } from "react";

export const useMaxHeight = (): string => {
  const [maxHeight, setMaxHeight] = useState<string>("");

  useEffect(() => {
    const updateMaxHeight = () => {
      const offset = 110;
      setMaxHeight(`calc(100vh - ${offset}px)`);
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  return maxHeight;
};
