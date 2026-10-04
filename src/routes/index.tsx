import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchForm } from "@/components/search-form";
import { SectionHead, ToolTiles } from "@/components/shell";
import { PROPERTIES, PROJECTS, GUIDES, POSTS } from "@/lib/data";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";

import { CITIES } from "@/lib/types";
import { AREA_BOOK } from "@/lib/locations";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Find Property for Sale and Rent in Pakistan",
      "Houses, flats, plots and commercial property for sale and rent in Lahore, Karachi, Islamabad and 20+ cities.",
      { path: "/" },
    ),
  component: HomePage,
});

function HomePage() {
  const posted = useAppStore((s) => s.userListings);
  const live = [...posted, ...PROPERTIES];
  const featured = live.filter((p) => p.featured);
  const hot = live.filter((p) => p.badges.includes("hot") || p.badges.includes("superhot")).slice(0, 4);

  return (
    <>
      <section className="bg-primary-dark text-primary-fg">
        <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-8 sm:pt-14 sm:pb-20 overflow-hidden">
          <Skyline />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ice-2">
            Pakistan's property portal
          </p>
          <h1 className="mt-2 max-w-2xl text-[1.65rem] leading-snug font-extrabold text-white sm:mt-3 sm:text-5xl">
            Find property for sale and rent in Pakistan
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:mt-3 sm:text-base text-ice-2">
            Houses, flats, plots and commercial across Lahore, Karachi, Islamabad
            and 20+ cities.
          </p>
          <div className="relative mx-auto mt-5 max-w-4xl sm:mt-8">
            <SearchForm />
          </div>
          <figure className="relative mx-auto mt-5 max-w-3xl sm:mt-8">
            <img
              src="/images/islamabad-family.jpg"
              alt="A family standing outside their home in Islamabad, with the Margalla Hills behind them"
              decoding="async"
              fetchPriority="high"
              className="h-44 w-full rounded-2xl object-cover object-center shadow-card ring-4 ring-white/15 sm:aspect-video sm:h-auto"
            />
          </figure>
          <div className="relative mt-6 flex flex-wrap gap-4 text-sm text-ice-2">
            <span>
              <strong className="text-primary-fg tabular-nums">{live.length.toLocaleString()}</strong> real listings
            </span>
            <Link to="/add" className="font-semibold text-primary-fg underline-offset-2 hover:underline">
              Post an ad
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-10 sm:py-10 sm:space-y-14">
        <ToolTiles />

        {featured.length > 0 && (
        <section>
          <SectionHead title="Featured properties" href="/search?purpose=buy" />
          <div className="grid gap-4 md:grid-cols-2">
            {featured.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} layout="grid" />
            ))}
          </div>
        </section>
        )}

        {PROJECTS.length > 0 && (
        <section>
          <SectionHead title="New projects" href="/projects" />
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
            {PROJECTS.map((p) => (
              <Link
                key={p.id}
                to="/projects/$id"
                params={{ id: p.id }}
                className="snap-start min-w-[260px] max-w-[280px] shrink-0 overflow-hidden rounded-xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
              >
                <img src={p.images[0]} alt="" loading="lazy" decoding="async" className="aspect-16/10 w-full object-cover" />
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                    {p.status}
                  </p>
                  <p className="font-bold mt-0.5">{p.name}</p>
                  <p className="text-sm text-muted">
                    {p.location}, {p.city}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary-dark">
                    From {formatPkr(p.priceFrom)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        )}

        {hot.length > 0 && (
        <section>
          <SectionHead title="Hot listings this week" href="/search?purpose=buy" />
          <div className="grid gap-4 sm:grid-cols-2">
            {hot.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
        )}

        <section>
          <SectionHead title="Browse by city" href="/search" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.map((city) => (
              <Link
                key={city}
                to="/search"
                search={{ purpose: "buy", city }}
                className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast group"
              >
                <p className="font-extrabold text-lg text-primary-dark">{city}</p>
                <p className="text-sm text-muted mt-1">{AREA_BOOK[city]?.length ?? 0} areas</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  View listings <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Area guides" href="/guides" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="overflow-hidden rounded-xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
              >
                <img src={g.image} alt="" loading="lazy" decoding="async" className="aspect-16/8 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary">{g.city}</p>
                  <p className="font-bold">{g.name}</p>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{g.overview}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="From the journal" href="/blog" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POSTS.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="overflow-hidden rounded-xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
              >
                <img src={p.image} alt="" loading="lazy" decoding="async" className="aspect-16/10 w-full object-cover" />
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{p.tag}</p>
                  <p className="font-bold mt-1 leading-snug">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Skyline() {
  return (
    <svg
      className="pointer-events-none absolute right-[-8%] bottom-0 hidden h-48 w-[55%] text-primary-fg/10 sm:block"
      viewBox="0 0 640 180"
      fill="currentColor"
      aria-hidden
    >
      <rect x="20" y="80" width="48" height="100" rx="2" />
      <rect x="76" y="40" width="36" height="140" rx="2" />
      <rect x="120" y="60" width="70" height="120" rx="2" />
      <polygon points="210,70 245,30 280,70" />
      <rect x="214" y="70" width="62" height="110" rx="2" />
      <rect x="290" y="50" width="44" height="130" rx="2" />
      <rect x="342" y="90" width="80" height="90" rx="2" />
      <rect x="430" y="35" width="52" height="145" rx="2" />
      <rect x="490" y="72" width="64" height="108" rx="2" />
      <rect x="562" y="55" width="40" height="125" rx="2" />
    </svg>
  );
}
