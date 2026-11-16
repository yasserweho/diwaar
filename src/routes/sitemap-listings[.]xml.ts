import { createFileRoute } from "@tanstack/react-router";
import { activeListings } from "@/lib/listings.server";

const ORIGIN = "https://www.diwaar.com";

// Live sitemap of public owner ads (/property/user-…). Listed in /sitemap.xml.
export const Route = createFileRoute("/sitemap-listings.xml")({
  server: {
    handlers: {
      GET: async () => {
        let urls: string[] = [];
        try {
          const listings = await activeListings();
          urls = listings.slice(0, 45000).map(
            (p) => `  <url><loc>${ORIGIN}/property/${p.id}</loc><lastmod>${p.createdAt}</lastmod></url>`,
          );
        } catch {
          urls = [];
        }
        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
