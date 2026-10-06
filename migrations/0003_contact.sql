create table if not exists diwaar_contact (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  topic text not null,
  message text not null,
  created_at text not null
);
