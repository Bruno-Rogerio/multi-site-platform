-- Add fiscal data fields to billing_profiles for NF emission
alter table public.billing_profiles
  add column if not exists legal_name text,
  add column if not exists address    text,
  add column if not exists postal_code text,
  add column if not exists city        text,
  add column if not exists state       text;
