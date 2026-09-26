import type { Category, SearchParams } from "./types";

export interface Society {
  id: string;
  name: string;
  city: string;
  location: string;
}

export const SOCIETIES: Society[] = [
  { id: "dha-lhr-5", name: "DHA Lahore Phase 5", city: "Lahore", location: "DHA Defence" },
  { id: "dha-lhr-6", name: "DHA Lahore Phase 6", city: "Lahore", location: "DHA Defence" },
  { id: "bahria-lhr", name: "Bahria Town Lahore", city: "Lahore", location: "Bahria Town" },
  { id: "park-view", name: "Park View City", city: "Lahore", location: "Park View City" },
  { id: "dha-khi-8", name: "DHA Karachi Phase 8", city: "Karachi", location: "DHA Defence" },
  { id: "scheme-33", name: "Scheme 33", city: "Karachi", location: "Scheme 33" },
  { id: "bahria-khi", name: "Bahria Town Karachi", city: "Karachi", location: "Bahria Town Karachi" },
  { id: "dha-isb", name: "DHA Islamabad", city: "Islamabad", location: "DHA Defence" },
  { id: "bahria-isb", name: "Bahria Town Islamabad", city: "Islamabad", location: "Bahria Town" },
  { id: "b17", name: "B-17", city: "Islamabad", location: "B-17" },
  { id: "gulberg-grn", name: "Gulberg Greens", city: "Islamabad", location: "Gulberg" },
  { id: "dha-rwp", name: "DHA Rawalpindi", city: "Rawalpindi", location: "DHA Defence" },
];

export interface IndexPoint {
  year: string;
  house: number;
  plot: number;
  flat: number;
}

const climb = (start: number, steps: number[]): IndexPoint[] => {
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  let house = start;
  let plot = start + 4;
  let flat = start - 6;
  return years.map((year, i) => {
    if (i > 0) {
      house = Math.round(house * steps[0]);
      plot = Math.round(plot * steps[1]);
      flat = Math.round(flat * steps[2]);
    }
    return { year, house, plot, flat };
  });
};

export const PRICE_INDEX: Record<string, IndexPoint[]> = {
  Lahore: climb(100, [1.11, 1.14, 1.08]),
  Karachi: climb(100, [1.09, 1.12, 1.1]),
  Islamabad: climb(100, [1.1, 1.13, 1.09]),
  Rawalpindi: climb(96, [1.1, 1.12, 1.08]),
  Multan: climb(88, [1.12, 1.15, 1.07]),
  Faisalabad: climb(84, [1.09, 1.11, 1.06]),
  Peshawar: climb(80, [1.08, 1.1, 1.07]),
  Gujranwala: climb(82, [1.09, 1.11, 1.06]),
};

export interface TrendRow {
  city: string;
  location: string;
  category: Category;
  change: number;
  demand: "High" | "Steady" | "Cooling";
  avg: number;
}

export const TRENDS: TrendRow[] = [
  { city: "Lahore", location: "DHA Defence", category: "plot", change: 22, demand: "High", avg: 18500000 },
  { city: "Lahore", location: "Bahria Town", category: "house", change: 14, demand: "High", avg: 32000000 },
  { city: "Lahore", location: "Park View City", category: "plot", change: 19, demand: "High", avg: 12500000 },
  { city: "Lahore", location: "Johar Town", category: "house", change: 8, demand: "Steady", avg: 42000000 },
  { city: "Karachi", location: "DHA Defence", category: "flat", change: 11, demand: "High", avg: 28000000 },
  { city: "Karachi", location: "Scheme 33", category: "plot", change: 17, demand: "High", avg: 9000000 },
  { city: "Karachi", location: "Clifton", category: "flat", change: 6, demand: "Steady", avg: 55000000 },
  { city: "Islamabad", location: "DHA Defence", category: "plot", change: 16, demand: "High", avg: 15000000 },
  { city: "Islamabad", location: "B-17", category: "house", change: 13, demand: "High", avg: 24000000 },
  { city: "Islamabad", location: "F-10", category: "house", change: 4, demand: "Steady", avg: 95000000 },
  { city: "Rawalpindi", location: "Bahria Town", category: "house", change: 9, demand: "Steady", avg: 27500000 },
  { city: "Multan", location: "DHA Defence", category: "plot", change: 15, demand: "High", avg: 7000000 },
];

export interface CityCard {
  city: string;
  province: string;
  focus: string;
  societies: string;
}

export const CITY_DIRECTORY: CityCard[] = [
  { city: "Lahore", province: "Punjab", focus: "Houses, plots, flats", societies: "DHA, Bahria, Park View, Johar Town" },
  { city: "Karachi", province: "Sindh", focus: "Flats and plots", societies: "DHA, Clifton, Scheme 33, Bahria" },
  { city: "Islamabad", province: "Capital", focus: "Plots and houses", societies: "DHA, B-17, F-sectors, Gulberg" },
  { city: "Rawalpindi", province: "Punjab", focus: "Bahria and DHA", societies: "Bahria Town, DHA, Satellite Town" },
  { city: "Multan", province: "Punjab", focus: "Houses and plots", societies: "DHA Multan, Model Town" },
  { city: "Faisalabad", province: "Punjab", focus: "Houses", societies: "Civil Lines, Madina Town" },
  { city: "Peshawar", province: "Khyber Pakhtunkhwa", focus: "Houses", societies: "Hayatabad, Warsak Road" },
  { city: "Gujranwala", province: "Punjab", focus: "Houses and plots", societies: "DC Colony, Wapda Town" },
];

export interface InvestDeal {
  id: string;
  name: string;
  city: string;
  kind: string;
  yieldPct: number;
  minTicket: number;
  term: string;
  status: "Open" | "Filling" | "Reserved";
  blurb: string;
}

export const INVEST: InvestDeal[] = [
  { id: "blk-lhr-1", name: "DHA Phase 6 file block", city: "Lahore", kind: "Plot files", yieldPct: 18, minTicket: 2500000, term: "18 months", status: "Open", blurb: "A pooled allocation of 5-marla files, exit on transfer or resale." },
  { id: "blk-khi-1", name: "Scheme 33 commercial strip", city: "Karachi", kind: "Commercial", yieldPct: 14, minTicket: 5000000, term: "24 months", status: "Filling", blurb: "Ground-floor shops on a booked 120-ft road, rent after possession." },
  { id: "blk-isb-1", name: "B-17 residential pair", city: "Islamabad", kind: "Houses", yieldPct: 12, minTicket: 8000000, term: "12 months", status: "Open", blurb: "Two 10-marla grey structures, finish and sell or rent." },
  { id: "blk-rwp-1", name: "Bahria civic centre shops", city: "Rawalpindi", kind: "Shops", yieldPct: 11, minTicket: 3500000, term: "36 months", status: "Reserved", blurb: "Booked retail facing the civic centre parking." },
  { id: "blk-lhr-2", name: "Park View City 10-marla pool", city: "Lahore", kind: "Plots", yieldPct: 16, minTicket: 4000000, term: "15 months", status: "Open", blurb: "Four corner-adjacent plots bought below the current asking band." },
  { id: "blk-isb-2", name: "F-11 apartment floor", city: "Islamabad", kind: "Flats", yieldPct: 9, minTicket: 12000000, term: "Yield from month 2", status: "Filling", blurb: "Furnished floor let to a corporate tenant. Distribution is quarterly." },
];

export interface BankOffer {
  name: string;
  product: string;
  rate: number;
  years: number;
  down: number;
  note: string;
}

export const BANKS: BankOffer[] = [
  { name: "HBL", product: "Home Loan", rate: 15.5, years: 20, down: 30, note: "Salaried and self-employed. Property must be approved." },
  { name: "UBL", product: "Address", rate: 16.2, years: 25, down: 20, note: "Longer tenure. Higher markup in year one." },
  { name: "MCB", product: "Home Finance", rate: 15.9, years: 20, down: 25, note: "Plot-plus-construction allowed on selected societies." },
  { name: "Meezan", product: "Easy Home", rate: 17.1, years: 20, down: 30, note: "Diminishing musharakah. No conventional interest line." },
  { name: "Bank Alfalah", product: "Home Finance", rate: 16.4, years: 20, down: 20, note: "Lower down payment on ready houses." },
  { name: "Askari Bank", product: "Home Loan", rate: 15.75, years: 15, down: 30, note: "Shorter tenure, lower total markup." },
];

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  author: string;
  city: string;
  topic: string;
  createdAt: string;
  replies: { author: string; body: string }[];
}

export const SEED_THREADS: ForumPost[] = [
  {
    id: "t-dha-transfer",
    title: "DHA Lahore transfer: how long is the file sitting this month?",
    body: "Booked a 10-marla in Phase 6. Seller says transfer is 3 weeks. Agents in the group are saying 6. What did you actually wait this quarter?",
    author: "Hina K.",
    city: "Lahore",
    topic: "Transfers",
    createdAt: "2026-09-18",
    replies: [
      { author: "Omar", body: "Mine cleared in 24 days in August, after the NOC. Budget the extra week." },
      { author: "Sana", body: "Ask for the transfer challan before you give the token. That is the only date that matters." },
    ],
  },
  {
    id: "t-b17-poss",
    title: "B-17 possession on the back blocks",
    body: "Map says development is done. On the ground the last two streets still have no carpet. Are people taking possession anyway?",
    author: "Fahad A.",
    city: "Islamabad",
    topic: "Societies",
    createdAt: "2026-09-12",
    replies: [{ author: "Nadia", body: "Front blocks yes. Back blocks, wait for the carpet or you will pay for the gravel twice." }],
  },
  {
    id: "t-khi-rent",
    title: "Clifton rent: one year up front is back",
    body: "Two landlords asked for 12 months on a 3-bed. Is that the market again or are they testing?",
    author: "Ayesha Q.",
    city: "Karachi",
    topic: "Rent",
    createdAt: "2026-09-04",
    replies: [{ author: "Farhan", body: "Sea-facing yes. One street in, 6 months still closes if the flat is empty." }],
  },
  {
    id: "t-loan",
    title: "Which bank actually disbursed in September?",
    body: "Approval letters are easy. I need a bank that released funds against a DHA house this month.",
    author: "Bilal S.",
    city: "Lahore",
    topic: "Loans",
    createdAt: "2026-08-28",
    replies: [{ author: "Usman", body: "HBL released on a Phase 5 house for us. Valuation took 11 days." }],
  },
];

export interface WantedAd {
  id: string;
  name: string;
  city: string;
  type: string;
  budget: string;
  note: string;
  createdAt: string;
}

export const SEED_WANTED: WantedAd[] = [
  { id: "w1", name: "Zara M.", city: "Lahore", type: "10 Marla house", budget: "PKR 4.5 Crore", note: "DHA Phase 5 or 6, park facing, ready to move.", createdAt: "2026-09-20" },
  { id: "w2", name: "Imran T.", city: "Karachi", type: "3-bed flat", budget: "PKR 2.8 Crore", note: "DHA or Clifton, covered parking required.", createdAt: "2026-09-15" },
  { id: "w3", name: "Saima R.", city: "Islamabad", type: "5 Marla plot", budget: "PKR 1.2 Crore", note: "B-17 or DHA, possession preferred.", createdAt: "2026-09-09" },
  { id: "w4", name: "Danish", city: "Rawalpindi", type: "Portion", budget: "PKR 55,000 / mo", note: "Bahria, upper portion, family, 6-month contract ok.", createdAt: "2026-09-02" },
];

export interface Reply {
  author: string;
  body: string;
}

export interface SavedAlert {
  id: string;
  label: string;
  params: SearchParams;
  createdAt: string;
}

export function alertLabel(params: SearchParams): string {
  const bits = [
    params.purpose === "rent" ? "Rent" : "Buy",
    params.type || "any type",
    params.location,
    params.city || "Pakistan",
  ].filter(Boolean);
  return bits.join(" · ");
}

export function pricePath(price: number, id: string) {
  const years = ["2021", "2022", "2023", "2024", "2025", "2026"];
  let value = price * 0.62;
  return years.map((year, i) => {
    const bump = 1.07 + ((id.charCodeAt(i % id.length) % 6) / 100);
    value = i === years.length - 1 ? price : value * bump;
    return { year, crore: Math.round((value / 10_000_000) * 100) / 100 };
  });
}

export function agencySlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
