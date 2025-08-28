import { create } from 'zustand';


interface FiltersState {
    axis: string;
    setAxis: (k: string) => void;
}


// export const useFiltersStore = create<FiltersState>((set) => ({
// axis: 'cleanliness',
// setAxis: (k) => set({ axis: k })
// }));
export const useFiltersStore = create<FiltersState>((set) => ({
    axis: '1._general_cleanliness',     // <-- match key from your JSON
    setAxis: (k) => set({ axis: k }),
}));