-- Add granular address fields to billing_profiles for future NF-e integration.
-- existing: address (logradouro), postal_code, city, state, legal_name
-- new: neighborhood, address_number, address_complement

alter table public.billing_profiles
  add column if not exists neighborhood       text,
  add column if not exists address_number     text,
  add column if not exists address_complement text;
