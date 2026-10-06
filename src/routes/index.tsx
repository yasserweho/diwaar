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
import { SERVICES } from "@/lib/services";
import { cityLabel, tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Find Property for Sale and Rent in Pakistan",
      "Find houses, flats, plots and commercial property for sale and rent in Lahore, Karachi, Islamabad and 30 more cities on diwaar.com.",
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
  const { lang } = useLang();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#071525] text-white">
        <img
          src="/images/islamabad-family.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-[#071525]/78" />
        <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-14 sm:pb-14 sm:pt-20">
          <h1 className="max-w-3xl text-start text-[2rem] font-semibold leading-[1.15] text-white sm:text-5xl">
            {tx(lang, "Find property for sale and rent in Pakistan", "پاکستان میں خرید، فروخت اور کرایے کی جائیداد تلاش کریں")}
          </h1>
          <p className="mt-3 max-w-2xl text-start text-base leading-relaxed text-white/80">
            {tx(
              lang,
              `Houses, flats, plots, and commercial space across ${CITIES.length} cities.`,
              `مکان، فلیٹ، پلاٹ اور کمرشل جگہ ${CITIES.length} شہروں میں۔`,
            )}
          </p>
          <div className="mt-8">
            <SearchForm />
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-black">{CITIES.length}</span> {tx(lang, "cities", "شہر")}
            <span className="mx-2 text-border">·</span>
            <span className="font-semibold text-black">{areaCount.toLocaleString()}</span> {tx(lang, "areas", "علاقے")}
          </p>
          <Link
            to="/add"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white"
          >
            {tx(lang, "List your property", "اپنی جائیداد لگائیں")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:py-14">

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
          <SectionHead title={tx(lang, "Browse by city", "شہر کے حساب سے دیکھیں")} href="/cities" action={tx(lang, "All cities", "تمام شہر")} />
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {leadCities.map((city) => (
              <Link
                key={city}
                to="/search"
                search={{ purpose: "buy", city }}
                className="group flex items-center justify-between bg-white px-4 py-4 hover:bg-ice"
              >
                <span>
                  <span className="block text-sm font-semibold text-black">{cityLabel(city, lang)}</span>
                  <span className="mt-0.5 block text-xs text-muted">{AREA_BOOK[city]?.length ?? 0} {tx(lang, "areas", "علاقے")}</span>
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
                    {cityLabel(city, lang)}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>

        <section>
          <SectionHead title={tx(lang, "Services", "خدمات")} href="/services" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.slice(0, 8).map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="rounded-xl border border-border bg-white p-4 hover:border-primary"
              >
                <p className="font-semibold text-black">{tx(lang, s.title, s.titleUr)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, s.summary, s.summaryUr)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title={tx(lang, "Tools", "اوزار")} href="/tools" />
          <ToolTiles />
        </section>

        <section>
          <SectionHead title={tx(lang, "Area guides", "علاقائی گائیڈ")} href="/guides" />
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
          <SectionHead title={tx(lang, "From the journal", "مضامین")} href="/blog" />
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
