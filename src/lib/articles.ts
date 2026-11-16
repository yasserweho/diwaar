import type { BlogPost } from "./types";

/**
 * Long-form articles live as Markdown in src/content/blog/*.md with a tiny
 * `key: value` front matter block. Vite inlines them at build time.
 */
const files = import.meta.glob("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parse(raw: string): BlogPost | null {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (!meta.slug || !meta.title) return null;
  return {
    slug: meta.slug,
    title: meta.title,
    metaTitle: meta.metaTitle || undefined,
    excerpt: meta.excerpt ?? "",
    date: meta.date ?? "",
    tag: meta.tag ?? "Guides",
    image: meta.image ?? "/og.jpg",
    lang: meta.lang === "ur" ? "ur" : "en",
    body: [],
    markdown: m[2].trim(),
  };
}

export const ARTICLES: BlogPost[] = Object.values(files)
  .map(parse)
  .filter((p): p is BlogPost => p !== null)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
