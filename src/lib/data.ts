import { HOUSE_ISB, HOUSE_LUX, HOUSE_SM, PENT, PLOT } from "./photos";
import { AREA_BOOK, listingById, neighborsOf } from "./catalog";
import { ARTICLES } from "./articles";
import type { AreaGuide, BlogPost, Project, Property, SearchParams } from "./types";

export const PROPERTIES: Property[] = [];

export const PROJECTS: Project[] = [];

export const GUIDES: AreaGuide[] = [
  {
    slug: "dha-lahore",
    name: "DHA Defence",
    city: "Lahore",
    overview:
      "Lahore's most established gated address. Phases 5–8 lead house demand; Rahbar is the entry ticket. Commercial broadway in Phase 5 is the lifestyle core.",
    highlights: ["Gated security", "International schools", "Phase 5 broadway", "Strong resale"],
    image: HOUSE_LUX[0],
  },
  {
    slug: "bahria-lahore",
    name: "Bahria Town",
    city: "Lahore",
    overview:
      "Self-contained city on the canal and Raiwind side. Sectors C–F are occupied; Orchard is the plot play. Amenities are the draw: safari, cinema, hospitals.",
    highlights: ["Theme park & safari", "24/7 security", "Hospitals & schools", "Ready sectors"],
    image: HOUSE_SM[0],
  },
  {
    slug: "dha-karachi",
    name: "DHA Defence",
    city: "Karachi",
    overview:
      "Karachi's premium south. Phase 6 and 8 command 500-yard houses; Creek and Phase 5 lead apartments. Ittehad and Bukhari are the retail streets.",
    highlights: ["Sea breeze", "Khayaban commercial", "Schools & clubs", "Title security"],
    image: HOUSE_LUX[0],
  },
  {
    slug: "clifton-karachi",
    name: "Clifton",
    city: "Karachi",
    overview:
      "Apartment-first neighbourhood against the sea. Block 2 and 5 are the investment core; Sea View penthouses are the trophy stock.",
    highlights: ["Sea View", "Boat Basin", "High-rises", "End-user demand"],
    image: PENT[0],
  },
  {
    slug: "f-sectors-islamabad",
    name: "F-Sectors",
    city: "Islamabad",
    areaPrefix: "F-",
    overview:
      "The capital's original sectors. F-6 and F-7 are diplomatic; F-10 and F-11 mix houses and flats. CDA leasehold, scarce plots, durable rents.",
    highlights: ["Margalla views", "Markaz retail", "Embassies", "CDA planning"],
    image: HOUSE_ISB[0],
  },
  {
    slug: "bahria-rawalpindi",
    name: "Bahria Town",
    city: "Rawalpindi",
    overview:
      "The twin cities' largest private society. Phase 7–8 are the live sectors; Expressway access is the lifestyle unlock.",
    highlights: ["Expressway", "Bahria hospital", "Golf & clubs", "Deep occupancy"],
    image: HOUSE_SM[0],
  },
];

const SHORT_POSTS: BlogPost[] = [
  {
    slug: "kanal-vs-marla",
    title: "Kanal, Marla and Square Yards — a buyer’s cheat sheet",
    excerpt: "Punjab talks Marla. Karachi talks yards. Here is how to convert without getting burned.",
    body: [
      "Revenue records in Punjab use a Marla of 272.25 square feet, but LDA’s building regulations define a Marla as 225 sq ft in Lahore District (272 sq ft in other Punjab districts). 1 Kanal is always 20 Marla: 4,500 or 5,445 sq ft depending on which Marla is meant. Karachi listings usually quote square yards (9 sq ft each), so a 500-yard DHA house is about 4,500 sq ft, the same as a 225-sq-ft-Marla Kanal.",
      "Always ask which Marla the seller means, and ask for the plot dimensions in feet. Diwaar stores every listing in square feet and lets you switch the display unit in the header.",
      "For plots, frontage matters as much as area. A 30-foot road 5 Marla will rent faster than a 20-foot road 5 Marla in the same block.",
    ],
    date: "2026-08-12",
    tag: "Guides",
    image: PLOT[0],
  },
  {
    slug: "dha-lahore-2026",
    title: "Buying in DHA Lahore: what to check before you pay a token",
    excerpt: "Phase, possession and paperwork matter more than a headline price. How to compare asking prices honestly.",
    body: [
      "Prices in DHA Lahore vary a lot by phase, block, plot size, road width and finishing, so one average figure tells you little. Compare like with like: the same phase, the same size and the same stage (file, possession plot or constructed house).",
      "Use asking prices from live ads as a starting point, not a sale price. The DHA Lahore area guide on Diwaar shows a median only once at least 5 live ads back it, and says how many ads it is based on.",
      "If you are investing, occupied streets with a park or commercial nearby usually carry less risk than undeveloped files. Confirm the file and the transfer charges with DHA before you pay a token.",
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

/** Long-form articles from src/content/blog first (newest), then the short notes. */
export const POSTS: BlogPost[] = [...ARTICLES, ...SHORT_POSTS];

/** True when a live ad sits inside the area an area guide covers. */
export function inGuide(g: AreaGuide, p: Property) {
  if (p.city !== g.city) return false;
  const loc = p.location;
  return (
    loc === g.name ||
    p.areaName === g.name ||
    loc.startsWith(`${g.name} `) ||
    (!!g.areaPrefix && loc.startsWith(g.areaPrefix))
  );
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
