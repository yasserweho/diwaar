import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AreaUnit, Currency } from "./format";
import type { Property } from "./types";

interface AppState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  userListings: Property[];
  addListing: (p: Property) => void;
  areaUnit: AreaUnit;
  currency: Currency;
  setAreaUnit: (u: AreaUnit) => void;
  setCurrency: (c: Currency) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [...s.savedIds, id],
        })),
      isSaved: (id) => get().savedIds.includes(id),
      userListings: [],
      addListing: (p) => set((s) => ({ userListings: [p, ...s.userListings] })),
      areaUnit: "marla",
      currency: "PKR",
      setAreaUnit: (areaUnit) => set({ areaUnit }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "diwaar-store", skipHydration: true },
  ),
);
