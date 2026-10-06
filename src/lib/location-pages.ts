import { AREA_BOOK, CITIES } from "@/lib/locations";
import { CITY_DIRECTORY } from "@/lib/portal";

export function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "area";
}

export type AreaRef = { name: string; slug: string };

const citySlugToName = new Map<string, string>();
const cityNameToSlug = new Map<string, string>();
const areasByCity = new Map<string, AreaRef[]>();
const areaLookup = new Map<string, Map<string, string>>();

const citySlugCount = new Map<string, number>();
for (const city of CITIES) {
  let slug = slugify(city);
  const seen = citySlugCount.get(slug) ?? 0;
  citySlugCount.set(slug, seen + 1);
  if (seen) slug = `${slug}-${seen + 1}`;
  citySlugToName.set(slug, city);
  cityNameToSlug.set(city, slug);

  const refs: AreaRef[] = [];
  const lookup = new Map<string, string>();
  const used = new Map<string, number>();
  for (const name of AREA_BOOK[city] ?? []) {
    let areaSlug = slugify(name);
    const count = used.get(areaSlug) ?? 0;
    used.set(areaSlug, count + 1);
    if (count) areaSlug = `${areaSlug}-${count + 1}`;
    refs.push({ name, slug: areaSlug });
    lookup.set(areaSlug, name);
  }
  areasByCity.set(city, refs);
  areaLookup.set(city, lookup);
}

const provinceByCity = new Map(CITY_DIRECTORY.map((c) => [c.city, c.province]));

export function citySlug(city: string) {
  return cityNameToSlug.get(city) ?? slugify(city);
}

export function cityFromSlug(slug: string) {
  return citySlugToName.get(slug);
}

export function provinceOf(city: string) {
  return provinceByCity.get(city) ?? "Pakistan";
}

export function areasOf(city: string) {
  return areasByCity.get(city) ?? [];
}

export function areaFromSlug(city: string, slug: string) {
  return areaLookup.get(city)?.get(slug);
}

export function areaSlug(city: string, name: string) {
  return areasByCity.get(city)?.find((a) => a.name === name)?.slug ?? slugify(name);
}
