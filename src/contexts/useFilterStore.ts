// stores/filterStore.ts
import { create } from "zustand";

interface FilterStore {
  filterText: string;
  filterTags: string[];
  setFilterText: (text: string) => void;
  toggleFilterTag: (tag: string) => void;
  clearFilters: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filterText: "",
  filterTags: [],
  setFilterText: (text) => set({ filterText: text }),
  toggleFilterTag: (tag) =>
    set((state) => ({
      filterTags: state.filterTags.includes(tag)
        ? state.filterTags.filter((t) => t !== tag)
        : [...state.filterTags, tag],
    })),
  clearFilters: () => set({ filterText: "", filterTags: [] }),
}));

export default useFilterStore;
