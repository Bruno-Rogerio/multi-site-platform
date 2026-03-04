-- ─────────────────────────────────────────────────────────────────────────────
-- Notifications — in-app realtime notification system
-- ─────────────────────────────────────────────────────────────────────────────

create type notification_type as enum (
  'ticket_new',
  'ticket_message',
  'ticket_status_changed',
  'sla_warning'
);

create table public.notifications (
  id         uuid              primary key default gen_random_uuid(),
  user_id    uuid              not null references auth.users(id) on delete cascade,
  type       notification_type not null,
  title      text              not null,
  body       text              not null,
  ticket_id  uuid              references public.support_tickets(id) on delete cascade,
  read       boolean           not null default false,
  created_at timestamptz       not null default now()
);

create index idx_notifications_user_unread on public.notifications(user_id, read);
create index idx_notifications_ticket_id   on public.notifications(ticket_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.notifications enable row level security;

-- Users see only their own notifications
create policy "notifications_select"
on public.notifications for select to authenticated
using (user_id = auth.uid());

-- Users can mark their own notifications as read
create policy "notifications_update"
on public.notifications for update to authenticated
using (user_id = auth.uid());

-- Insert is done exclusively via service role (createSupabaseAdminClient bypasses RLS)

-- ── Realtime ─────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.notifications;
