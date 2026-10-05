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
  const leadCities = CITIES.slice(0, 8);
  const moreCities = CITIES.slice(8);
  const areaCount = CITIES.reduce((n, city) => n + (AREA_BOOK[city]?.length ?? 0), 0);

  return (
    <>
      <section className="bg-primary-dark text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ice-2">
              Pakistan property
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Find property for sale and rent in Pakistan
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ice-2">
              Houses, flats, plots, and commercial space in Lahore, Karachi, Islamabad, and 30 more cities.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/add"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black"
              >
                List your property
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/search"
                search={{ purpose: "buy" }}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/30 px-5 text-sm font-semibold text-white"
              >
                Browse homes
              </Link>
            </div>
            <p className="mt-6 text-sm text-ice-2">
              <span className="font-semibold text-white">{CITIES.length}</span> cities
              <span className="mx-2 text-white/30">/</span>
              <span className="font-semibold text-white">{areaCount.toLocaleString()}</span> areas
            </p>
          </div>
          <figure>
            <img
              src="/images/islamabad-family.jpg"
              alt="A family standing outside their home in Islamabad, with the Margalla Hills behind them"
              decoding="async"
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-xl object-cover object-center"
            />
          </figure>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:pb-10">
          <SearchForm />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:space-y-16 sm:py-14">
        <ToolTiles />

        <section className="flex flex-col items-start justify-between gap-5 rounded-xl bg-primary px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">List a property in minutes.</h2>
            <p className="mt-1 max-w-lg text-sm text-ice-2">
              Free for owners and agents. Buyers across Pakistan can find the ad.
            </p>
          </div>
          <Link
            to="/add"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black"
          >
            Post your ad
            <ArrowRight className="size-4" />
          </Link>
        </section>

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
          <SectionHead title="Browse by city" href="/cities" action="All cities" />
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {leadCities.map((city) => (
              <Link
                key={city}
                to="/search"
                search={{ purpose: "buy", city }}
                className="group flex items-center justify-between bg-white px-4 py-4 hover:bg-ice"
              >
                <span>
                  <span className="block text-sm font-semibold text-black">{city}</span>
                  <span className="mt-0.5 block text-xs text-muted">{AREA_BOOK[city]?.length ?? 0} areas</span>
                </span>
                <ArrowRight className="size-4 text-muted group-hover:text-primary" />
              </Link>
            ))}
          </div>
          {moreCities.length > 0 && (
            <p className="mt-4 text-sm leading-7 text-muted">
              {moreCities.map((city, i) => (
                <span key={city}>
                  {i > 0 && <span className="mx-2 text-border">·</span>}
                  <Link to="/search" search={{ purpose: "buy", city }} className="font-medium text-fg hover:text-primary">
                    {city}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>

        <section>
          <SectionHead title="Area guides" href="/guides" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="overflow-hidden rounded-xl border border-border bg-white"
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
                className="overflow-hidden rounded-xl border border-border bg-white"
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
