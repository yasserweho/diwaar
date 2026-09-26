create table if not exists diwaar_listings (
  user_id text not null,
  id text not null,
  payload text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_saved (
  user_id text not null,
  property_id text not null,
  primary key (user_id, property_id)
);

create table if not exists diwaar_alerts (
  user_id text not null,
  id text not null,
  label text not null,
  params text not null,
  created_at text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_wanted (
  user_id text not null,
  id text not null,
  name text not null,
  city text not null,
  type text not null,
  budget text not null,
  note text not null,
  created_at text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_threads (
  user_id text not null,
  id text not null,
  title text not null,
  body text not null,
  author text not null,
  city text not null,
  topic text not null,
  created_at text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_replies (
  user_id text not null,
  thread_id text not null,
  author text not null,
  body text not null
);

create index if not exists diwaar_replies_user_idx on diwaar_replies (user_id);

create table if not exists diwaar_orders (
  user_id text not null,
  id text not null,
  kind text not null,
  title text not null,
  amount integer not null,
  method text not null,
  reference text not null,
  status text not null,
  created_at text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_loans (
  user_id text not null,
  id text not null,
  bank text not null,
  product text not null,
  amount integer not null,
  years integer not null,
  property_title text not null,
  stage text not null,
  created_at text not null,
  primary key (user_id, id)
);

create table if not exists diwaar_flags (
  user_id text not null,
  kind text not null,
  ref_id text not null,
  primary key (user_id, kind, ref_id)
);
