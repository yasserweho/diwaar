import { createFileRoute, Link } from "@tanstack/react-router";
import { TRENDS } from "@/lib/portal";
import { CATEGORY_LABEL } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/trends")({
  head: () =>
    seo(
      "Pakistan Property Price Trends",
      "Where house and plot asking prices moved in Lahore, Karachi, Islamabad and other cities.",
      { path: "/trends" },
    ),
  component: TrendsPage });

function TrendsPage() {
  const currency = useAppStore((s) => s.currency);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Property trends</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Where asking prices moved</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Year-on-year change for the areas buyers actually search. Open a row to see live Diwaar listings there.
      </p>
      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-card">
        {TRENDS.map((row) => (
          <li key={`${row.city}-${row.location}-${row.category}`}>
            <Link
              to="/search"
              search={{ purpose: "buy", city: row.city, location: row.location, type: row.category }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 hover:bg-ice"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold">{row.location}</p>
                <p className="text-sm text-muted">
                  {CATEGORY_LABEL[row.category]} · {row.city}
                </p>
              </div>
              <p className="text-sm text-muted">{formatPkr(row.avg, currency)} typical</p>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-bold",
                  row.demand === "High" ? "bg-ice text-primary" : "bg-ice text-muted",
                )}
              >
                {row.demand}
              </span>
              <p className="w-16 text-right font-extrabold tabular-nums text-primary-dark">+{row.change}%</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
