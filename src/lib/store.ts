import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoanApp, Order } from "./account.functions";
import type { AreaUnit, Currency } from "./format";
import type { ForumPost, Reply, SavedAlert, WantedAd } from "./portal";
import type { Property } from "./types";

interface AppState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  userListings: Property[];
  addListing: (p: Property) => void;
  removeListing: (id: string) => void;
  areaUnit: AreaUnit;
  currency: Currency;
  setAreaUnit: (u: AreaUnit) => void;
  setCurrency: (c: Currency) => void;
  recentIds: string[];
  noteRecent: (id: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => boolean;
  alerts: SavedAlert[];
  addAlert: (alert: SavedAlert) => void;
  removeAlert: (id: string) => void;
  wanted: WantedAd[];
  addWanted: (ad: WantedAd) => void;
  threads: ForumPost[];
  addThread: (post: ForumPost) => void;
  extraReplies: Record<string, Reply[]>;
  addReply: (threadId: string, reply: Reply) => void;
  reserved: string[];
  toggleReserved: (id: string) => void;
  reported: string[];
  reportListing: (id: string) => void;
  orders: Order[];
  loans: LoanApp[];
  addOrder: (order: Order) => void;
  addLoan: (loan: LoanApp) => void;
  advanceLoan: (id: string) => void;
  replaceDesk: (desk: {
    savedIds: string[];
    userListings: Property[];
    alerts: AppState["alerts"];
    wanted: AppState["wanted"];
    threads: AppState["threads"];
    extraReplies: AppState["extraReplies"];
    orders: Order[];
    loans: LoanApp[];
    compareIds: string[];
    reserved: string[];
    reported: string[];
  }) => void;
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
      removeListing: (id) =>
        set((s) => ({ userListings: s.userListings.filter((p) => p.id !== id) })),
      areaUnit: "marla",
      currency: "PKR",
      setAreaUnit: (areaUnit) => set({ areaUnit }),
      setCurrency: (currency) => set({ currency }),
      recentIds: [],
      noteRecent: (id) =>
        set((s) => ({
          recentIds: [id, ...s.recentIds.filter((x) => x !== id)].slice(0, 8),
        })),
      compareIds: [],
      toggleCompare: (id) => {
        const has = get().compareIds.includes(id);
        if (!has && get().compareIds.length >= 3) return false;
        set((s) => ({
          compareIds: has ? s.compareIds.filter((x) => x !== id) : [...s.compareIds, id],
        }));
        return true;
      },
      alerts: [],
      addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 12) })),
      removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      wanted: [],
      addWanted: (ad) => set((s) => ({ wanted: [ad, ...s.wanted] })),
      threads: [],
      addThread: (post) => set((s) => ({ threads: [post, ...s.threads] })),
      extraReplies: {},
      addReply: (threadId, reply) =>
        set((s) => ({
          extraReplies: {
            ...s.extraReplies,
            [threadId]: [...(s.extraReplies[threadId] ?? []), reply],
          },
        })),
      reserved: [],
      toggleReserved: (id) =>
        set((s) => ({
          reserved: s.reserved.includes(id)
            ? s.reserved.filter((x) => x !== id)
            : [...s.reserved, id],
        })),
      reported: [],
      reportListing: (id) =>
        set((s) => ({
          reported: s.reported.includes(id) ? s.reported : [...s.reported, id],
        })),
      orders: [],
      loans: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      addLoan: (loan) => set((s) => ({ loans: [loan, ...s.loans] })),
      advanceLoan: (id) =>
        set((s) => ({
          loans: s.loans.map((l) => {
            if (l.id !== id) return l;
            const order = ["submitted", "valuation", "approved", "disbursed"] as const;
            const i = order.indexOf(l.stage);
            return { ...l, stage: order[Math.min(order.length - 1, i + 1)] };
          }),
        })),
      replaceDesk: (desk) => set(desk),
    }),
    { name: "diwaar-store", skipHydration: true },
  ),
);
