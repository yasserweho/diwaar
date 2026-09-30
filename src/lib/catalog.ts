import type { Property, SearchParams } from "./types";

export { AREA_BOOK } from "./locations";

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
