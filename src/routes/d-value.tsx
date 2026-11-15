import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/format";
import { areasInCity, rateFor } from "@/lib/valuation";
import { CITIES, type Category } from "@/lib/types";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SearchSelect } from "@/components/search-select";

export const Route = createFileRoute("/d-value")({
  head: () =>
    seo(
      "Destimate — Check property value",
      "Estimate property value from typical asking prices across cities and areas in Pakistan.",
      { path: "/d-value" },
    ),
  component: DestimatePage,
});

const TYPES: { id: Category; label: string }[] = [
  { id: "house", label: "House" },
  { id: "flat", label: "Flat" },
  { id: "plot", label: "Plot" },
  { id: "commercial", label: "Commercial" },
  { id: "portion", label: "Portion" },
  { id: "farmhouse", label: "Farm House" },
];

const FINISH: { id: "grey" | "standard" | "premium"; label: string; factor: number }[] = [
  { id: "grey", label: "Grey structure", factor: 0.78 },
  { id: "standard", label: "Standard finish", factor: 1 },
  { id: "premium", label: "Premium finish", factor: 1.28 },
];

const UNITS: { value: "marla" | "kanal" | "sqft"; label: string }[] = [
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
  { value: "sqft", label: "Sq. Ft." },
];

function DestimatePage() {
  const [city, setCity] = useState("Lahore");
  const [area, setArea] = useState("");
  const [type, setType] = useState<Category>("house");
  const [size, setSize] = useState("5");
  const [unit, setUnit] = useState<"marla" | "kanal" | "sqft">("marla");
  const [finish, setFinish] = useState<"grey" | "standard" | "premium">("standard");
  const [ready, setReady] = useState(false);

  const areaOptions = areasInCity(city);

  const result = useMemo(() => {
    if (!ready) return null;
    const n = Number(size) || 0;
    const sqft = unit === "kanal" ? n * 5445 : unit === "marla" ? n * 272.25 : n;
    if (sqft <= 0) return null;

    const rate = rateFor(city, area || "City average", type);
    let base = rate.perSqft;

    const marla = sqft / 272.25;
    const sizeFactor = marla <= 5 ? 1.1 : marla <= 10 ? 1 : 0.9;
    base *= sizeFactor;

    const finishFactor = FINISH.find((f) => f.id === finish)?.factor ?? 1;
    base *= finishFactor;

    const mid = Math.round(sqft * base);
    const low = Math.round(mid * 0.85);
    const high = Math.round(mid * 1.15);
    return { sqft, low, mid, high, sizeFactor, finishFactor, matched: rate.matched, perSqft: rate.perSqft };
  }, [ready, size, unit, city, type, area, finish]);

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Destimate</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Check a property's value</h1>
      <p className="mt-2 text-sm text-muted">
        Based on typical asking prices by city and area. This is a guide, not a formal valuation.
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
          <div className="mt-1">
            <SearchSelect
              value={city}
              searchPlaceholder="Type a city"
              options={CITIES.slice(0, 12).map((c) => ({ value: c, label: c }))}
              onChange={(next) => {
                setCity(next);
                setArea("");
              }}
            />
          </div>
        </label>
        <label className="block text-sm font-semibold">
          Area
          <div className="mt-1">
            <SearchSelect
              value={area}
              placeholder="City average"
              searchPlaceholder="Type an area"
              options={[
                { value: "", label: "City average" },
                ...areaOptions.map((a) => ({ value: a, label: a })),
              ]}
              onChange={setArea}
            />
          </div>
        </label>
        <label className="block text-sm font-semibold">
          Property type
          <div className="mt-1">
            <SearchSelect
              value={type}
              searchPlaceholder="Type a property type"
              options={TYPES.map((t) => ({ value: t.id, label: t.label }))}
              onChange={(next) => setType(next as Category)}
            />
          </div>
        </label>
        <div className="grid grid-cols-[1fr_8rem] gap-3">
          <label className="block text-sm font-semibold">
            Area size
            <input className={`${field} mt-1`} value={size} onChange={(e) => setSize(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Unit
            <div className="mt-1">
              <SearchSelect
                value={unit}
                searchPlaceholder="Unit"
                options={UNITS}
                onChange={(next) => setUnit(next as typeof unit)}
              />
            </div>
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Finish
          <div className="mt-1">
            <SearchSelect
              value={finish}
              searchPlaceholder="Finish"
              options={FINISH.map((f) => ({ value: f.id, label: f.label }))}
              onChange={(next) => setFinish(next as typeof finish)}
            />
          </div>
        </label>
        <button type="submit" className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-fg">
          Get Destimate
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
              {Math.round(result.sqft).toLocaleString()} sq ft · PKR {result.perSqft.toLocaleString()} / sq ft · {result.matched}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Band label="Low" value={formatPkr(result.low)} />
            <Band label="Mid" value={formatPkr(result.mid)} active />
            <Band label="High" value={formatPkr(result.high)} />
          </div>
          <ul className="space-y-1 text-xs text-muted">
            <li>Matched: {result.matched}</li>
            <li>Size factor: {result.sizeFactor.toFixed(2)}×</li>
            <li>Finish factor: {result.finishFactor.toFixed(2)}×</li>
          </ul>
          <p className="text-xs text-muted">
            Based on typical asking prices in {city}
            {area ? ` · ${area}` : ""}. Actual deals can close below the asking band.
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
