import { createFileRoute, Link } from "@tanstack/react-router";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { citySlug } from "@/lib/location-pages";
import { CITY_DIRECTORY } from "@/lib/portal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cities")({
  head: () =>
    seo(
      "Property by City in Pakistan",
      "Open a city to see its areas, then search houses, flats, plots and commercial property on diwaar.com.",
      { path: "/cities" },
    ),
  component: CitiesPage,
});

function CitiesPage() {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {tx(lang, "All cities", "تمام شہر")}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Buy and rent across Pakistan", "پاکستان بھر میں خرید و کرایہ")}
      </h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CITY_DIRECTORY.map((c) => (
          <Link
            key={c.city}
            to="/locations/$city"
            params={{ city: citySlug(c.city) }}
            className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover"
          >
            <p className="text-xs font-semibold text-primary">{c.province}</p>
            <p className="text-xl font-extrabold text-primary-dark">{cityLabel(c.city, lang)}</p>
            <p className="mt-1 text-sm text-muted">{c.focus}</p>
            <p className="mt-2 text-sm">{c.societies}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}