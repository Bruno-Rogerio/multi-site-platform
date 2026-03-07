-- ─────────────────────────────────────────────────────────────────────────────
-- Page view logs — simple site analytics (Option A: stored in Supabase)
-- ─────────────────────────────────────────────────────────────────────────────

create table public.page_view_logs (
  id         uuid        primary key default gen_random_uuid(),
  site_id    uuid        not null references public.sites(id) on delete cascade,
  visited_at timestamptz not null default now()
);

create index idx_page_view_logs_site_visited
  on public.page_view_logs(site_id, visited_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.page_view_logs enable row level security;

-- Clients may read their own site's stats
create policy "pvl_select_own"
on public.page_view_logs for select to authenticated
using (
  site_id in (
    select site_id from public.user_profiles
    where id = auth.uid() and site_id is not null
  )
);

-- Admins may read all stats
create policy "pvl_select_admin"
on public.page_view_logs for select to authenticated
using (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Inserts done exclusively via service role (createSupabaseAdminClient bypasses RLS)
