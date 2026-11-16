const BRAND = "Diwaar.com";
const SITE = "https://www.diwaar.com";
const DEFAULT_IMAGE = `${SITE}/og.jpg`;

/** Branded 1200x630 share cards rendered by scripts/og-images.py into public/og/. */
export const OG = {
  site: "/og/site.png",
  city: (citySlug: string) => `/og/city/${citySlug}.png`,
  blog: (slug: string) => `/og/blog/${slug}.png`,
  guide: (slug: string) => `/og/guide/${slug}.png`,
  tool: (name: "tools" | "rent-vs-buy" | "transfer-cost") => `/og/tool/${name}.png`,
};

export function seo(
  title: string,
  description: string,
  opts?: {
    noindex?: boolean;
    path?: string;
    image?: string;
    imageAlt?: string;
    /** "article" for blog posts; defaults to "website". */
    type?: "website" | "article";
    lang?: "en" | "ur";
  },
) {
  const full = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const raw = opts?.image;
  // Only absolute http(s) or site-relative images are shareable; data: URLs fall back.
  const image = raw && raw.startsWith("/") ? `${SITE}${raw}` : raw && raw.startsWith("http") ? raw : DEFAULT_IMAGE;
  const isCard = image.startsWith(`${SITE}/og/`);
  const alt = opts?.imageAlt ?? full;
  const url = opts?.path ? `${SITE}${opts.path}` : SITE;
  const meta: Array<Record<string, string>> = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:site_name", content: BRAND },
    { property: "og:type", content: opts?.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:locale", content: opts?.lang === "ur" ? "ur_PK" : "en_PK" },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: alt },
    ...(isCard
      ? [
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:type", content: "image/png" },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: alt },
    { itemprop: "name", content: full },
    { itemprop: "description", content: description },
    { itemprop: "image", content: image },
    { itemprop: "url", content: url },
    { name: "robots", content: opts?.noindex ? "noindex, follow" : "max-image-preview:large" },
  ];
  const links = opts?.path ? [{ rel: "canonical", href: url }] : [];
  return { meta, links };
}
