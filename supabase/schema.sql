-- Initial schema for the multi-tenant SaaS platform.
-- Idempotent and safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  plan text not null check (plan in ('landing', 'pro')),
  theme_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null,
  title text not null,
  unique (site_id, slug)
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null check (type in ('hero', 'about', 'services', 'cta', 'testimonials', 'contact')),
  variant text not null default 'default',
  content jsonb not null default '{}'::jsonb,
  "order" int not null default 0
);

alter table public.sections add column if not exists variant text not null default 'default';
alter table public.sections drop constraint if exists sections_type_check;
alter table public.sections
add constraint sections_type_check
check (type in ('hero', 'about', 'services', 'cta', 'testimonials', 'contact'));

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null default '',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (site_id, slug)
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin', 'client')),
  site_id uuid references public.sites(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sections_page_order on public.sections(page_id, "order");
create index if not exists idx_posts_site_published_at on public.posts(site_id, published_at desc);
create index if not exists idx_contact_messages_site_created_at on public.contact_messages(site_id, created_at desc);

alter table public.sites enable row level security;
alter table public.pages enable row level security;
alter table public.sections enable row level security;
alter table public.posts enable row level security;
alter table public.user_profiles enable row level security;
alter table public.contact_messages enable row level security;

-- Sync auth.users metadata -> user_profiles (role + site scope).
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
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  user_site_id := nullif(new.raw_user_meta_data ->> 'site_id', '')::uuid;

  insert into public.user_profiles (id, email, role, site_id)
  values (new.id, coalesce(new.email, ''), user_role, user_site_id)
  on conflict (id)
  do update set
    email = excluded.email,
    role = excluded.role,
    site_id = excluded.site_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.sync_user_profile_from_auth();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute function public.sync_user_profile_from_auth();

-- Drop previous policies before recreating (idempotent).
drop policy if exists "public can read sites" on public.sites;
drop policy if exists "clients can read own site" on public.sites;
drop policy if exists "public can read pages" on public.pages;
drop policy if exists "public can read sections" on public.sections;
drop policy if exists "public can read posts" on public.posts;
drop policy if exists "public can insert contact message" on public.contact_messages;
drop policy if exists "users can read own profile" on public.user_profiles;

drop policy if exists "anon can read sites" on public.sites;
drop policy if exists "authenticated can read own or admin sites" on public.sites;
drop policy if exists "authenticated can update own or admin sites" on public.sites;
drop policy if exists "admins can insert sites" on public.sites;
drop policy if exists "admins can delete sites" on public.sites;

drop policy if exists "anon can read pages" on public.pages;
drop policy if exists "authenticated can read scoped pages" on public.pages;
drop policy if exists "authenticated can manage scoped pages" on public.pages;

drop policy if exists "anon can read sections" on public.sections;
drop policy if exists "authenticated can read scoped sections" on public.sections;
drop policy if exists "authenticated can manage scoped sections" on public.sections;

drop policy if exists "anon can read published posts" on public.posts;
drop policy if exists "authenticated can read scoped posts" on public.posts;
drop policy if exists "authenticated can manage scoped posts" on public.posts;

drop policy if exists "anon can insert contact messages" on public.contact_messages;
drop policy if exists "authenticated can read scoped contact messages" on public.contact_messages;
drop policy if exists "admins can delete contact messages" on public.contact_messages;

drop policy if exists "user can read own profile" on public.user_profiles;
drop policy if exists "admins can read all profiles" on public.user_profiles;
drop policy if exists "admins can manage profiles" on public.user_profiles;

-- Public website data (anon only).
create policy "anon can read sites"
on public.sites
for select
to anon
using (true);

create policy "anon can read pages"
on public.pages
for select
to anon
using (true);

create policy "anon can read sections"
on public.sections
for select
to anon
using (true);

create policy "anon can read published posts"
on public.posts
for select
to anon
using (published_at is not null and published_at <= now());

create policy "anon can insert contact messages"
on public.contact_messages
for insert
to anon
with check (true);

-- Authenticated tenant/admin scope.
create policy "authenticated can read own or admin sites"
on public.sites
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = sites.id)
  )
);

create policy "authenticated can update own or admin sites"
on public.sites
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = sites.id)
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = sites.id)
  )
);

create policy "admins can insert sites"
on public.sites
for insert
to authenticated
with check (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.role = 'admin'
  )
);

create policy "admins can delete sites"
on public.sites
for delete
to authenticated
using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.role = 'admin'
  )
);

create policy "authenticated can read scoped pages"
on public.pages
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = pages.site_id)
  )
);

create policy "authenticated can manage scoped pages"
on public.pages
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = pages.site_id)
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = pages.site_id)
  )
);

create policy "authenticated can read scoped sections"
on public.sections
for select
to authenticated
using (
  exists (
    select 1
    from public.pages p
    join public.user_profiles up on up.id = auth.uid()
    where p.id = sections.page_id
      and (up.role = 'admin' or up.site_id = p.site_id)
  )
);

create policy "authenticated can manage scoped sections"
on public.sections
for all
to authenticated
using (
  exists (
    select 1
    from public.pages p
    join public.user_profiles up on up.id = auth.uid()
    where p.id = sections.page_id
      and (up.role = 'admin' or up.site_id = p.site_id)
  )
)
with check (
  exists (
    select 1
    from public.pages p
    join public.user_profiles up on up.id = auth.uid()
    where p.id = sections.page_id
      and (up.role = 'admin' or up.site_id = p.site_id)
  )
);

create policy "authenticated can read scoped posts"
on public.posts
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = posts.site_id)
  )
);

create policy "authenticated can manage scoped posts"
on public.posts
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = posts.site_id)
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = posts.site_id)
  )
);

create policy "authenticated can read scoped contact messages"
on public.contact_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and (up.role = 'admin' or up.site_id = contact_messages.site_id)
  )
);

create policy "admins can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.role = 'admin'
  )
);

create policy "user can read own profile"
on public.user_profiles
for select
to authenticated
using (id = auth.uid());

-- Avoid recursive policy checks by using JWT metadata instead of querying user_profiles again.
create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'role', 'client');
$$;

create policy "admins can read all profiles"
on public.user_profiles
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "admins can manage profiles"
on public.user_profiles
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Preset library for onboarding (styles, palettes and layout templates).
create table if not exists public.style_presets (
  id text primary key,
  category text not null check (category in ('site', 'header', 'hero', 'services', 'cta')),
  name text not null,
  description text not null default '',
  preview_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.palette_presets (
  id text primary key,
  name text not null,
  primary_color text not null,
  accent_color text not null,
  background_color text not null,
  text_color text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.template_presets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  site_style_id text references public.style_presets(id) on delete set null,
  palette_id text references public.palette_presets(id) on delete set null,
  section_variants jsonb not null default '{}'::jsonb,
  theme_overrides jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_drafts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete set null,
  status text not null check (status in ('draft', 'checkout_pending', 'active', 'archived')) default 'draft',
  payload jsonb not null default '{}'::jsonb,
  selected_addons jsonb not null default '[]'::jsonb,
  monthly_total numeric(10,2),
  created_at timestamptz not null default now()
);

create index if not exists idx_style_presets_category_active on public.style_presets(category, is_active);
create index if not exists idx_palette_presets_active on public.palette_presets(is_active);
create index if not exists idx_template_presets_active on public.template_presets(is_active);
create index if not exists idx_onboarding_drafts_status_created_at on public.onboarding_drafts(status, created_at desc);

alter table public.style_presets enable row level security;
alter table public.palette_presets enable row level security;
alter table public.template_presets enable row level security;
alter table public.onboarding_drafts enable row level security;

drop policy if exists "anon can read style presets" on public.style_presets;
drop policy if exists "admins can manage style presets" on public.style_presets;
drop policy if exists "anon can read palette presets" on public.palette_presets;
drop policy if exists "admins can manage palette presets" on public.palette_presets;
drop policy if exists "anon can read template presets" on public.template_presets;
drop policy if exists "admins can manage template presets" on public.template_presets;
drop policy if exists "admins can read onboarding drafts" on public.onboarding_drafts;
drop policy if exists "admins can manage onboarding drafts" on public.onboarding_drafts;

create policy "anon can read style presets"
on public.style_presets
for select
to anon
using (is_active = true);

create policy "admins can manage style presets"
on public.style_presets
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "anon can read palette presets"
on public.palette_presets
for select
to anon
using (is_active = true);

create policy "admins can manage palette presets"
on public.palette_presets
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "anon can read template presets"
on public.template_presets
for select
to anon
using (is_active = true);

create policy "admins can manage template presets"
on public.template_presets
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admins can read onboarding drafts"
on public.onboarding_drafts
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "admins can manage onboarding drafts"
on public.onboarding_drafts
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Billing profiles for invoice/compliance metadata and checkout linkage.
create table if not exists public.billing_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  full_name text not null,
  document text not null,
  document_type text not null check (document_type in ('cpf', 'cnpj')),
  email text not null,
  stripe_customer_id text,
  billing_status text not null default 'checkout_pending' check (billing_status in ('checkout_pending', 'active', 'past_due', 'canceled')),
  monthly_amount numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_billing_profiles_site_id on public.billing_profiles(site_id);
create index if not exists idx_billing_profiles_billing_status on public.billing_profiles(billing_status);

alter table public.billing_profiles enable row level security;

drop policy if exists "admins can read billing profiles" on public.billing_profiles;
drop policy if exists "admins can manage billing profiles" on public.billing_profiles;
drop policy if exists "clients can read own billing profile" on public.billing_profiles;

create policy "admins can read billing profiles"
on public.billing_profiles
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "admins can manage billing profiles"
on public.billing_profiles
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "clients can read own billing profile"
on public.billing_profiles
for select
to authenticated
using (user_id = auth.uid());

-- Singleton config for SaaS/platform branding (admin-only).
create table if not exists public.platform_settings (
  id int primary key check (id = 1),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

drop policy if exists "admins can read platform settings" on public.platform_settings;
drop policy if exists "admins can manage platform settings" on public.platform_settings;
drop policy if exists "anon can read platform settings" on public.platform_settings;

create policy "anon can read platform settings"
on public.platform_settings
for select
to anon
using (true);

create policy "admins can read platform settings"
on public.platform_settings
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "admins can manage platform settings"
on public.platform_settings
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
