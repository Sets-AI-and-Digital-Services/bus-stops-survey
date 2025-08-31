import { create } from 'zustand';

export interface FiltersState {
  axis: string;
  activeBuckets: string[] | null;                  // null => show all
  setAxis: (axis: string) => void;                 // also clears bucket selection
  setBuckets: (buckets: string[] | null) => void;  // explicit set or null for "All"
  resetBuckets: () => void;                        // quick "All"
  toggleBucket: (bucket: string, allBuckets: string[]) => void; // add/remove bucket
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  axis: '1._general_cleanliness',
  activeBuckets: null,

  setAxis: (axis) => set({ axis, activeBuckets: null }),

  setBuckets: (buckets) => set({ activeBuckets: buckets }),

  resetBuckets: () => set({ activeBuckets: null }),

  toggleBucket: (bucket, allBuckets) => {
    const curr = get().activeBuckets;

    // start a selection
    if (curr == null) {
      return set({ activeBuckets: [bucket] });
    }

    const has = curr.includes(bucket);
    const next = has ? curr.filter(b => b !== bucket) : [...curr, bucket];

    // none or all selected => treat as "All"
    if (next.length === 0 || next.length === allBuckets.length) {
      return set({ activeBuckets: null });
    }

    set({ activeBuckets: next });
  },
}));
