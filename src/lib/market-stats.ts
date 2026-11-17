import type { Category, Property } from "./types";

/**
 * Price figures on Diwaar come only from live public ads. A figure is shown
 * only when at least MIN_SAMPLE ads back it, and it is always labelled with
 * the number of ads it was computed from. There are no hard-coded averages,
 * growth rates or trend lines anywhere on the site.
 */
export const MIN_SAMPLE = 5;

export interface PriceStat {
  /** Median asking price (PKR). For rent, per month. */
  median: number;
  /** 25th percentile asking price. */
  low: number;
  /** 75th percentile asking price. */
  high: number;
  /** Number of live ads the figure is computed from. */
  n: number;
}

function quantile(sorted: number[], q: number) {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo));
}

/** Median and quartiles of `values`, or null when fewer than MIN_SAMPLE values. */
export function priceStat(values: number[]): PriceStat | null {
  const clean = values.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (clean.length < MIN_SAMPLE) return null;
  return {
    median: quantile(clean, 0.5),
    low: quantile(clean, 0.25),
    high: quantile(clean, 0.75),
    n: clean.length,
  };
}

export interface AreaPriceSummary {
  /** Houses for sale (house, farmhouse). */
  saleHouse: PriceStat | null;
  /** Plots for sale. */
  salePlot: PriceStat | null;
  /** Flats for sale. */
  saleFlat: PriceStat | null;
  /** Monthly rent, any home type. */
  rent: PriceStat | null;
  /** Number of live ads looked at. */
  total: number;
}

const HOME: Category[] = ["house", "farmhouse"];

export function summarizePrices(listings: Property[]): AreaPriceSummary {
  const sale = listings.filter((p) => p.purpose === "buy");
  return {
    saleHouse: priceStat(sale.filter((p) => HOME.includes(p.category)).map((p) => p.price)),
    salePlot: priceStat(sale.filter((p) => p.category === "plot").map((p) => p.price)),
    saleFlat: priceStat(sale.filter((p) => p.category === "flat").map((p) => p.price)),
    rent: priceStat(
      listings.filter((p) => p.purpose === "rent" && p.category !== "commercial" && p.category !== "plot").map((p) => p.price),
    ),
    total: listings.length,
  };
}

export function hasAnyStat(s: AreaPriceSummary) {
  return !!(s.saleHouse || s.salePlot || s.saleFlat || s.rent);
}

/** Asking price per square foot for sale ads, for the value estimate. */
export function perSqftStat(listings: Property[]): PriceStat | null {
  return priceStat(
    listings.filter((p) => p.purpose === "buy" && p.areaSqft > 0).map((p) => p.price / p.areaSqft),
  );
}

export interface GroupStat {
  city: string;
  location: string;
  category: Category;
  purpose: "buy" | "rent";
  stat: PriceStat;
}

/** Median asking price per city + area + type + purpose, only for groups with MIN_SAMPLE+ ads. */
export function groupStats(listings: Property[], by: "area" | "city" = "area"): GroupStat[] {
  const groups = new Map<string, Property[]>();
  for (const p of listings) {
    const loc = by === "city" ? "" : p.location;
    const key = `${p.city}\u0001${loc}\u0001${p.category}\u0001${p.purpose}`;
    const list = groups.get(key);
    if (list) list.push(p);
    else groups.set(key, [p]);
  }
  const out: GroupStat[] = [];
  for (const [key, list] of groups) {
    const stat = priceStat(list.map((p) => p.price));
    if (!stat) continue;
    const [city, location, category, purpose] = key.split("\u0001");
    out.push({ city, location, category: category as Category, purpose: purpose as "buy" | "rent", stat });
  }
  return out.sort((a, b) => b.stat.n - a.stat.n || a.city.localeCompare(b.city));
}
