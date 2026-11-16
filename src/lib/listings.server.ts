import { getSql } from "@/lib/db";
import { REPORTS_TO_HIDE, toPublicListing } from "./listings.shared";
import type { Property } from "./types";

/**
 * Every ad that is fit to show publicly, newest first. Hidden by moderation,
 * reported by REPORTS_TO_HIDE+ accounts, or missing required fields → left out.
 * Reads diwaar_listings directly (the poster's own synced ads), so an ad the
 * poster deletes in My ads disappears from public pages on the next sync.
 */
export async function activeListings(): Promise<Property[]> {
  const sql = await getSql();
  const rows = await sql<{ id: string; payload: string }>`
    select l.id, l.payload
    from diwaar_listings l
    where not exists (
      select 1 from diwaar_listing_moderation m where m.id = l.id and m.status = 'hidden'
    )
    and (
      select count(distinct f.user_id) from diwaar_flags f
      where f.kind = 'reported' and f.ref_id = l.id and f.user_id <> l.user_id
    ) < ${REPORTS_TO_HIDE}`;
  const seen = new Set<string>();
  const out: Property[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(row.payload);
    } catch {
      continue;
    }
    const listing = toPublicListing(parsed);
    if (!listing || listing.id !== row.id) continue;
    seen.add(listing.id);
    out.push(listing);
  }
  return out.sort((a, b) => b.id.localeCompare(a.id, "en", { numeric: true }));
}
