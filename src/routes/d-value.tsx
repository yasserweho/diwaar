import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/format";
import { TRENDS } from "@/lib/portal";
import { CITIES, type Category } from "@/lib/types";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/d-value")({
  head: () =>
    seo(
      "D-Value — Check property value",
      "Estimate the value of a house, flat or plot in Pakistan with Diwaar's D-Value tool.",
      { path: "/d-value" },
    ),
  component: DValuePage,
});

const TYPES: { id: Category; label: string }[] = [
  { id: "house", label: "House" },
  { id: "flat", label: "Flat" },
  { id: "plot", label: "Plot" },
  { id: "commercial", label: "Commercial" },
  { id: "portion", label: "Portion" },
  { id: "farmhouse", label: "Farm House" },
];

const BASE_PER_SQFT: Record<string, number> = {
  house: 12000,
  flat: 10000,
  plot: 8000,
  commercial: 18000,
  portion: 9000,
  farmhouse: 7000,
};

function DValuePage() {
  const [city, setCity] = useState("Lahore");
  const [type, setType] = useState<Category>("house");
  const [area, setArea] = useState("5");
  const [unit, setUnit] = useState<"marla" | "kanal" | "sqft">("marla");
  const [ready, setReady] = useState(false);

  const result = useMemo(() => {
    if (!ready) return null;
    const n = Number(area) || 0;
    const sqft = unit === "kanal" ? n * 5445 : unit === "marla" ? n * 272.25 : n;
    if (sqft <= 0) return null;

    const trend = TRENDS.find((t) => t.city === city && t.category === type);
    const cityBoost =
      city === "Lahore" || city === "Karachi" || city === "Islamabad" ? 1.15 : city === "Rawalpindi" ? 1.05 : 0.85;
    const base = (trend?.avg ? trend.avg / 2000 : BASE_PER_SQFT[type]) * cityBoost;
    const mid = Math.round(sqft * base);
    const low = Math.round(mid * 0.88);
    const high = Math.round(mid * 1.12);
    return { sqft, low, mid, high, demand: trend?.demand ?? "Steady" };
  }, [ready, area, unit, city, type]);

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">D-Value</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Check a property's value</h1>
      <p className="mt-2 text-sm text-muted">
        Estimate what a house, flat or plot is worth in your city. This is a guide from recent asking prices, not a formal valuation.
      </p>

      <form
        className="mt-6 space-y-4 rounded-2xl bg-surface p-5 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          setReady(true);
        }}
      >
        <label className="block text-sm font-semibold">
          City
          <select className={`${field} mt-1`} value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.slice(0, 12).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Property type
          <select className={`${field} mt-1`} value={type} onChange={(e) => setType(e.target.value as Category)}>
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-[1fr_8rem] gap-3">
          <label className="block text-sm font-semibold">
            Area
            <input className={`${field} mt-1`} value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Unit
            <select className={`${field} mt-1`} value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
              <option value="sqft">Sq. Ft.</option>
            </select>
          </label>
        </div>
        <button type="submit" className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-fg">
          Get D-Value
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Estimated value</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-primary-dark">{formatPkr(result.mid)}</p>
            <p className="mt-2 text-sm text-muted">
              Range {formatPkr(result.low)} – {formatPkr(result.high)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {Math.round(result.sqft).toLocaleString()} sq ft · demand {result.demand}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Band label="Low" value={formatPkr(result.low)} />
            <Band label="Mid" value={formatPkr(result.mid)} active />
            <Band label="High" value={formatPkr(result.high)} />
          </div>
          <p className="text-xs text-muted">
            Based on typical asking prices in {city}. Actual sale price depends on location, finish, and condition.
          </p>
        </div>
      )}
    </div>
  );
}

function Band({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={cn("rounded-xl p-3 text-center", active ? "bg-primary text-primary-fg" : "bg-ice")}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
