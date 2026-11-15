import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/format";
import { SOCIETIES, TRENDS } from "@/lib/portal";
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

/** Rate multiplier for known societies (relative to city average). */
const SOCIETY_FACTOR: Record<string, number> = {
  "DHA Lahore Phase 5": 1.45,
  "DHA Lahore Phase 6": 1.35,
  "Bahria Town Lahore": 1.15,
  "Park View City": 1.05,
  "DHA Karachi Phase 8": 1.4,
  "Scheme 33": 0.9,
  "Bahria Town Karachi": 1.1,
  "DHA Islamabad": 1.4,
  "Bahria Town Islamabad": 1.12,
  "B-17": 1.0,
  "Gulberg Greens": 1.08,
  "DHA Rawalpindi": 1.3,
};

const FINISH: { id: "grey" | "standard" | "premium"; label: string; factor: number }[] = [
  { id: "grey", label: "Grey structure", factor: 0.82 },
  { id: "standard", label: "Standard finish", factor: 1 },
  { id: "premium", label: "Premium finish", factor: 1.22 },
];

function DValuePage() {
  const [city, setCity] = useState("Lahore");
  const [society, setSociety] = useState("");
  const [type, setType] = useState<Category>("house");
  const [area, setArea] = useState("5");
  const [unit, setUnit] = useState<"marla" | "kanal" | "sqft">("marla");
  const [finish, setFinish] = useState<"grey" | "standard" | "premium">("standard");
  const [ready, setReady] = useState(false);

  const societies = SOCIETIES.filter((s) => s.city === city);

  const result = useMemo(() => {
    if (!ready) return null;
    const n = Number(area) || 0;
    const sqft = unit === "kanal" ? n * 5445 : unit === "marla" ? n * 272.25 : n;
    if (sqft <= 0) return null;

    const trend = TRENDS.find((t) => t.city === city && t.category === type);
    const cityBoost =
      city === "Lahore" || city === "Karachi" || city === "Islamabad" ? 1.15 : city === "Rawalpindi" ? 1.05 : 0.85;
    let base = (trend?.avg ? trend.avg / 2000 : BASE_PER_SQFT[type]) * cityBoost;

    // Society premium
    const soc = societies.find((s) => s.name === society);
    const societyFactor = soc ? SOCIETY_FACTOR[soc.name] ?? 1 : 1;
    base *= societyFactor;

    // Smaller plots cost more per marla (size adjustment)
    const marla = sqft / 272.25;
    const sizeFactor = marla <= 5 ? 1.08 : marla <= 10 ? 1 : 0.92;
    base *= sizeFactor;

    // Finish
    const finishFactor = FINISH.find((f) => f.id === finish)?.factor ?? 1;
    base *= finishFactor;

    const mid = Math.round(sqft * base);
    const low = Math.round(mid * 0.88);
    const high = Math.round(mid * 1.12);
    return {
      sqft,
      low,
      mid,
      high,
      demand: trend?.demand ?? "Steady",
      societyFactor,
      finishFactor,
      sizeFactor,
    };
  }, [ready, area, unit, city, type, society, finish, societies]);

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">D-Value</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Check a property's value</h1>
      <p className="mt-2 text-sm text-muted">
        Estimate what a house, flat or plot is worth. Society, size and finish are included. This is a guide, not a formal valuation.
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
          <select
            className={`${field} mt-1`}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setSociety("");
            }}
          >
            {CITIES.slice(0, 12).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Society (optional)
          <select className={`${field} mt-1`} value={society} onChange={(e) => setSociety(e.target.value)}>
            <option value="">City average</option>
            {societies.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
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
        <label className="block text-sm font-semibold">
          Finish
          <select className={`${field} mt-1`} value={finish} onChange={(e) => setFinish(e.target.value as typeof finish)}>
            {FINISH.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
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
          <ul className="space-y-1 text-xs text-muted">
            {society && <li>Society factor: {result.societyFactor.toFixed(2)}×</li>}
            <li>Size factor: {result.sizeFactor.toFixed(2)}×</li>
            <li>Finish factor: {result.finishFactor.toFixed(2)}×</li>
          </ul>
          <p className="text-xs text-muted">
            Based on typical asking prices in {city}
            {society ? ` · ${society}` : ""}. Actual sale price depends on exact location, road, and condition.
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
