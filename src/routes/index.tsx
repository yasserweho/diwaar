import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Home, LandPlot } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchForm } from "@/components/search-form";
import { SectionHead, ToolTiles } from "@/components/shell";
import { PROPERTIES, PROJECTS, GUIDES, POSTS, countByLocation } from "@/lib/data";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

const CITIES_BUY = [
  { city: "Lahore", n: "Houses, plots & flats" },
  { city: "Karachi", n: "DHA, Clifton, Gulshan" },
  { city: "Islamabad", n: "F-sectors, DHA, B-17" },
  { city: "Rawalpindi", n: "Bahria & DHA" },
];

function HomePage() {
  const featured = PROPERTIES.filter((p) => p.featured);
  const hot = PROPERTIES.filter((p) => p.badges.includes("hot") || p.badges.includes("superhot")).slice(0, 4);

  return (
    <>
      <section className="bg-primary-dark text-primary-fg">
        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden">
          <Skyline />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ice-2">
            Pakistan's property portal
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Find property for sale and rent in Pakistan
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-ice-2">
            Houses, flats, plots and commercial across Lahore, Karachi, Islamabad
            and 20+ cities.
          </p>
          <div className="relative mt-8 max-w-4xl">
            <SearchForm />
          </div>
          <div className="relative mt-6 flex flex-wrap gap-4 text-sm text-ice-2">
            <span>
              <strong className="text-primary-fg tabular-nums">2.1M+</strong> listings
            </span>
            <span>
              <strong className="text-primary-fg tabular-nums">12</strong> cities
            </span>
            <span>
              <strong className="text-primary-fg tabular-nums">8,400+</strong> agents
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-14">
        <ToolTiles />

        <section>
          <SectionHead title="Featured properties" href="/search?purpose=buy" />
          <div className="grid gap-4 md:grid-cols-2">
            {featured.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} layout="grid" />
            ))}
          </div>
        </section>

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
                <img src={p.images[0]} alt="" className="aspect-16/10 w-full object-cover" />
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

        <section>
          <SectionHead title="Hot listings this week" href="/search?purpose=buy" />
          <div className="grid gap-4 sm:grid-cols-2">
            {hot.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>

        <PopularBlock />

        <section>
          <SectionHead title="Browse by city" href="/search" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CITIES_BUY.map((c) => (
              <Link
                key={c.city}
                to="/search"
                search={{ purpose: "buy", city: c.city }}
                className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast group"
              >
                <p className="font-extrabold text-lg text-primary-dark">{c.city}</p>
                <p className="text-sm text-muted mt-1">{c.n}</p>
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
                <img src={g.image} alt="" className="aspect-16/8 w-full object-cover" />
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
                <img src={p.image} alt="" className="aspect-16/10 w-full object-cover" />
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

function PopularBlock() {
  const currency = useAppStore((s) => s.currency);
  const blocks = [
    { city: "Lahore", purpose: "buy" as const, category: "house" as const, icon: Home },
    { city: "Karachi", purpose: "buy" as const, category: "flat" as const, icon: Building2 },
    { city: "Islamabad", purpose: "buy" as const, category: "plot" as const, icon: LandPlot },
  ];
  return (
    <section>
      <SectionHead title="Popular locations" />
      <div className="grid gap-4 lg:grid-cols-3">
        {blocks.map((b) => {
          const rows = countByLocation(b.city, b.purpose, b.category);
          const Icon = b.icon;
          return (
            <div key={b.city + b.category} className="rounded-xl bg-surface p-5 shadow-card">
              <p className="flex items-center gap-2 font-bold text-primary-dark">
                <Icon className="size-4 text-primary" />
                {b.category === "house" ? "Houses" : b.category === "flat" ? "Flats" : "Plots"} in {b.city}
              </p>
              <ul className="mt-3 divide-y divide-border">
                {rows.slice(0, 6).map(([loc, n]) => (
                  <li key={loc}>
                    <Link
                      to="/search"
                      search={{ purpose: b.purpose, city: b.city, location: loc, type: b.category }}
                      className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
                    >
                      <span>{loc}</span>
                      <span className="tabular-nums text-muted">{n}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className={cn("mt-3 text-xs text-muted")}>
        Sample of live Diwaar inventory · prices from {formatPkr(2400000, currency)}
      </p>
    </section>
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
