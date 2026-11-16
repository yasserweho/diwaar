import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/lib/data";
import { OG, seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo(
      "Pakistan Property Market Notes",
      "Renting guides, rent agreements, CDA/RDA society checks, Marla sizes and buying checklists for Pakistan, in English and Urdu.",
      { path: "/blog", image: OG.site },
    ),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Journal</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Market notes</h1>
      <div className="mt-8 grid gap-5">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="grid overflow-hidden rounded-2xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast sm:grid-cols-[220px_1fr]"
          >
            <img src={p.image} alt={p.title} width={1200} height={675} loading="lazy" decoding="async" className="aspect-16/10 sm:aspect-auto sm:h-full object-cover" />
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                {p.tag} · {p.date}
              </p>
              <h2 className="mt-1 text-lg font-bold" lang={p.lang === "ur" ? "ur" : undefined} dir={p.lang === "ur" ? "rtl" : undefined}>
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted" lang={p.lang === "ur" ? "ur" : undefined} dir={p.lang === "ur" ? "rtl" : undefined}>
                {p.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
