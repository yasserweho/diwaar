import { HOUSE_ISB, HOUSE_LUX, HOUSE_SM, PENT, PLOT } from "./photos";
import { AREA_BOOK, listingById, neighborsOf } from "./catalog";
import type { Agent, AreaGuide, BlogPost, Project, Property, SearchParams } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "prime-lhr",
    name: "Hassan Malik",
    agency: "Prime Properties",
    city: "Lahore",
    phone: "03008451211",
    listings: 0,
    experience: 14,
    specialty: "DHA, Bahria Town & Gulberg",
    initials: "HM",
  },
  {
    id: "skyline-khi",
    name: "Ayesha Qureshi",
    agency: "Skyline Realtors",
    city: "Karachi",
    phone: "03215550908",
    listings: 0,
    experience: 9,
    specialty: "DHA, Clifton & Sea View",
    initials: "AQ",
  },
  {
    id: "capital-isb",
    name: "Omar Khattak",
    agency: "Capital Homes",
    city: "Islamabad",
    phone: "03335678102",
    listings: 0,
    experience: 11,
    specialty: "F-sectors, DHA & B-17",
    initials: "OK",
  },
  {
    id: "north-rwp",
    name: "Sana Raza",
    agency: "Northgate Associates",
    city: "Rawalpindi",
    phone: "03124789011",
    listings: 0,
    experience: 7,
    specialty: "Bahria Town & DHA",
    initials: "SR",
  },
  {
    id: "canal-lhr",
    name: "Bilal Sheikh",
    agency: "Canal View Estates",
    city: "Lahore",
    phone: "03027773445",
    listings: 0,
    experience: 16,
    specialty: "Johar Town, Model Town, Al Kabir",
    initials: "BS",
  },
  {
    id: "harbour-khi",
    name: "Farhan Ali",
    agency: "Harbour Block",
    city: "Karachi",
    phone: "03452119876",
    listings: 0,
    experience: 8,
    specialty: "Scheme 33, Gulshan, Jauhar",
    initials: "FA",
  },
  {
    id: "margalla-isb",
    name: "Nadia Rehman",
    agency: "Margalla Listings",
    city: "Islamabad",
    phone: "03009881234",
    listings: 0,
    experience: 6,
    specialty: "E-11, F-10, apartments",
    initials: "NR",
  },
  {
    id: "multan-gate",
    name: "Usman Javed",
    agency: "Chenab Realty",
    city: "Multan",
    phone: "03016334455",
    listings: 0,
    experience: 10,
    specialty: "DHA Multan & Model Town",
    initials: "UJ",
  },
];

export const PROPERTIES: Property[] = [];

export const PROJECTS: Project[] = [];

export const GUIDES: AreaGuide[] = [
  {
    slug: "dha-lahore",
    name: "DHA Defence",
    city: "Lahore",
    overview:
      "Lahore's most established gated address. Phases 5–8 lead house demand; Rahbar is the entry ticket. Commercial broadway in Phase 5 is the lifestyle core.",
    avgHouse: 45_000_000,
    avgPlot: 22_000_000,
    avgRent: 220_000,
    highlights: ["Gated security", "International schools", "Phase 5 broadway", "Strong resale"],
    trend: [
      { year: "2022", house: 32, plot: 16 },
      { year: "2023", house: 36, plot: 18 },
      { year: "2024", house: 40, plot: 20 },
      { year: "2025", house: 43, plot: 21 },
      { year: "2026", house: 45, plot: 22 },
    ],
    image: HOUSE_LUX[0],
  },
  {
    slug: "bahria-lahore",
    name: "Bahria Town",
    city: "Lahore",
    overview:
      "Self-contained city on the canal and Raiwind side. Sectors C–F are occupied; Orchard is the plot play. Amenities are the draw: safari, cinema, hospitals.",
    avgHouse: 19_000_000,
    avgPlot: 6_500_000,
    avgRent: 80_000,
    highlights: ["Theme park & safari", "24/7 security", "Hospitals & schools", "Ready sectors"],
    trend: [
      { year: "2022", house: 14, plot: 4.2 },
      { year: "2023", house: 15.5, plot: 4.8 },
      { year: "2024", house: 17, plot: 5.5 },
      { year: "2025", house: 18, plot: 6.1 },
      { year: "2026", house: 19, plot: 6.5 },
    ],
    image: HOUSE_SM[0],
  },
  {
    slug: "dha-karachi",
    name: "DHA Defence",
    city: "Karachi",
    overview:
      "Karachi's premium south. Phase 6 and 8 command 500-yard houses; Creek and Phase 5 lead apartments. Ittehad and Bukhari are the retail streets.",
    avgHouse: 85_000_000,
    avgPlot: 55_000_000,
    avgRent: 250_000,
    highlights: ["Sea breeze", "Khayaban commercial", "Schools & clubs", "Title security"],
    trend: [
      { year: "2022", house: 62, plot: 40 },
      { year: "2023", house: 70, plot: 44 },
      { year: "2024", house: 76, plot: 48 },
      { year: "2025", house: 81, plot: 52 },
      { year: "2026", house: 85, plot: 55 },
    ],
    image: HOUSE_LUX[0],
  },
  {
    slug: "clifton-karachi",
    name: "Clifton",
    city: "Karachi",
    overview:
      "Apartment-first neighbourhood against the sea. Block 2 and 5 are the investment core; Sea View penthouses are the trophy stock.",
    avgHouse: 48_000_000,
    avgPlot: 90_000_000,
    avgRent: 160_000,
    highlights: ["Sea View", "Boat Basin", "High-rises", "End-user demand"],
    trend: [
      { year: "2022", house: 36, plot: 70 },
      { year: "2023", house: 40, plot: 76 },
      { year: "2024", house: 43, plot: 82 },
      { year: "2025", house: 46, plot: 86 },
      { year: "2026", house: 48, plot: 90 },
    ],
    image: PENT[0],
  },
  {
    slug: "f-sectors-islamabad",
    name: "F-Sectors",
    city: "Islamabad",
    overview:
      "The capital's original sectors. F-6 and F-7 are diplomatic; F-10 and F-11 mix houses and flats. CDA leasehold, scarce plots, durable rents.",
    avgHouse: 140_000_000,
    avgPlot: 180_000_000,
    avgRent: 320_000,
    highlights: ["Margalla views", "Markaz retail", "Embassies", "CDA planning"],
    trend: [
      { year: "2022", house: 110, plot: 140 },
      { year: "2023", house: 120, plot: 150 },
      { year: "2024", house: 128, plot: 162 },
      { year: "2025", house: 135, plot: 172 },
      { year: "2026", house: 140, plot: 180 },
    ],
    image: HOUSE_ISB[0],
  },
  {
    slug: "bahria-rawalpindi",
    name: "Bahria Town",
    city: "Rawalpindi",
    overview:
      "The twin cities' largest private society. Phase 7–8 are the live sectors; Expressway access is the lifestyle unlock.",
    avgHouse: 22_000_000,
    avgPlot: 8_000_000,
    avgRent: 90_000,
    highlights: ["Expressway", "Bahria hospital", "Golf & clubs", "Deep occupancy"],
    trend: [
      { year: "2022", house: 16, plot: 5.5 },
      { year: "2023", house: 18, plot: 6.2 },
      { year: "2024", house: 19.5, plot: 7 },
      { year: "2025", house: 21, plot: 7.6 },
      { year: "2026", house: 22, plot: 8 },
    ],
    image: HOUSE_SM[0],
  },
];

export const POSTS: BlogPost[] = [
  {
    slug: "kanal-vs-marla",
    title: "Kanal, Marla and Square Yards — a buyer’s cheat sheet",
    excerpt: "Punjab talks Marla. Karachi talks yards. Here is how to convert without getting burned.",
    body: [
      "In Punjab and Islamabad, 1 Marla is 272.25 square feet and 1 Kanal is 20 Marla (5,445 sq ft). Karachi listings usually quote square yards (9 sq ft each), so a 500-yard DHA house is about 4,500 sq ft — just under a Lahore Kanal.",
      "Always ask which Marla the seller means. Some older files still use 225 sq ft. Diwaar stores every listing in square feet and lets you switch the display unit in the header.",
      "For plots, frontage matters as much as area. A 30-foot road 5 Marla will rent faster than a 20-foot road 5 Marla in the same block.",
    ],
    date: "2026-08-12",
    tag: "Guides",
    image: PLOT[0],
  },
  {
    slug: "dha-lahore-2026",
    title: "Where DHA Lahore prices actually moved in 2026",
    excerpt: "Phase 5 held. Rahbar absorbed first-time demand. Files in new sectors cooled.",
    body: [
      "Constructed 1 Kanal in Phase 5 and 6 still clears between 4.5 and 6.5 Crore depending on block and finishing. 10 Marla inventory in Phase 6 is the sweet spot for upgraders leaving Bahria.",
      "DHA Rahbar remains the volume story: 5 Marla houses around 1.3–1.6 Crore with genuine end-user traffic. Plot files in newer phases are slower — cash buyers prefer possession.",
      "If you are investing, occupied streets with a park or commercial nearby still beat paper profits on undeveloped files.",
    ],
    date: "2026-08-04",
    tag: "Market",
    image: HOUSE_LUX[0],
  },
  {
    slug: "home-loan-pakistan",
    title: "Home loans in Pakistan: what 2026 rates mean for a 5 Marla",
    excerpt: "Markup is still high. The calculator on Diwaar shows why a larger down payment wins.",
    body: [
      "Bank housing markup has eased from the 2023 peak but still sits in the mid-to-high teens for conventional products. Islamic diminishing musharakah is similar once you include rent.",
      "On a 1.5 Crore house with 30% down over 15 years, the monthly instalment can rival DHA rents. Run the numbers on Tools before you sign a token.",
      "Some developers still offer in-house plans at 0% markup with a higher list price — compare the total outflow, not the headline rate.",
    ],
    date: "2026-07-22",
    tag: "Finance",
    image: HOUSE_SM[0],
  },
  {
    slug: "first-house-checklist",
    title: "First house in Lahore: a 12-point paperwork checklist",
    excerpt: "Token is not a contract. Registry, fard, tax and society NOC still decide if you own it.",
    body: [
      "Ask for a recent fard, CNIC of the owner, society transfer rules and any surviving bank charge. In DHA, confirm the membership and transfer fee before you lock a date.",
      "Check commercialisation status on corner plots — a residential price on a commercialised plot is a gift; the reverse is a trap.",
      "Walk the house at noon and at night. Water pressure, sewer smell and generator load only show up when the street is alive.",
    ],
    date: "2026-07-08",
    tag: "Guides",
    image: HOUSE_SM[0],
  },
];

export function getAgent(id: string) {
  return AGENTS.find((a) => a.id === id);
}

export function getProperty(id: string, extra: Property[] = []) {
  return extra.find((p) => p.id === id) ?? PROPERTIES.find((p) => p.id === id) ?? listingById(id);
}

export function locationsInCity(city: string, extra: Property[] = []): string[] {
  const set = new Set<string>(AREA_BOOK[city] ?? []);
  for (const p of [...extra, ...PROPERTIES]) {
    if (p.city === city) set.add(p.location);
  }
  return [...set].sort();
}

export function filterProperties(list: Property[], params: SearchParams): Property[] {
  let out = list.filter((p) => {
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
  });
  switch (params.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case "area-desc":
      out = [...out].sort((a, b) => b.areaSqft - a.areaSqft);
      break;
    default:
      out = [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return out;
}

export function similarTo(p: Property, extra: Property[] = []): Property[] {
  const curated = [...extra, ...PROPERTIES]
    .filter(
      (x) =>
        x.id !== p.id &&
        x.purpose === p.purpose &&
        (x.city === p.city || x.category === p.category),
    )
    .slice(0, 4);
  if (curated.length >= 4) return curated;
  return [...curated, ...neighborsOf(p)].slice(0, 4);
}

export function countByLocation(city: string, purpose: "buy" | "rent", category?: Property["category"]) {
  const map = new Map<string, number>();
  for (const p of PROPERTIES) {
    if (p.city !== city || p.purpose !== purpose) continue;
    if (category && p.category !== category) continue;
    map.set(p.location, (map.get(p.location) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
