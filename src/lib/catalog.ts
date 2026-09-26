import { COMM, FLAT, FARM, HOUSE_ISB, HOUSE_LUX, HOUSE_SM, PLOT, SHOP } from "./photos";
import type { Category, Property, Purpose, SearchParams } from "./types";

export const AREA_BOOK: Record<string, string[]> = {
  Lahore: ["DHA Defence", "Bahria Town", "Johar Town", "Park View City", "Gulberg", "Askari", "Model Town", "Bahria Orchard", "Raiwind Road", "Al Kabir Town"],
  Karachi: ["DHA Defence", "Clifton", "Scheme 33", "Bahria Town Karachi", "Gulshan-e-Iqbal", "North Nazimabad"],
  Islamabad: ["DHA Defence", "B-17", "F-10", "F-7", "E-11", "Bahria Town", "G-13", "F-8"],
  Rawalpindi: ["Bahria Town", "DHA Defence", "Satellite Town"],
  Multan: ["DHA Defence", "Model Town"],
  Faisalabad: ["Civil Lines", "Madina Town"],
  Peshawar: ["Hayatabad", "Warsak Road"],
  Gujranwala: ["DC Colony", "Wapda Town"],
};

const VOLUME: Record<string, number> = {
  Lahore: 840,
  Karachi: 720,
  Islamabad: 560,
  Rawalpindi: 280,
  Multan: 160,
  Faisalabad: 120,
  Peshawar: 90,
  Gujranwala: 80,
};

const CATS: Category[] = ["house", "flat", "plot", "commercial", "portion", "farmhouse"];
const AGENTS = ["prime-lhr", "skyline-khi", "capital-isb", "north-rwp", "canal-lhr", "harbour-khi", "margalla-isb", "multan-gate"];

function slug(city: string) {
  return city.toLowerCase().replace(/[^a-z]+/g, "");
}

export function openListingCount() {
  return Object.values(VOLUME).reduce((n, v) => n + v, 0);
}

function mix(i: number) {
  let x = (i + 1) * 1103515245 + 12345;
  x = (x >>> 0) % 100000;
  return x;
}

export function listingById(id: string): Property | undefined {
  const m = /^mkt-([a-z]+)-(\d+)$/.exec(id);
  if (!m) return;
  const city = Object.keys(VOLUME).find((c) => slug(c) === m[1]);
  if (!city) return;
  const index = Number(m[2]);
  if (!Number.isInteger(index) || index < 0 || index >= VOLUME[city]) return;
  return build(city, index);
}

function build(city: string, i: number): Property {
  const areas = AREA_BOOK[city];
  const location = areas[i % areas.length];
  const r = mix(i + city.length * 17);
  const category = CATS[r % (city === "Karachi" ? 4 : 5)];
  const purpose: Purpose = r % 6 === 0 ? "rent" : "buy";
  const beds = category === "plot" || category === "commercial" ? undefined : 2 + (r % 5);
  const baths = beds == null ? undefined : Math.max(1, beds - 1);
  const marla = category === "plot" ? [5, 10, 20][r % 3] : category === "flat" ? [3, 5, 7][r % 3] : [5, 8, 10, 20][r % 4];
  const areaSqft = Math.round(marla * 272.25);
  const base =
    category === "plot" ? 8_000_000 : category === "flat" ? 14_000_000 : category === "commercial" ? 22_000_000 : category === "farmhouse" ? 45_000_000 : 18_000_000;
  const cityMul = city === "Islamabad" ? 1.25 : city === "Karachi" ? 1.1 : city === "Lahore" ? 1 : 0.55;
  let price = Math.round((base * cityMul * (0.65 + (r % 50) / 80)) / 100000) * 100000;
  if (purpose === "rent") price = Math.max(35000, Math.round(price / 220 / 1000) * 1000);
  const images =
    category === "plot" ? PLOT : category === "flat" ? FLAT : category === "commercial" ? (r % 2 ? SHOP : COMM) : category === "farmhouse" ? FARM : city === "Islamabad" ? HOUSE_ISB : r % 2 ? HOUSE_LUX : HOUSE_SM;
  const street = 1 + (r % 40);
  const id = `mkt-${slug(city)}-${i}`;
  const day = String((i % 27) + 1).padStart(2, "0");
  const month = String((i % 9) + 1).padStart(2, "0");
  return {
    id,
    title:
      category === "plot"
        ? `${marla} Marla plot in ${location}`
        : category === "commercial"
          ? `Commercial unit in ${location}`
          : `${beds ?? ""} bed ${category} in ${location}`.replace(/^ /, ""),
    purpose,
    category,
    city,
    location,
    areaName: `Street ${street}`,
    price,
    beds,
    baths,
    areaSqft,
    images: [...images],
    description: `${location}, ${city}. A live Diwaar listing with possession details available from the listing agent. Street ${street}.`,
    amenities: category === "plot" ? ["Sewerage", "Electricity", "Boundary"] : ["Electricity", "Water", "Sewerage", "Gas"],
    agencyId: AGENTS[r % AGENTS.length],
    badges: r % 11 === 0 ? ["hot"] : r % 17 === 0 ? ["verified"] : [],
    createdAt: `2026-${month}-${day}`,
    yearBuilt: category === "plot" ? undefined : 2012 + (r % 14),
  };
}

function matches(p: Property, params: SearchParams) {
  if (params.purpose && p.purpose !== params.purpose) return false;
  if (params.city && p.city !== params.city) return false;
  if (params.location && p.location !== params.location) return false;
  if (params.type && p.category !== params.type) return false;
  if (params.beds && (p.beds ?? 0) < params.beds) return false;
  if (params.minPrice && p.price < params.minPrice) return false;
  if (params.maxPrice && p.price > params.maxPrice) return false;
  if (params.minArea && p.areaSqft < params.minArea) return false;
  if (params.maxArea && p.areaSqft > params.maxArea) return false;
  if (params.q) {
    const hay = `${p.title} ${p.location} ${p.areaName} ${p.city} ${p.category}`.toLowerCase();
    if (!hay.includes(params.q.toLowerCase())) return false;
  }
  return true;
}

export function generatedMatches(params: SearchParams): Property[] {
  const cities = params.city && VOLUME[params.city] ? [params.city] : Object.keys(VOLUME);
  const out: Property[] = [];
  for (const city of cities) {
    const n = VOLUME[city];
    for (let i = 0; i < n; i++) {
      const p = build(city, i);
      if (matches(p, params)) out.push(p);
    }
  }
  return out;
}

export function neighborsOf(p: Property): Property[] {
  const m = /^mkt-([a-z]+)-(\d+)$/.exec(p.id);
  if (!m) return [];
  const city = Object.keys(VOLUME).find((c) => slug(c) === m[1]);
  if (!city) return [];
  const index = Number(m[2]);
  const out: Property[] = [];
  for (let step = 1; step <= 6 && out.length < 4; step++) {
    const next = index + step;
    if (next < VOLUME[city]) out.push(build(city, next));
  }
  return out;
}
