import { createFileRoute, Link } from "@tanstack/react-router";
import { GUIDES } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  head: () =>
    seo(
      "Pakistan Area Guides for Buyers",
      "Street-level guides for DHA, Bahria, Clifton, F-sectors and other societies, with asking prices from live ads.",
      { path: "/guides" },
    ),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Area guides</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Know the street before you buy</h1>
      <p className="mt-2 max-w-2xl text-muted">
        What each society is like, plus median asking prices once enough live ads are posted there.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="overflow-hidden rounded-2xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
          >
            <img src={g.image} alt={`${g.name}, ${g.city}`} width={1200} height={675} loading="lazy" decoding="async" className="aspect-16/8 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-semibold text-primary">{g.city}</p>
              <h2 className="text-lg font-bold">{g.name}</h2>
              <p className="mt-1 text-sm text-muted line-clamp-2">{g.overview}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
