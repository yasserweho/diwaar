/** Approximate centers for major cities and popular societies in Pakistan.
 * Fallback when geocoding fails.
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
  "DHA Defence": [31.4815, 74.4048],
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
  return [31.5, 74.3];
}

export function scatterAround([lat, lng]: [number, number], index: number, count: number): [number, number] {
  const angle = (index / Math.max(1, count)) * Math.PI * 2;
  const radius = 0.008 + (index % 5) * 0.002;
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
}

// ---------------------------------------------------------------------------
// Geohash (base32) — dependency-free
// Precision 6 ≈ 1.2 km × 0.6 km — good cache cell for property areas
// ---------------------------------------------------------------------------

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

export function encodeGeohash(lat: number, lng: number, precision = 6): string {
  let idx = 0;
  let bit = 0;
  let even = true;
  let hash = "";
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  while (hash.length < precision) {
    if (even) {
      const mid = (lngMin + lngMax) / 2;
      if (lng >= mid) {
        idx = (idx << 1) + 1;
        lngMin = mid;
      } else {
        idx = idx << 1;
        lngMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) {
        idx = (idx << 1) + 1;
        latMin = mid;
      } else {
        idx = idx << 1;
        latMax = mid;
      }
    }
    even = !even;
    if (++bit === 5) {
      hash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }
  return hash;
}

export function decodeGeohash(hash: string): { lat: number; lng: number; error: { lat: number; lng: number } } {
  let even = true;
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  for (const c of hash) {
    const idx = BASE32.indexOf(c);
    if (idx < 0) continue;
    for (let bit = 4; bit >= 0; bit--) {
      const mask = 1 << bit;
      if (even) {
        const mid = (lngMin + lngMax) / 2;
        if (idx & mask) lngMin = mid;
        else lngMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (idx & mask) latMin = mid;
        else latMax = mid;
      }
      even = !even;
    }
  }
  return {
    lat: (latMin + latMax) / 2,
    lng: (lngMin + lngMax) / 2,
    error: { lat: (latMax - latMin) / 2, lng: (lngMax - lngMin) / 2 },
  };
}

// ---------------------------------------------------------------------------
// localStorage geocoding cache keyed by geohash (or query string)
// ---------------------------------------------------------------------------

const CACHE_PREFIX = "diwaar-geo:";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry<T> {
  value: T;
  expires: number;
}

function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expires) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, value: T) {
  try {
    const entry: CacheEntry<T> = { value, expires: Date.now() + CACHE_TTL_MS };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // quota exceeded — ignore
  }
}

const NOMINATIM_UA = "Diwaar.com property portal (https://www.diwaar.com)";

/** Forward geocode with geohash-aware localStorage cache. */
export async function geocodePlace(query: string): Promise<[number, number] | null> {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const cacheKey = "fwd:" + q;
  const cached = cacheGet<[number, number]>(cacheKey);
  if (cached) return cached;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "pk");

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": NOMINATIM_UA },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data.length) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const result: [number, number] = [lat, lng];
    cacheSet(cacheKey, result);
    // also cache under geohash so reverse can reuse nearby points
    cacheSet("geo:" + encodeGeohash(lat, lng, 6), result);
    return result;
  } catch {
    return null;
  }
}

export interface ReverseResult {
  displayName: string;
  city?: string;
  suburb?: string;
  road?: string;
  lat: number;
  lng: number;
}

/** Reverse geocode with geohash cache (precision 6 cell). */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseResult | null> {
  const gh = encodeGeohash(lat, lng, 6);
  const cacheKey = "rev:" + gh;
  const cached = cacheGet<ReverseResult>(cacheKey);
  if (cached) return cached;

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "16");

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": NOMINATIM_UA },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      display_name?: string;
      lat?: string;
      lon?: string;
      address?: Record<string, string>;
    };
    if (!data.display_name) return null;
    const result: ReverseResult = {
      displayName: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      suburb: data.address?.suburb || data.address?.neighbourhood || data.address?.quarter,
      road: data.address?.road,
      lat: parseFloat(data.lat ?? String(lat)),
      lng: parseFloat(data.lon ?? String(lng)),
    };
    cacheSet(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}
