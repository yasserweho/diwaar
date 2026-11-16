import { CATEGORY_LABEL, CITIES, type Category, type Property, type Purpose } from "./types";

/** An ad is hidden from the public once this many different accounts report it. */
export const REPORTS_TO_HIDE = 3;

/** Ids posted from /add look like `user-<timestamp>`; only those are public ads. */
export const PUBLIC_ID = /^user-\d{6,20}$/;

const CITY_SET = new Set<string>(CITIES);

function text(value: unknown, max: number) {
  return String(value ?? "")
    // eslint-disable-next-line no-control-regex -- strip control characters from user text
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function longText(value: unknown, max: number) {
  return String(value ?? "")
    // eslint-disable-next-line no-control-regex -- keep newlines, strip other control characters
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

function num(value: unknown, max: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n <= max ? n : undefined;
}

function safeImage(src: unknown) {
  if (typeof src !== "string" || src.length > 500) return undefined;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  if (src.startsWith("https://")) return src;
  return undefined;
}

/**
 * Turn a stored ad payload into the public shape, or undefined when it is not
 * fit to publish. Only fields the poster typed into the ad are kept: no account
 * id, email or other account data ever leaves the server. Badges such as
 * "verified" are dropped because the poster could set them themselves.
 */
export function toPublicListing(raw: unknown): Property | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const p = raw as Record<string, unknown>;
  const id = text(p.id, 40);
  if (!PUBLIC_ID.test(id)) return undefined;
  const purpose: Purpose | undefined = p.purpose === "rent" ? "rent" : p.purpose === "buy" ? "buy" : undefined;
  const category = typeof p.category === "string" && p.category in CATEGORY_LABEL ? (p.category as Category) : undefined;
  const city = text(p.city, 60);
  const location = text(p.location, 120);
  const title = text(p.title, 120);
  const price = num(p.price, 1e12);
  const areaSqft = num(p.areaSqft, 1e9);
  const contactName = text(p.contactName, 60);
  const contactPhone = String(p.contactPhone ?? "").replace(/[^\d+]/g, "").slice(0, 16);
  // Required fields: an ad without these is not shown publicly.
  if (!purpose || !category || !CITY_SET.has(city) || location.length < 2 || title.length < 5) return undefined;
  if (!price || !areaSqft || contactName.length < 2 || contactPhone.replace(/\D/g, "").length < 10) return undefined;

  const images = (Array.isArray(p.images) ? p.images : []).map(safeImage).filter((s): s is string => !!s).slice(0, 12);
  const created = text(p.createdAt, 30);
  const lat = num(Math.abs(Number(p.lat)), 90) ? Number(p.lat) : undefined;
  const lng = num(Math.abs(Number(p.lng)), 180) ? Number(p.lng) : undefined;
  const furnished = p.furnished === "furnished" || p.furnished === "semi" || p.furnished === "unfurnished" ? p.furnished : undefined;
  return {
    id,
    title,
    purpose,
    category,
    city,
    location,
    areaName: text(p.areaName, 120) || location,
    price,
    beds: num(p.beds, 50) ? Math.round(Number(p.beds)) : undefined,
    baths: num(p.baths, 50) ? Math.round(Number(p.baths)) : undefined,
    areaSqft,
    images: images.length ? images : ["/images/house-marla.jpg"],
    description: longText(p.description, 3000) || `${title} in ${location}, ${city}.`,
    amenities: (Array.isArray(p.amenities) ? p.amenities : []).map((a) => text(a, 40)).filter(Boolean).slice(0, 20),
    yearBuilt: num(p.yearBuilt, 2100) ? Math.round(Number(p.yearBuilt)) : undefined,
    floors: num(p.floors, 200) ? Math.round(Number(p.floors)) : undefined,
    agencyId: "owner",
    contactName,
    contactPhone,
    badges: [],
    createdAt: /^\d{4}-\d{2}-\d{2}/.test(created) ? created.slice(0, 10) : new Date(Number(id.slice(5))).toISOString().slice(0, 10),
    furnished,
    lat,
    lng,
  };
}
