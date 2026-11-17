import { createFileRoute, Link } from "@tanstack/react-router";
import { GUIDES, inGuide } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { OG, seo } from "@/lib/seo";
import { ShareBar } from "@/components/share-bar";
import { LivePriceStats } from "@/components/live-price-stats";
import { ListingSection } from "@/components/listing-section";
import { listPublicListings } from "@/lib/listings.functions";
import { breadcrumbLd, guideLd, withSchema } from "@/lib/schema";
import { citySlug } from "@/lib/location-pages";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }): Promise<{ listings: Property[] }> => {
    const guide = GUIDES.find((g) => g.slug === params.slug);
    if (!guide) return { listings: [] };
    try {
      const all = await listPublicListings({ data: { city: guide.city, limit: 500 } });
      return { listings: all.filter((p) => inGuide(guide, p)) };
    } catch {
      return { listings: [] };
    }
  },
  head: ({ params }) => {
    const guide = GUIDES.find((g) => g.slug === params.slug);
    if (!guide) return seo("Area guide not found", "This Diwaar area guide is not available.", { noindex: true });
    const path = `/guides/${params.slug}`;
    return withSchema(
      seo(`${guide.name} Property Guide, ${guide.city}`, guide.overview, { path, image: OG.guide(guide.slug), imageAlt: `${guide.name}, ${guide.city} area guide` }),
      guideLd(guide, path),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Area guides", path: "/guides" },
        { name: `${guide.name}, ${guide.city}`, path },
      ]),
    );
  },
  component: GuideDetail });

function GuideDetail() {
  const { slug } = Route.useParams();
  const { listings } = Route.useLoaderData();
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Guide not found</p>
        <Link to="/guides" className="text-primary text-sm font-semibold">
          All guides
        </Link>
      </div>
    );
  }
  const place = `${g.name}, ${g.city}`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <img src={g.image} alt={`${g.name} in ${g.city}`} width={1200} height={675} className="aspect-16/8 w-full rounded-2xl object-cover" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-primary">{g.city}</p>
      <h1 className="text-3xl font-extrabold text-black">{g.name}</h1>
      <p className="mt-3 leading-relaxed">{g.overview}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {g.highlights.map((h) => (
          <li key={h} className="rounded-full bg-ice px-3 py-1 text-sm font-semibold text-primary-dark">
            {h}
          </li>
        ))}
      </ul>
      <LivePriceStats className="mt-8" listings={listings} place={place} />
      <ListingSection listings={listings} place={place} search={{ city: g.city, location: g.name }} />
      <Link
        to="/search"
        search={{ city: g.city, location: g.name, purpose: "buy" }}
        className="mt-8 inline-block"
      >
        <Button>See listings in {g.name}</Button>
      </Link>
      <ShareBar
        className="mt-8"
        path={`/guides/${g.slug}`}
        campaign="guide"
        en={`${g.name}, ${g.city}: area guide for buyers and tenants on Diwaar.com`}
        ur={`${g.name}، ${g.city}: خریداروں اور کرایہ داروں کے لیے علاقائی گائیڈ، دیوار ڈاٹ کام پر`}
      />
      <RelatedLinks
        links={[
          { href: `/locations/${citySlug(g.city)}`, en: `Areas in ${g.city}`, ur: `${g.city} کے علاقے` },
          PAGE.index,
          PAGE.maps,
          PAGE.sale,
        ]}
      />
    </div>
  );
}
