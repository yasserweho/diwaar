const BRAND = "Diwaar.com";
const SITE = "https://www.diwaar.com";

export function seo(
  title: string,
  description: string,
  opts?: { noindex?: boolean; path?: string },
) {
  const full = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const meta: Array<Record<string, string>> = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:site_name", content: BRAND },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (opts?.noindex) meta.push({ name: "robots", content: "noindex, follow" });
  const links = opts?.path
    ? [{ rel: "canonical", href: `${SITE}${opts.path}` }]
    : [];
  return { meta, links };
}
