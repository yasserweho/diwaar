// Writes a sitemap index plus section sitemaps into public/.
//   node scripts/write-sitemap.mjs
// /search is left out because it 307-redirects to /search?purpose=buy&sort=newest.
// Sections are split so Google Search Console reports indexing per section
// (pages, content, cities, areas). Redirecting URLs (/property-for-sale,
// /property-for-rent) and form pages (/add) are left out on purpose: a sitemap
// should list only canonical, indexable 200 pages.
import { readFileSync, writeFileSync } from "node:fs";
import { AREA_BOOK, CITIES } from "../src/lib/locations.ts";

const origin = "https://www.diwaar.com";
const pub = (name) => new URL(`../public/${name}`, import.meta.url);

function slugify(name) {
  const slug = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "area";
}

/** Pull `slug: "..."` (and optional `date: "..."`) from one exported array in a TS source file. */
function slugsFrom(file, exportName) {
  const src = readFileSync(new URL(`../src/lib/${file}`, import.meta.url), "utf8");
  const start = src.indexOf(`export const ${exportName}`);
  if (start < 0) return [];
  const next = src.indexOf("export ", start + 10);
  const block = src.slice(start, next < 0 ? undefined : next);
  const out = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?(?:date:\s*"(\d{4}-\d{2}-\d{2})"|(?=slug:)|$)/g;
  for (const m of block.matchAll(re)) out.push({ slug: m[1], date: m[2] });
  return out;
}

const pages = [
  "/",
  "/locations",
  "/services",
  "/guides",
  "/projects",
  "/agents",
  "/agencies",
  "/maps",
  "/property-index",
  "/tools",
  "/loans",
  "/blog",
  "/faq",
  "/about",
  "/contact",
  "/privacy",
  "/reviews",
];

const content = [
  ...slugsFrom("data.ts", "POSTS").map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.date })),
  ...slugsFrom("data.ts", "GUIDES").map((g) => ({ path: `/guides/${g.slug}` })),
  ...slugsFrom("services.ts", "SERVICES").map((s) => ({ path: `/services/${s.slug}` })),
];

const cities = [];
const areas = [];
const citySlugCount = new Map();
for (const city of CITIES) {
  let citySlug = slugify(city);
  const seen = citySlugCount.get(citySlug) ?? 0;
  citySlugCount.set(citySlug, seen + 1);
  if (seen) citySlug = `${citySlug}-${seen + 1}`;
  cities.push({ path: `/locations/${citySlug}` });
  const used = new Map();
  for (const name of AREA_BOOK[city] ?? []) {
    let areaSlug = slugify(name);
    const count = used.get(areaSlug) ?? 0;
    used.set(areaSlug, count + 1);
    if (count) areaSlug = `${areaSlug}-${count + 1}`;
    areas.push({ path: `/locations/${citySlug}/${areaSlug}` });
  }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function urlset(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) => {
      const loc = `<loc>${esc(origin + e.path)}</loc>`;
      return e.lastmod ? `  <url>${loc}<lastmod>${e.lastmod}</lastmod></url>` : `  <url>${loc}</url>`;
    }),
    "</urlset>",
    "",
  ].join("\n");
}

const sections = {
  "sitemap-pages.xml": pages.map((path) => ({ path })),
  "sitemap-content.xml": content,
  "sitemap-cities.xml": cities,
  "sitemap-areas.xml": areas,
};

for (const [name, entries] of Object.entries(sections)) {
  writeFileSync(pub(name), urlset(entries));
  console.log(`${name}: ${entries.length} urls`);
}

const index = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Object.keys(sections).map((name) => `  <sitemap><loc>${origin}/${name}</loc></sitemap>`),
  "</sitemapindex>",
  "",
].join("\n");
writeFileSync(pub("sitemap.xml"), index);
console.log("sitemap.xml: index of", Object.keys(sections).length, "sitemaps");
