import type { SearchParams } from "./types";

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

export interface CityCard {
  city: string;
  province: string;
  focus: string;
  societies: string;
}

export const CITY_DIRECTORY: CityCard[] = [
  { city: "Lahore", province: "Punjab", focus: "2154 areas", societies: "Aabpara Coop Housing Society, Aamir Town, Aashiana Road" },
  { city: "Karachi", province: "Sindh", focus: "1349 areas", societies: "9th Commercial Street - DHA Phase 4, A One Villas, Abbas Town" },
  { city: "Islamabad", province: "Capital", focus: "978 areas", societies: "11 Central Apartments, 17 Hills Apartments, 18 West Residencia" },
  { city: "Rawalpindi", province: "Punjab", focus: "390 areas", societies: "7th Road, Acantilado Commercial, Adiala Road" },
  { city: "Multan", province: "Punjab", focus: "333 areas", societies: "Abdali Road, Adams Housing Scheme, Adams Housing Scheme - Block A" },
  { city: "Faisalabad", province: "Punjab", focus: "253 areas", societies: "204 Chak Road, A Zee Housing, Abbaspur" },
  { city: "Gujranwala", province: "Punjab", focus: "177 areas", societies: "Ajwa City, Ajwa City - Block A, Ajwa City - Block A1" },
  { city: "Peshawar", province: "Khyber Pakhtunkhwa", focus: "171 areas", societies: "Academy Town, Al Massa Town, Ali Homes" },
  { city: "Sialkot", province: "Punjab", focus: "72 areas", societies: "Aimanabad Road, Ajmal Garden Colony, Akberabad" },
  { city: "Hyderabad", province: "Sindh", focus: "123 areas", societies: "Abdullah Corner, Abdullah Garden, Abdullah Garden Phase 6" },
  { city: "Quetta", province: "Balochistan", focus: "15 areas", societies: "Chilten Housing Scheme, Defence Officers Housing Scheme, DHA Defence" },
  { city: "Gwadar", province: "Balochistan", focus: "84 areas", societies: "Airport Road, Akara, Bandi" },
  { city: "Bahawalpur", province: "Punjab", focus: "64 areas", societies: "Abbasi Town, Al Haram Executive Villas, Al Noor Homes" },
  { city: "Sargodha", province: "Punjab", focus: "38 areas", societies: "Al-Burhan City, Asad Park, Bhera" },
  { city: "Sahiwal", province: "Punjab", focus: "19 areas", societies: "Ajwa City, Al Haram City, Al Haram City - Phase 1" },
  { city: "Abbottabad", province: "Khyber Pakhtunkhwa", focus: "41 areas", societies: "Abbotabad City, Abbottabad Heights Road, Abbottabad Road" },
  { city: "Mardan", province: "Khyber Pakhtunkhwa", focus: "19 areas", societies: "Forefront Gold City, Green Acres Town, Green Mansions" },
  { city: "Gujrat", province: "Punjab", focus: "22 areas", societies: "Al Nabi Colony, Ali Pura Road, Badshahi Road" },
  { city: "Jhelum", province: "Punjab", focus: "19 areas", societies: "Cantt, Chakwal - Jhelum Road, Citi Housing Overseas - Block A" },
  { city: "Sheikhupura", province: "Punjab", focus: "42 areas", societies: "Al-Baari Residencia Housing Scheme, Alif Town, Civil Quarters Road" },
  { city: "Rahim Yar Khan", province: "Punjab", focus: "38 areas", societies: "Abbasia Town, Abu Dhabi Road, Allama Iqbal Town" },
  { city: "Murree", province: "Punjab", focus: "34 areas", societies: "201 Apartment, Barrian, Beverly Hills Patriata" },
  { city: "Wah", province: "Punjab", focus: "69 areas", societies: "Asifabad, Chester Park, Faisal Iqbal Town" },
  { city: "Okara", province: "Punjab", focus: "11 areas", societies: "Canal Road, Depalpur Road, Faisalabad Road" },
  { city: "Burewala", province: "Punjab", focus: "2 areas", societies: "New Model Town, Others" },
  { city: "Chunian", province: "Punjab", focus: "1 area", societies: "Changa Manga Chunian Road" },
  { city: "Dera Ghazi Khan", province: "Punjab", focus: "8 areas", societies: "City Garden, Drishak Town, Garden Town" },
  { city: "Gharo", province: "Sindh", focus: "6 areas", societies: "Club Road, Keti Bunder Highway, Lait Canal Road" },
  { city: "Haripur", province: "Khyber Pakhtunkhwa", focus: "16 areas", societies: "Hattar Industrial Estate, Khalabat Township, Khanpur" },
  { city: "Hassan Abdal", province: "Punjab", focus: "2 areas", societies: "GT Road, Khyber City" },
  { city: "Sarai Alamgir", province: "Punjab", focus: "11 areas", societies: "Canal City, GT Road, New Metro City" },
  { city: "Sukkur", province: "Sindh", focus: "2 areas", societies: "Pano Akil, Sukkur Bypass" },
  { city: "Swabi", province: "Khyber Pakhtunkhwa", focus: "1 area", societies: "Marghuz" },
];

/**
 * Reference rates, copied by hand from the State Bank of Pakistan.
 * Update KIBOR_1Y and RATES_AS_OF together. Source: https://www.sbp.org.pk/ecodata/kibor_index.asp
 */
export const POLICY_RATE = 12.0;
export const KIBOR_1Y = 12.81;
export const RATES_AS_OF = "16 Nov 2026";
export const RATES_SOURCE_URL = "https://www.sbp.org.pk/ecodata/kibor_index.asp";
/** Spread Diwaar assumes for a conventional bank loan. It matches the KIBOR + 3% the Apna Ghar scheme uses after year 10; each bank sets its own. */
export const ASSUMED_SPREAD = 3;
const estimate = Math.round((KIBOR_1Y + ASSUMED_SPREAD) * 10) / 10;

export interface BankOffer {
  name: string;
  product: string;
  rate: number;
  /** True when `rate` is a published scheme rate, false when it is Diwaar's KIBOR + spread estimate. */
  published: boolean;
  years?: number;
  down?: number;
  note: string;
  sourceUrl?: string;
}

const bankNote = `Diwaar estimate: 1-year KIBOR ${KIBOR_1Y}% (SBP, ${RATES_AS_OF}) + ${ASSUMED_SPREAD}%. Not this bank's quote. Ask the bank for its spread, down payment and tenure.`;

export const BANKS: BankOffer[] = [
  {
    name: "Apna Ghar (Govt)",
    product: "Wazir-e-Azam Apna Ghar Program",
    rate: 5.0,
    published: true,
    years: 20,
    down: 10,
    note: "Fixed 5% for the first 10 years, then 1-year KIBOR + 3%. Up to Rs 10 million, first-time buyers, house up to 10 Marla or flat up to 1,500 sq ft. Apply through a participating bank.",
    sourceUrl: "https://www.apnaghar.gov.pk/",
  },
  ...["HBL", "UBL", "MCB", "Meezan Bank", "Bank Alfalah", "Bank AL Habib", "Askari Bank", "Allied Bank", "HBFC"].map(
    (name): BankOffer => ({
      name,
      product: name === "Meezan Bank" ? "Islamic home finance" : "Home loan",
      rate: estimate,
      published: false,
      note: bankNote,
      sourceUrl: RATES_SOURCE_URL,
    }),
  ),
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

export interface WantedAd {
  id: string;
  name: string;
  city: string;
  type: string;
  budget: string;
  note: string;
  createdAt: string;
}

export const SEED_WANTED: WantedAd[] = [];

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
