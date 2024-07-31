import create from "zustand";

// Define the type for a toast
interface Toast {
  message: string | null;
}

// Define the store state type
interface UIStateStore {
  toast: Toast;
  quickActionModal: boolean;
  setToast: (message: string | null) => void;
  openQuickActionModal: () => void;
  closeQuickActionModal: () => void;
}

// Create the store
const useUIStateStore = create<UIStateStore>((set) => ({
  toast: { message: null },
  quickActionModal: false,
  setToast: (message) => set({ toast: { message } }),
  openQuickActionModal: () => set({ quickActionModal: true }),
  closeQuickActionModal: () => set({ quickActionModal: false }),
}));

export default useUIStateStore;
