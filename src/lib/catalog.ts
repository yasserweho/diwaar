import type { Property, SearchParams } from "./types";

export const AREA_BOOK: Record<string, string[]> = {
  Lahore: ["DHA Defence", "Bahria Town", "Johar Town", "Park View City", "Gulberg", "Askari", "Model Town", "Bahria Orchard", "Raiwind Road", "Al Kabir Town"],
  Karachi: ["DHA Defence", "Clifton", "Scheme 33", "Bahria Town Karachi", "Gulshan-e-Iqbal", "North Nazimabad"],
  Islamabad: ["DHA Defence", "B-17", "F-10", "F-7", "E-11", "Bahria Town", "G-13", "F-8"],
  Rawalpindi: ["Bahria Town", "DHA Defence", "Satellite Town"],
  Multan: ["DHA Defence", "Model Town"],
  Faisalabad: ["Civil Lines", "Madina Town"],
  Peshawar: ["Hayatabad", "Warsak Road"],
  Gujranwala: ["DC Colony", "Wapda Town"],
};

/** Real ads only. Generated sample inventory is not published. */
export function openListingCount() {
  return 0;
}

export function listingById(_id: string): Property | undefined {
  return undefined;
}

export function generatedMatches(_params: SearchParams): Property[] {
  return [];
}

export function neighborsOf(_p: Property): Property[] {
  return [];
}
