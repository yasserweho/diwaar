import { getSql } from "@/lib/db";
import { REPORTS_TO_HIDE, toPublicListing } from "./listings.shared";
import type { Property } from "./types";

/**
 * Every ad that is fit to show publicly, newest first. Hidden by moderation,
 * reported by REPORTS_TO_HIDE+ accounts, or missing required fields → left out.
 * Reads diwaar_listings directly (the poster's own synced ads), so an ad the
 * poster deletes in My ads disappears from public pages on the next sync.
 *
 * The query uses a single aggregation of report counts (not a correlated
 * subquery per row) plus anti-join for hidden ads. Indexes from
 * 0007_listings_indexes.sql keep the joins cheap.
 */
export async function activeListings(): Promise<Property[]> {
  const sql = await getSql();
  const rows = await sql<{ id: string; payload: string }>`
    select l.id, l.payload
    from diwaar_listings l
    left join diwaar_listing_moderation m
      on m.id = l.id and m.status = 'hidden'
    left join (
      select ref_id, count(distinct user_id)::int as report_count
      from diwaar_flags
      where kind = 'reported'
      group by ref_id
    ) f on f.ref_id = l.id
    where m.id is null
      and coalesce(f.report_count, 0) < ${REPORTS_TO_HIDE}`;
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
