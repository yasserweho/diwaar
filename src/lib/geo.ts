/** Approximate centers for major cities and popular societies in Pakistan.
 * Used for map search until precise lat/lng is stored on each listing.
 */
export const CITY_CENTERS: Record<string, [number, number]> = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Rawalpindi: [33.5651, 73.0169],
  Multan: [30.1575, 71.5249],
  Faisalabad: [31.4504, 73.1350],
  Peshawar: [34.0151, 71.5249],
  Gujranwala: [32.1877, 74.1945],
};

export const LOCATION_CENTERS: Record<string, [number, number]> = {
  "DHA Defence": [31.4815, 74.4048], // Lahore approx
  "Bahria Town": [31.3667, 74.1833],
  "Gulberg": [31.5167, 74.3500],
  "Johar Town": [31.4697, 74.2728],
  "Model Town": [31.4833, 74.3333],
  "F-6": [33.7278, 73.0733],
  "F-7": [33.7200, 73.0600],
  "F-10": [33.6960, 73.0160],
  "F-11": [33.6840, 73.0000],
  "Clifton": [24.8138, 67.0300],
  "DHA Karachi": [24.8100, 67.0300],
};

export function getApproxCoords(city?: string, location?: string): [number, number] {
  if (location && LOCATION_CENTERS[location]) return LOCATION_CENTERS[location];
  if (city && CITY_CENTERS[city]) return CITY_CENTERS[city];
  return [31.5, 74.3]; // fallback Pakistan center-ish
}

export function scatterAround([lat, lng]: [number, number], index: number, count: number): [number, number] {
  const angle = (index / Math.max(1, count)) * Math.PI * 2;
  const radius = 0.008 + (index % 5) * 0.002; // ~1km jitter
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
}
