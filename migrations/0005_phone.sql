-- Phone number OTP support (Better Auth phoneNumber plugin).
-- Adds optional phoneNumber (unique) and phoneNumberVerified columns to the user table.

alter table "user" add column if not exists "phoneNumber" text unique;
alter table "user" add column if not exists "phoneNumberVerified" boolean default false;
