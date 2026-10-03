import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/alerts")({ component: AlertsPage });

function AlertsPage() {
  const alerts = useAppStore((s) => s.alerts);
  const remove = useAppStore((s) => s.removeAlert);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Alerts</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Saved searches</h1>
      <p className="mt-2 text-sm text-muted">
        Save a search from the results page. Diwaar keeps it on this device and opens the same filters again.
      </p>
      {alerts.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-card">
          <p className="font-semibold">No alerts yet</p>
          <Link to="/search" search={{ purpose: "buy" }} className="mt-3 inline-flex text-sm font-semibold text-primary">
            Start a search
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {alerts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-4 shadow-card">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{a.label}</p>
                <p className="text-xs text-muted">{a.createdAt}</p>
              </div>
              <Link
                to="/search"
                search={a.params}
                className="text-sm font-semibold text-primary"
              >
                Open
              </Link>
              <Button variant="ghost" size="sm" onClick={() => remove(a.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
