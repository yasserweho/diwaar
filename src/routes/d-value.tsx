import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/format";
import { SOCIETIES } from "@/lib/portal";
import { CITIES, type Category } from "@/lib/types";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/d-value")({
  head: () =>
    seo(
      "D-Value — Check property value",
      "Estimate the value of a house, flat or plot in Pakistan using typical Zameen asking prices.",
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

/** Base PKR per sq ft, calibrated to typical Zameen asking bands (2025–26). */
const BASE_PER_SQFT: Record<string, number> = {
  house: 18500,
  flat: 16000,
  plot: 14500,
  commercial: 28000,
  portion: 14000,
  farmhouse: 9500,
};

/** Society multipliers vs city average, based on Zameen listing ranges. */
const SOCIETY_FACTOR: Record<string, number> = {
  "DHA Lahore Phase 5": 1.65,
  "DHA Lahore Phase 6": 1.45,
  "Bahria Town Lahore": 1.2,
  "Park View City": 0.95,
  "DHA Karachi Phase 8": 1.5,
  "Scheme 33": 0.75,
  "Bahria Town Karachi": 1.05,
  "DHA Islamabad": 1.55,
  "Bahria Town Islamabad": 1.1,
  "B-17": 0.85,
  "Gulberg Greens": 0.9,
  "DHA Rawalpindi": 1.25,
};

const CITY_FACTOR: Record<string, number> = {
  Lahore: 1.1,
  Karachi: 1.05,
  Islamabad: 1.15,
  Rawalpindi: 0.95,
  Multan: 0.7,
  Faisalabad: 0.65,
  Peshawar: 0.6,
  Gujranwala: 0.62,
};

const FINISH: { id: "grey" | "standard" | "premium"; label: string; factor: number }[] = [
  { id: "grey", label: "Grey structure", factor: 0.78 },
  { id: "standard", label: "Standard finish", factor: 1 },
  { id: "premium", label: "Premium finish", factor: 1.28 },
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

    const cityFactor = CITY_FACTOR[city] ?? 0.7;
    let base = BASE_PER_SQFT[type] * cityFactor;

    const soc = societies.find((s) => s.name === society);
    const societyFactor = soc ? SOCIETY_FACTOR[soc.name] ?? 1 : 1;
    base *= societyFactor;

    const marla = sqft / 272.25;
    const sizeFactor = marla <= 5 ? 1.1 : marla <= 10 ? 1 : 0.9;
    base *= sizeFactor;

    const finishFactor = FINISH.find((f) => f.id === finish)?.factor ?? 1;
    base *= finishFactor;

    const mid = Math.round(sqft * base);
    const low = Math.round(mid * 0.85);
    const high = Math.round(mid * 1.15);
    return { sqft, low, mid, high, societyFactor, finishFactor, sizeFactor };
  }, [ready, area, unit, city, type, society, finish, societies]);

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">D-Value</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Check a property's value</h1>
      <p className="mt-2 text-sm text-muted">
        Estimates follow typical asking prices on Zameen for the same city, society and type. This is a guide, not a formal valuation.
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
              {Math.round(result.sqft).toLocaleString()} sq ft · aligned with Zameen asking prices
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
            Based on typical Zameen selling prices in {city}
            {society ? ` · ${society}` : ""}. Actual deals can close below the asking band.
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
