import { createFileRoute, Link } from "@tanstack/react-router";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { CITIES } from "@/lib/locations";
import { areasOf, citySlug, provinceOf } from "@/lib/location-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/locations")({
  head: () =>
    seo(
      "Property Locations in Pakistan",
      "Browse houses, flats, plots and commercial property by city and area on diwaar.com.",
      { path: "/locations" },
    ),
  component: LocationsPage,
});

function LocationsPage() {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {tx(lang, "Locations", "مقامات")}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Cities and areas in Pakistan", "پاکستان کے شہر اور علاقے")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "Open a city to see its areas, then open an area for sale and rent search.",
          "شہر کھول کر علاقے دیکھیں، پھر علاقہ کھول کر فروخت اور کرایہ تلاش کریں۔",
        )}
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => (
          <Link
            key={city}
            to="/locations/$city"
            params={{ city: citySlug(city) }}
            className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover"
          >
            <p className="text-xs font-semibold text-primary">{provinceOf(city)}</p>
            <p className="text-xl font-semibold text-black">{cityLabel(city, lang)}</p>
            <p className="mt-2 text-sm text-muted">
              {areasOf(city).length.toLocaleString()} {tx(lang, "areas", "علاقے")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
