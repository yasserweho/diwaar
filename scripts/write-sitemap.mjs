import { writeFileSync } from "node:fs";
import { AREA_BOOK, CITIES } from "../src/lib/locations.ts";

const origin = "https://www.diwaar.com";

function slugify(name) {
  const slug = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "area";
}

const pages = [
  "/",
  "/property-for-sale",
  "/property-for-rent",
  "/locations",
  "/services",
  "/guides",
  "/projects",
  "/agents",
  "/agencies",
  "/maps",
  "/property-index",
  "/tools",
  "/blog",
  "/faq",
  "/about",
  "/contact",
  "/privacy",
  "/reviews",
  "/add",
];

const urls = pages.map((path) => `${origin}${path}`);
const citySlugCount = new Map();
for (const city of CITIES) {
  let citySlug = slugify(city);
  const seen = citySlugCount.get(citySlug) ?? 0;
  citySlugCount.set(citySlug, seen + 1);
  if (seen) citySlug = `${citySlug}-${seen + 1}`;
  urls.push(`${origin}/locations/${citySlug}`);
  const used = new Map();
  for (const name of AREA_BOOK[city] ?? []) {
    let areaSlug = slugify(name);
    const count = used.get(areaSlug) ?? 0;
    used.set(areaSlug, count + 1);
    if (count) areaSlug = `${areaSlug}-${count + 1}`;
    urls.push(`${origin}/locations/${citySlug}/${areaSlug}`);
  }
}

const body = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((loc) => `  <url><loc>${loc}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), body);
console.log(`sitemap urls: ${urls.length}`);
