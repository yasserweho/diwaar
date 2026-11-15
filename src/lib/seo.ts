const BRAND = "Diwaar.com";
const SITE = "https://www.diwaar.com";
const DEFAULT_IMAGE = `${SITE}/og.jpg`;

export function seo(
  title: string,
  description: string,
  opts?: { noindex?: boolean; path?: string; image?: string },
) {
  const full = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const raw = opts?.image;
  // Only absolute http(s) or site-relative images are shareable; data: URLs fall back.
  const image = raw && raw.startsWith("/") ? `${SITE}${raw}` : raw && raw.startsWith("http") ? raw : DEFAULT_IMAGE;
  const url = opts?.path ? `${SITE}${opts.path}` : SITE;
  const meta: Array<Record<string, string>> = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:site_name", content: BRAND },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { itemprop: "name", content: full },
    { itemprop: "description", content: description },
    { itemprop: "image", content: image },
    { itemprop: "url", content: url },
    { name: "robots", content: opts?.noindex ? "noindex, follow" : "max-image-preview:large" },
  ];
  const links = opts?.path ? [{ rel: "canonical", href: url }] : [];
  return { meta, links };
}
