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

export interface BankOffer {
  name: string;
  product: string;
  rate: number;
  years: number;
  down: number;
  note: string;
}

export const BANKS: BankOffer[] = [
  { name: "Apna Ghar (Govt)", product: "Affordable Housing", rate: 5.0, years: 20, down: 10, note: "Fixed 5% for first 10 years on loans up to Rs 10 million. First-time buyers. 10% equity." },
  { name: "HBL", product: "Home Loan", rate: 15.8, years: 20, down: 30, note: "KIBOR + ~3%. Salaried and self-employed. Property must be approved." },
  { name: "UBL", product: "Address", rate: 15.9, years: 25, down: 20, note: "Longer tenure. Variable, linked to 1-year KIBOR." },
  { name: "MCB", product: "Home Finance", rate: 15.4, years: 20, down: 25, note: "Often 6-month KIBOR + 2-3%. Plot-plus-construction on selected societies." },
  { name: "Meezan Bank", product: "Easy Home", rate: 15.8, years: 20, down: 30, note: "Islamic diminishing musharakah. KIBOR + ~3% for salaried." },
  { name: "Bank Alfalah", product: "Home Finance", rate: 15.8, years: 20, down: 20, note: "KIBOR + 3% salaried. Lower down payment on ready houses." },
  { name: "Bank AL Habib", product: "Housing Finance", rate: 15.8, years: 25, down: 20, note: "KIBOR + 3% salaried, +3.5% self-employed. Up to Rs 100M." },
  { name: "Askari Bank", product: "Home Loan", rate: 15.8, years: 15, down: 30, note: "Competitive variable rates. Shorter max tenure available." },
  { name: "Allied Bank", product: "Home Finance", rate: 16.0, years: 25, down: 25, note: "Variable pricing. Construction and purchase options." },
  { name: "HBFC", product: "Ghar Sahulat", rate: 15.8, years: 20, down: 15, note: "Specialised housing finance. Competitive for ready and under-construction." },
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
