export type Purpose = "buy" | "rent";

export type Category =
  | "house"
  | "flat"
  | "plot"
  | "commercial"
  | "portion"
  | "farmhouse";

export type Badge = "hot" | "superhot" | "verified" | "featured" | "platinum";

export interface Property {
  id: string;
  title: string;
  purpose: Purpose;
  category: Category;
  city: string;
  location: string;
  areaName: string;
  price: number;
  beds?: number;
  baths?: number;
  areaSqft: number;
  images: string[];
  description: string;
  amenities: string[];
  yearBuilt?: number;
  floors?: number;
  agencyId: string;
  /** Name shown on ads you post. Not an agency. */
  contactName?: string;
  /** Phone shown on ads you post. */
  contactPhone?: string;
  badges: Badge[];
  createdAt: string;
  featured?: boolean;
  plotType?: "residential" | "commercial" | "agricultural";
  furnished?: "furnished" | "semi" | "unfurnished";
  /** Precise latitude from geocoding or pin drop. */
  lat?: number;
  /** Precise longitude from geocoding or pin drop. */
  lng?: number;
}

export interface Project {
  id: string;
  name: string;
  city: string;
  location: string;
  developer: string;
  status: "Launch" | "Under Construction" | "Ready";
  priceFrom: number;
  types: string[];
  description: string;
  images: string[];
  paymentPlan: string;
  size: string;
}

export interface AreaGuide {
  slug: string;
  name: string;
  city: string;
  overview: string;
  /** Live ads whose area starts with this prefix also count for the guide (e.g. "F-" for F-6, F-10). */
  areaPrefix?: string;
  highlights: string[];
  image: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  tag: string;
  image: string;
  /** Markdown body for long-form articles (rendered instead of `body`). */
  markdown?: string;
  /** Article language; Urdu posts render right-to-left. Defaults to "en". */
  lang?: "en" | "ur";
  /** Search-result title when it should differ from the on-page H1. */
  metaTitle?: string;
}

export interface SearchParams {
  purpose?: Purpose;
  city?: string;
  location?: string;
  type?: Category | "";
  beds?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "area-desc";
  q?: string;
  page?: number;
  /** "map" opens the map view on /search. */
  view?: "list" | "map";
}

export const CATEGORY_LABEL: Record<Category, string> = {
  house: "House",
  flat: "Flat",
  plot: "Plot",
  commercial: "Commercial",
  portion: "Portion",
  farmhouse: "Farm House",
};

export { CITIES } from "./locations";
