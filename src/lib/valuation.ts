import type { Category } from "./types";

/** Typical asking price (PKR) for a reference unit in each city/area.
 *  Derived from TRENDS, area guides, and common Zameen bands.
 *  Reference unit is roughly a 5–10 marla house, a 5 marla plot, or a 1500 sq ft flat.
 */
export interface AreaRate {
  city: string;
  area: string;
  category: Category;
  /** PKR per sq ft asking */
  perSqft: number;
}

export const AREA_RATES: AreaRate[] = [
  // Lahore
  { city: "Lahore", area: "DHA Defence", category: "house", perSqft: 22000 },
  { city: "Lahore", area: "DHA Defence", category: "plot", perSqft: 18000 },
  { city: "Lahore", area: "Bahria Town", category: "house", perSqft: 16000 },
  { city: "Lahore", area: "Bahria Town", category: "plot", perSqft: 12000 },
  { city: "Lahore", area: "Park View City", category: "plot", perSqft: 11000 },
  { city: "Lahore", area: "Park View City", category: "house", perSqft: 14000 },
  { city: "Lahore", area: "Johar Town", category: "house", perSqft: 20000 },
  { city: "Lahore", area: "Gulberg", category: "house", perSqft: 28000 },
  { city: "Lahore", area: "Model Town", category: "house", perSqft: 24000 },
  { city: "Lahore", area: "City average", category: "house", perSqft: 18500 },
  { city: "Lahore", area: "City average", category: "plot", perSqft: 14500 },
  { city: "Lahore", area: "City average", category: "flat", perSqft: 16000 },

  // Karachi
  { city: "Karachi", area: "DHA Defence", category: "flat", perSqft: 24000 },
  { city: "Karachi", area: "DHA Defence", category: "house", perSqft: 26000 },
  { city: "Karachi", area: "DHA Defence", category: "plot", perSqft: 22000 },
  { city: "Karachi", area: "Clifton", category: "flat", perSqft: 32000 },
  { city: "Karachi", area: "Scheme 33", category: "plot", perSqft: 8000 },
  { city: "Karachi", area: "Bahria Town Karachi", category: "house", perSqft: 14000 },
  { city: "Karachi", area: "City average", category: "house", perSqft: 17000 },
  { city: "Karachi", area: "City average", category: "flat", perSqft: 18000 },
  { city: "Karachi", area: "City average", category: "plot", perSqft: 12000 },

  // Islamabad
  { city: "Islamabad", area: "DHA Defence", category: "plot", perSqft: 16000 },
  { city: "Islamabad", area: "DHA Defence", category: "house", perSqft: 20000 },
  { city: "Islamabad", area: "B-17", category: "house", perSqft: 13000 },
  { city: "Islamabad", area: "B-17", category: "plot", perSqft: 9000 },
  { city: "Islamabad", area: "F-10", category: "house", perSqft: 42000 },
  { city: "Islamabad", area: "Gulberg", category: "house", perSqft: 12000 },
  { city: "Islamabad", area: "Bahria Town", category: "house", perSqft: 15000 },
  { city: "Islamabad", area: "City average", category: "house", perSqft: 19000 },
  { city: "Islamabad", area: "City average", category: "plot", perSqft: 14000 },
  { city: "Islamabad", area: "City average", category: "flat", perSqft: 17000 },

  // Rawalpindi
  { city: "Rawalpindi", area: "Bahria Town", category: "house", perSqft: 14500 },
  { city: "Rawalpindi", area: "DHA Defence", category: "plot", perSqft: 13000 },
  { city: "Rawalpindi", area: "City average", category: "house", perSqft: 14000 },
  { city: "Rawalpindi", area: "City average", category: "plot", perSqft: 11000 },

  // Other cities (city averages)
  { city: "Multan", area: "DHA Defence", category: "plot", perSqft: 7000 },
  { city: "Multan", area: "City average", category: "house", perSqft: 9000 },
  { city: "Multan", area: "City average", category: "plot", perSqft: 6500 },
  { city: "Faisalabad", area: "City average", category: "house", perSqft: 8500 },
  { city: "Faisalabad", area: "City average", category: "plot", perSqft: 6000 },
  { city: "Peshawar", area: "City average", category: "house", perSqft: 8000 },
  { city: "Peshawar", area: "City average", category: "plot", perSqft: 5500 },
  { city: "Gujranwala", area: "City average", category: "house", perSqft: 8200 },
  { city: "Gujranwala", area: "City average", category: "plot", perSqft: 5800 },
];

const FALLBACK: Record<string, number> = {
  house: 10000,
  flat: 9000,
  plot: 7000,
  commercial: 14000,
  portion: 8000,
  farmhouse: 6000,
};

/** Find the best per-sqft rate for a city + area + type. */
export function rateFor(city: string, area: string, category: Category): { perSqft: number; matched: string } {
  const exact = AREA_RATES.find((r) => r.city === city && r.area === area && r.category === category);
  if (exact) return { perSqft: exact.perSqft, matched: area };

  const cityType = AREA_RATES.find((r) => r.city === city && r.area === "City average" && r.category === category);
  if (cityType) return { perSqft: cityType.perSqft, matched: "city average" };

  const anyType = AREA_RATES.find((r) => r.city === city && r.category === category);
  if (anyType) return { perSqft: anyType.perSqft, matched: anyType.area };

  return { perSqft: FALLBACK[category] ?? 8000, matched: "national average" };
}

export function areasInCity(city: string): string[] {
  const set = new Set(AREA_RATES.filter((r) => r.city === city && r.area !== "City average").map((r) => r.area));
  return [...set].sort();
}
