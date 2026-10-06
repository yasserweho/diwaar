create table if not exists diwaar_reviews (
  id text primary key,
  name text not null,
  city text not null default '',
  rating integer not null,
  body text not null,
  created_at text not null
);
