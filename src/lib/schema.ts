import type { AreaGuide, BlogPost, Property } from "./types";

/**
 * schema.org JSON-LD helpers. Use with `withSchema(seo(...), ...objects)` in a
 * route's `head` so the JSON-LD is rendered server-side in <head>.
 */
const SITE = "https://www.diwaar.com";
const ORG_ID = `${SITE}/#organization`;

type Ld = Record<string, unknown>;
type Head = { meta?: Array<Record<string, string>>; links?: Array<Record<string, string>> };

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`);

export function withSchema<T extends Head>(head: T, ...objects: Ld[]) {
  return {
    ...head,
    scripts: objects.map((o) => ({
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", ...o }),
    })),
  };
}

export function breadcrumbLd(crumbs: Array<{ name: string; path: string }>): Ld {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function blogPostingLd(post: BlogPost, path: string): Ld {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: abs(post.image),
    mainEntityOfPage: abs(path),
    inLanguage: post.lang === "ur" ? "ur" : "en",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function guideLd(guide: AreaGuide, path: string): Ld {
  return {
    "@type": "Article",
    headline: `${guide.name} property guide, ${guide.city}`,
    description: guide.overview,
    image: abs(guide.image),
    mainEntityOfPage: abs(path),
    inLanguage: "en",
    about: { "@type": "Place", name: `${guide.name}, ${guide.city}, Pakistan` },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

const ITEM_TYPE: Record<string, string> = {
  house: "SingleFamilyResidence",
  flat: "Apartment",
  portion: "Residence",
  farmhouse: "House",
  plot: "Place",
  commercial: "Place",
};

export function listingLd(p: Property, path: string): Ld {
  return {
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: abs(path),
    datePosted: p.createdAt,
    image: p.images.filter((src) => !src.startsWith("data:")).slice(0, 5).map(abs),
    about: {
      "@type": ITEM_TYPE[p.category] ?? "Accommodation",
      name: p.title,
      address: {
        "@type": "PostalAddress",
        addressLocality: p.city,
        streetAddress: p.location,
        addressCountry: "PK",
      },
      ...(p.beds ? { numberOfRooms: p.beds } : {}),
      ...(p.areaSqft ? { floorSize: { "@type": "QuantitativeValue", value: p.areaSqft, unitCode: "FTK" } } : {}),
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "PKR",
      businessFunction: p.purpose === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      availability: "https://schema.org/InStock",
    },
  };
}
