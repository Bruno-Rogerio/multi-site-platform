-- Fix: trigger sync_user_profile_from_auth was overwriting site_id with NULL
-- on every auth.users UPDATE (e.g. session refresh, last_sign_in_at update).
-- COALESCE preserves the existing site_id when metadata doesn't carry one.

create or replace function public.sync_user_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
  user_site_id uuid;
begin
  user_role    := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  user_site_id := nullif(new.raw_user_meta_data ->> 'site_id', '')::uuid;

  insert into public.user_profiles (id, email, role, site_id)
  values (new.id, coalesce(new.email, ''), user_role, user_site_id)
  on conflict (id)
  do update set
    email   = excluded.email,
    role    = excluded.role,
    -- Only overwrite site_id when the metadata explicitly carries one;
    -- otherwise keep the value already stored in the row.
    site_id = coalesce(excluded.site_id, user_profiles.site_id);

  return new;
end;
$$;
