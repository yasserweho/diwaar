import { useEffect, useRef } from "react";
import { loadDesk, saveDesk, type Desk } from "@/lib/account.functions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";

function snapshot(): Desk {
  const s = useAppStore.getState();
  return {
    savedIds: s.savedIds,
    listings: s.userListings,
    alerts: s.alerts,
    wanted: s.wanted,
    threads: s.threads,
    replies: s.extraReplies,
    orders: s.orders,
    loans: s.loans,
    compareIds: s.compareIds,
    reserved: s.reserved,
    reported: s.reported,
  };
}

function apply(d: Desk) {
  useAppStore.getState().replaceDesk({
    savedIds: d.savedIds,
    userListings: d.listings,
    alerts: d.alerts,
    wanted: d.wanted,
    threads: d.threads,
    extraReplies: d.replies,
    orders: d.orders,
    loans: d.loans,
    compareIds: d.compareIds,
    reserved: d.reserved,
    reported: d.reported,
  });
}

export function AccountSync() {
  const { user, isPending } = useCurrentUserState();
  const ready = useRef(false);

  useEffect(() => {
    if (isPending || !user) {
      ready.current = false;
      return;
    }
    let stop = false;
    void (async () => {
      try {
        const remote = await loadDesk();
        if (stop) return;
        const local = snapshot();

        // Merge: keep any local listings that are not yet on the remote desk.
        // This prevents a newly posted ad from being wiped by an older remote snapshot.
        const remoteIds = new Set(remote.listings.map((p) => p.id));
        const localOnly = local.listings.filter((p) => !remoteIds.has(p.id));
        const mergedListings = [...localOnly, ...remote.listings];

        const remoteEmpty =
          remote.listings.length +
            remote.savedIds.length +
            remote.orders.length +
            remote.loans.length +
            remote.alerts.length +
            remote.wanted.length +
            remote.threads.length ===
          0;
        const localHas =
          local.listings.length + local.savedIds.length + local.orders.length + local.loans.length > 0;

        if (remoteEmpty && localHas) {
          await saveDesk({ data: local });
        } else if (localOnly.length > 0) {
          // Save the merged desk so the new listing is not lost
          const merged: Desk = {
            ...remote,
            listings: mergedListings,
          };
          await saveDesk({ data: merged });
          apply(merged);
        } else {
          apply(remote);
        }
        ready.current = true;
      } catch {
        ready.current = false;
      }
    })();
    return () => {
      stop = true;
    };
  }, [user, isPending]);

  useEffect(() => {
    if (!user) return;
    let timer = 0;
    const unsub = useAppStore.subscribe(() => {
      if (!ready.current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void saveDesk({ data: snapshot() }).catch(() => {});
      }, 600);
    });
    return () => {
      unsub();
      window.clearTimeout(timer);
    };
  }, [user]);

  return null;
}
