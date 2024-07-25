// uiStateStore.ts
import create from "zustand";

// Define the type for a toast
interface Toast {
  message: string | null;
}

// Define the store state type
interface UIStateStore {
  toast: Toast;
  setToast: (message: string | null) => void;
}

// Create the store
const useUIStateStore = create<UIStateStore>((set) => ({
  toast: { message: null },
  setToast: (message) =>
    set({
      toast: { message },
    }),
}));

export default useUIStateStore;
