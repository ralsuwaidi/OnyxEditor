// hooks/useSliding.ts
import { useRef } from "react";

export function useSliding() {
  const slidingRef = useRef<{ [key: string]: boolean }>({});

  const handleSliding = (id: string) => {
    slidingRef.current[id] = true;
  };

  const isSliding = (id: string) => {
    return slidingRef.current[id] || false;
  };

  const resetSliding = (id: string) => {
    slidingRef.current[id] = false;
  };

  return {
    handleSliding,
    isSliding,
    resetSliding,
  };
}
