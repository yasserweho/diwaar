-- Public visibility for posted ads.
--
-- Ads live in diwaar_listings (one row per poster + ad, rewritten on every
-- account sync). They are now public by default: an ad is shown to everyone
-- unless it is hidden here, or it fails the server-side checks in
-- src/lib/listings.functions.ts (required fields), or 3+ different signed-in
-- users have reported it (diwaar_flags kind = 'reported').
--
-- This table is kept separate from diwaar_listings on purpose: account sync
-- deletes and re-inserts a poster's listings, which would wipe a status column.
--
-- To hide an ad:   insert into diwaar_listing_moderation (id, status, note, updated_at)
--                  values ('user-123', 'hidden', 'scam report', now()::text)
--                  on conflict (id) do update set status = excluded.status,
--                    note = excluded.note, updated_at = excluded.updated_at;
-- To restore it:   update diwaar_listing_moderation set status = 'active' where id = 'user-123';
--
-- Additive only: no existing table or row is changed.
create table if not exists diwaar_listing_moderation (
  id text primary key,
  status text not null default 'hidden' check (status in ('active', 'hidden')),
  note text not null default '',
  updated_at text not null
);

create index if not exists diwaar_flags_reported_idx on diwaar_flags (kind, ref_id);
