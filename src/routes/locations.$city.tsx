import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { areasOf, cityFromSlug, provinceOf } from "@/lib/location-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/locations/$city")({
  head: ({ params }) => {
    const city = cityFromSlug(params.city);
    if (!city) return seo("City not found", "This city is not on diwaar.com.", { noindex: true });
    const n = areasOf(city).length;
    return seo(
      `Property in ${city}`,
      `Houses, flats, plots and commercial property in ${city}, with ${n.toLocaleString()} areas on diwaar.com.`,
      { path: `/locations/${params.city}` },
    );
  },
  component: CityLocationPage,
});

function CityLocationPage() {
  const { city: slug } = Route.useParams();
  const { lang } = useLang();
  const city = cityFromSlug(slug);
  const [query, setQuery] = useState("");
  const areas = areasOf(city ?? "");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? areas.filter((a) => a.name.toLowerCase().includes(q)) : areas;
    return list.slice(0, q ? 80 : 48);
  }, [areas, query]);

  if (!city) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">{tx(lang, "City not found", "شہر نہیں ملا")}</p>
        <Link to="/locations" className="text-sm font-semibold text-primary">
          {tx(lang, "All locations", "تمام مقامات")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{provinceOf(city)}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, `Property in ${cityLabel(city, lang)}`, `${cityLabel(city, lang)} میں جائیداد`)}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {areas.length.toLocaleString()} {tx(lang, "areas", "علاقے")}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/search"
          search={{ purpose: "buy", city }}
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          {tx(lang, "For sale", "فروخت")}
        </Link>
        <Link
          to="/search"
          search={{ purpose: "rent", city }}
          className="inline-flex h-11 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-black"
        >
          {tx(lang, "For rent", "کرایہ")}
        </Link>
      </div>
      <label className="mt-8 block max-w-md">
        <span className="mb-1.5 block text-xs font-medium text-muted">{tx(lang, "Find an area", "علاقہ تلاش کریں")}</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tx(lang, "Type an area", "علاقہ لکھیں")}
          className="h-12 w-full rounded-lg border border-border bg-white px-3 text-base text-black"
          style={{ color: "#000", backgroundColor: "#fff" }}
        />
      </label>
      <p className="mt-3 text-sm text-muted">
        {tx(
          lang,
          query.trim()
            ? `${shown.length} matching areas`
            : `Showing ${shown.length} of ${areas.length.toLocaleString()}. Type to narrow the list.`,
          query.trim()
            ? `${shown.length} علاقے ملے`
            : `${areas.length.toLocaleString()} میں سے ${shown.length}۔ فہرست چھوٹی کرنے کے لیے لکھیں۔`,
        )}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((area) => (
          <li key={area.slug}>
            <Link
              to="/locations/$city/$area"
              params={{ city: slug, area: area.slug }}
              className="block rounded-lg border border-border bg-white px-3 py-3 text-sm font-medium text-black hover:border-primary"
            >
              {area.name}
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="mt-6 text-sm text-muted">{tx(lang, "No area matches that name.", "اس نام کا علاقہ نہیں ملا۔")}</p>
      )}
    </div>
  );
}
