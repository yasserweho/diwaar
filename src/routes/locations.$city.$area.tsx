import { createFileRoute, Link } from "@tanstack/react-router";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { areaFromSlug, areasOf, cityFromSlug } from "@/lib/location-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/locations/$city/$area")({
  head: ({ params }) => {
    const city = cityFromSlug(params.city);
    const area = city ? areaFromSlug(city, params.area) : undefined;
    if (!city || !area) {
      return seo("Area not found", "This area is not on diwaar.com.", { noindex: true });
    }
    return seo(
      `${area}, ${city}`,
      `Houses, flats, plots and commercial property for sale and rent in ${area}, ${city} on diwaar.com.`,
      { path: `/locations/${params.city}/${params.area}` },
    );
  },
  component: AreaLocationPage,
});

function AreaLocationPage() {
  const { city: citySlug, area: areaSlug } = Route.useParams();
  const { lang } = useLang();
  const city = cityFromSlug(citySlug);
  const area = city ? areaFromSlug(city, areaSlug) : undefined;
  if (!city || !area) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">{tx(lang, "Area not found", "علاقہ نہیں ملا")}</p>
        <Link to="/locations" className="text-sm font-semibold text-primary">
          {tx(lang, "All locations", "تمام مقامات")}
        </Link>
      </div>
    );
  }
  const all = areasOf(city);
  const index = all.findIndex((a) => a.slug === areaSlug);
  const nearby = [...all.slice(Math.max(0, index - 4), index), ...all.slice(index + 1, index + 5)];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/locations/$city" params={{ city: citySlug }} className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {cityLabel(city, lang)}
      </Link>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{area}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {tx(
          lang,
          `Search property for sale and rent in ${area}, ${cityLabel(city, lang)}.`,
          `${cityLabel(city, lang)} کے علاقے ${area} میں فروخت اور کرایے کی جائیداد تلاش کریں۔`,
        )}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/search"
          search={{ purpose: "buy", city, location: area }}
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          {tx(lang, "For sale", "فروخت")}
        </Link>
        <Link
          to="/search"
          search={{ purpose: "rent", city, location: area }}
          className="inline-flex h-11 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-black"
        >
          {tx(lang, "For rent", "کرایہ")}
        </Link>
      </div>
      {nearby.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-black">{tx(lang, "Other areas", "دیگر علاقے")}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {nearby.map((item) => (
              <li key={item.slug}>
                <Link
                  to="/locations/$city/$area"
                  params={{ city: citySlug, area: item.slug }}
                  className="block rounded-lg border border-border bg-white px-3 py-3 text-sm font-medium text-black hover:border-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
