import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/format";
import { MIN_SAMPLE, perSqftStat } from "@/lib/market-stats";
import { listPublicListings } from "@/lib/listings.functions";
import { CITIES, type Category, type Property } from "@/lib/types";
import { AREA_BOOK } from "@/lib/locations";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SearchSelect } from "@/components/search-select";

export const Route = createFileRoute("/d-value")({
  loader: async (): Promise<{ listings: Property[] }> => {
    try {
      return { listings: await listPublicListings({ data: { purpose: "buy", limit: 500 } }) };
    } catch {
      return { listings: [] };
    }
  },
  head: () =>
    seo(
      "Destimate — Check property value",
      "Estimate a property's value from the asking prices of similar live ads on Diwaar. Shown only when enough ads exist.",
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
  const [ready, setReady] = useState(false);
  const { listings } = Route.useLoaderData();

  const areaOptions = (AREA_BOOK[city] ?? []).slice();

  const result = useMemo(() => {
    if (!ready) return null;
    const n = Number(size) || 0;
    const sqft = unit === "kanal" ? n * 5445 : unit === "marla" ? n * 272.25 : n;
    if (sqft <= 0) return null;

    // Only live sale ads of the same type count. Area first, then the whole city.
    const sameType = listings.filter((p) => p.city === city && p.category === type);
    const inArea = area ? sameType.filter((p) => p.location === area || p.areaName === area) : [];
    const areaStat = area ? perSqftStat(inArea) : null;
    const stat = areaStat ?? perSqftStat(sameType);
    if (!stat) return { sqft, none: true as const };
    const matched = areaStat ? area : `${city} (all areas)`;
    return {
      sqft,
      none: false as const,
      mid: Math.round(sqft * stat.median),
      low: Math.round(sqft * stat.low),
      high: Math.round(sqft * stat.high),
      perSqft: stat.median,
      n: stat.n,
      matched,
    };
  }, [ready, size, unit, city, type, area, listings]);

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Destimate</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Check a property's value</h1>
      <p className="mt-2 text-sm text-muted">
        Based on the asking price per square foot of similar live sale ads on Diwaar, shown only when at least {MIN_SAMPLE} ads match. This is a guide, not a formal valuation.
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
              options={CITIES.map((c) => ({ value: c, label: c }))}
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
        <button type="submit" className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-fg">
          Get Destimate
        </button>
      </form>

      {result && result.none && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-5">
          <p className="font-semibold text-black">Not enough live ads to estimate this yet</p>
          <p className="mt-2 text-sm text-muted">
            We need at least {MIN_SAMPLE} live sale ads for this property type in {area || city} (or across {city}) before we show a
            figure. We will not guess. You can compare asking prices in a search, or post your own property free.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/search" search={{ purpose: "buy", city, type, ...(area ? { location: area } : {}) }} className="text-primary hover:underline">
              Search similar ads
            </Link>
            <Link to="/add" className="text-primary hover:underline">
              Post your property free
            </Link>
          </div>
        </div>
      )}

      {result && !result.none && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Estimated asking value</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-primary-dark">{formatPkr(result.mid)}</p>
            <p className="mt-2 text-sm text-muted">
              Middle half of ads: {formatPkr(result.low)} – {formatPkr(result.high)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {Math.round(result.sqft).toLocaleString()} sq ft · PKR {Math.round(result.perSqft).toLocaleString()} / sq ft median · {result.matched}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Band label="Low" value={formatPkr(result.low)} />
            <Band label="Mid" value={formatPkr(result.mid)} active />
            <Band label="High" value={formatPkr(result.high)} />
          </div>
          <p className="text-xs text-muted">
            Based on {result.n} live ads on Diwaar in {result.matched}. Asking prices, not sale prices: actual deals can close below
            the asking band.
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
