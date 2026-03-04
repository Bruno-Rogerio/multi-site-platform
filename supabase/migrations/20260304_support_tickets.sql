-- ─────────────────────────────────────────────────────────────────────────────
-- Support Tickets — async messaging system between clients and platform admin
-- ─────────────────────────────────────────────────────────────────────────────

create type ticket_category as enum ('suporte', 'duvida', 'faturamento', 'sugestao');
create type ticket_status   as enum ('open', 'in_progress', 'waiting_client', 'resolved');

-- ── Tables ───────────────────────────────────────────────────────────────────

create table public.support_tickets (
  id           uuid            primary key default gen_random_uuid(),
  site_id      uuid            not null references public.sites(id) on delete cascade,
  owner_id     uuid            not null references auth.users(id),
  subject      text            not null,
  category     ticket_category not null,
  status       ticket_status   not null default 'open',
  sla_deadline timestamptz     not null,
  sla_breached boolean         not null default false,
  created_at   timestamptz     not null default now(),
  updated_at   timestamptz     not null default now(),
  resolved_at  timestamptz
);

create table public.ticket_messages (
  id          uuid        primary key default gen_random_uuid(),
  ticket_id   uuid        not null references public.support_tickets(id) on delete cascade,
  sender_role text        not null check (sender_role in ('client', 'admin')),
  sender_id   uuid        not null references auth.users(id),
  body        text        not null,
  attachments jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────

create index idx_support_tickets_site_id   on public.support_tickets(site_id);
create index idx_support_tickets_status    on public.support_tickets(status);
create index idx_support_tickets_updated   on public.support_tickets(updated_at desc);
create index idx_ticket_messages_ticket_id on public.ticket_messages(ticket_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.support_tickets  enable row level security;
alter table public.ticket_messages  enable row level security;

-- Tickets: select — client sees own site's, admin sees all
create policy "support_tickets_select"
on public.support_tickets for select to authenticated
using (exists (
  select 1 from public.user_profiles up
  where up.id = auth.uid()
    and (up.role = 'admin' or up.site_id = support_tickets.site_id)
));

-- Tickets: insert — client creates scoped to own site
create policy "support_tickets_insert"
on public.support_tickets for insert to authenticated
with check (exists (
  select 1 from public.user_profiles up
  where up.id = auth.uid() and up.site_id = site_id
));

-- Tickets: update — admin only (status changes)
create policy "support_tickets_update"
on public.support_tickets for update to authenticated
using (exists (
  select 1 from public.user_profiles up
  where up.id = auth.uid() and up.role = 'admin'
));

-- Messages: select — same visibility as tickets
create policy "ticket_messages_select"
on public.ticket_messages for select to authenticated
using (exists (
  select 1 from public.support_tickets t
  join public.user_profiles up on up.id = auth.uid()
  where t.id = ticket_messages.ticket_id
    and (up.role = 'admin' or up.site_id = t.site_id)
));

-- Messages: insert — both sides, but only if ticket is not resolved
create policy "ticket_messages_insert"
on public.ticket_messages for insert to authenticated
with check (exists (
  select 1 from public.support_tickets t
  join public.user_profiles up on up.id = auth.uid()
  where t.id = ticket_id
    and (up.role = 'admin' or up.site_id = t.site_id)
    and t.status != 'resolved'
));

-- ── Trigger: auto-update ticket on new message ────────────────────────────────

create or replace function public.update_ticket_on_message()
returns trigger language plpgsql security definer as $$
begin
  update public.support_tickets
  set
    updated_at = now(),
    status = case
      when new.sender_role = 'admin' and status = 'open'            then 'in_progress'::ticket_status
      when new.sender_role = 'admin'                                 then 'waiting_client'::ticket_status
      when new.sender_role = 'client' and status = 'waiting_client' then 'in_progress'::ticket_status
      else status
    end
  where id = new.ticket_id;
  return new;
end;
$$;

create trigger ticket_message_inserted
after insert on public.ticket_messages
for each row execute function public.update_ticket_on_message();

-- ── Realtime ─────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.ticket_messages;
alter publication supabase_realtime add table public.support_tickets;
