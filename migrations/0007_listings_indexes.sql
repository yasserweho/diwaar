-- Indexes to speed up public listing queries (sitemap + search pages).
--
-- activeListings() filters on:
--   1. diwaar_listing_moderation.status = 'hidden' by listing id
--   2. count of distinct reporters in diwaar_flags (kind = 'reported', ref_id)
--
-- The flags index on (kind, ref_id) already exists from 0006.
-- Add a plain index on diwaar_listings(id) so the join/filter can use it
-- without scanning the composite primary key (user_id, id).

create index if not exists diwaar_listings_id_idx on diwaar_listings (id);

-- Partial index for the common "not hidden" check.
create index if not exists diwaar_listing_moderation_hidden_idx
  on diwaar_listing_moderation (id)
  where status = 'hidden';
