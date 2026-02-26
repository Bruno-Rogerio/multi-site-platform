-- Migration: tabela de leads para captura antecipada no onboarding
-- Criada em: 2026-02-26

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  business_name text not null,
  business_type text not null,
  subdomain     text,
  wizard_state  jsonb,
  converted_at  timestamptz,
  created_at    timestamptz default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS: apenas service_role pode acessar (sem acesso direto de client)
alter table public.leads enable row level security;
