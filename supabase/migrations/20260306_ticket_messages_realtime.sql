-- Enable Supabase Realtime for ticket_messages and support_tickets
-- so the messages thread and ticket list update without page refresh.

alter publication supabase_realtime add table public.ticket_messages;
alter publication supabase_realtime add table public.support_tickets;
