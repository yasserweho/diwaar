import { Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property-card";
import { tx, useLang } from "@/lib/i18n";
import type { Property } from "@/lib/types";

/** Owner-posted public ads for a city or area page. Renders nothing when empty. */
export function ListingSection({
  listings,
  place,
  search,
}: {
  listings: Property[];
  place: string;
  search: { city: string; location?: string };
}) {
  const { lang } = useLang();
  if (listings.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-border bg-white px-4 py-3 text-sm text-muted">
        {tx(lang, `No ads posted in ${place} yet.`, `${place} میں ابھی کوئی اشتہار نہیں۔`)}{" "}
        <Link to="/add" className="font-semibold text-primary hover:underline">
          {tx(lang, "Post the first one free", "پہلا اشتہار مفت لگائیں")}
        </Link>
      </p>
    );
  }
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-black">
        {tx(lang, `Latest ads in ${place}`, `${place} میں تازہ اشتہارات`)}
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.slice(0, 12).map((p) => (
          <PropertyCard key={p.id} property={p} layout="grid" />
        ))}
      </div>
      {listings.length > 12 && (
        <Link
          to="/search"
          search={{ purpose: "buy", ...search }}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          {tx(lang, `See all ${listings.length} ads`, `تمام ${listings.length} اشتہارات دیکھیں`)}
        </Link>
      )}
    </section>
  );
}
