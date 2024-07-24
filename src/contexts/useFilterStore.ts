// stores/filterStore.ts
import { create } from "zustand";
import { Dayjs } from "dayjs";

interface FilterStore {
  filterText: string;
  filterTags: string[];
  selectedDate: Dayjs | null;
  setFilterText: (text: string) => void;
  toggleFilterTag: (tag: string) => void;
  setSelectedDate: (date: Dayjs | null) => void;
  clearFilters: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filterText: "",
  filterTags: [],
  selectedDate: null,
  setFilterText: (text) => set({ filterText: text }),
  toggleFilterTag: (tag) =>
    set((state) => ({
      filterTags: state.filterTags.includes(tag)
        ? state.filterTags.filter((t) => t !== tag)
        : [...state.filterTags, tag],
    })),
  setSelectedDate: (date) =>
    set((state) => ({
      selectedDate:
        state.selectedDate && state.selectedDate.isSame(date, "day")
          ? null
          : date,
    })),
  clearFilters: () =>
    set({ filterText: "", filterTags: [], selectedDate: null }),
}));

export default useFilterStore;
