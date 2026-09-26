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
  badges: Badge[];
  createdAt: string;
  featured?: boolean;
  plotType?: "residential" | "commercial" | "agricultural";
  furnished?: "furnished" | "semi" | "unfurnished";
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  city: string;
  phone: string;
  listings: number;
  experience: number;
  specialty: string;
  initials: string;
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
  avgHouse: number;
  avgPlot: number;
  avgRent: number;
  highlights: string[];
  trend: { year: string; house: number; plot: number }[];
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
}

export const CATEGORY_LABEL: Record<Category, string> = {
  house: "House",
  flat: "Flat",
  plot: "Plot",
  commercial: "Commercial",
  portion: "Portion",
  farmhouse: "Farm House",
};

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Peshawar",
  "Gujranwala",
] as const;
