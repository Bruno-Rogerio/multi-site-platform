-- Seed data for local development with localtest.me subdomains.
-- Run after supabase/schema.sql.

begin;

insert into public.sites (id, name, domain, plan, theme_settings)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Cliente 1 Psicologia',
    'cliente1.localtest.me',
    'landing',
    '{
      "primaryColor": "#2348c2",
      "accentColor": "#f28d49",
      "backgroundColor": "#fffdf7",
      "textColor": "#1d1d2f",
      "fontFamily": "Inter, system-ui, sans-serif",
      "buttonStyle": "pill"
    }'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'App Platform Host (Reserved)',
    'app.localtest.me',
    'pro',
    '{
      "primaryColor": "#202020",
      "accentColor": "#ff7043",
      "backgroundColor": "#ffffff",
      "textColor": "#161616",
      "fontFamily": "Inter, system-ui, sans-serif",
      "buttonStyle": "rounded"
    }'::jsonb
  )
on conflict (domain) do update
set
  name = excluded.name,
  plan = excluded.plan,
  theme_settings = excluded.theme_settings;

insert into public.pages (id, site_id, slug, title)
values
  (
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    'home',
    'Home Cliente 1'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'home',
    'Home App Host'
  )
on conflict (site_id, slug) do update
set
  title = excluded.title;

delete from public.sections
where page_id in (
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444'
);

insert into public.sections (id, page_id, type, variant, content, "order")
values
  (
    '55555555-5555-4555-8555-555555555555',
    '33333333-3333-4333-8333-333333333333',
    'hero',
    'split',
    '{
      "eyebrow": "Psicologia online",
      "title": "Cuidado emocional para viver com mais clareza",
      "subtitle": "Atendimento individual com foco em ansiedade, limites e rotina."
    }'::jsonb,
    1
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '33333333-3333-4333-8333-333333333333',
    'services',
    'minimal',
    '{
      "title": "Como posso te ajudar",
      "items": [
        "Ansiedade e estresse",
        "Autoconfianca no trabalho",
        "Organizacao emocional",
        "Relacionamentos e limites"
      ]
    }'::jsonb,
    2
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '33333333-3333-4333-8333-333333333333',
    'cta',
    'banner',
    '{
      "title": "Vamos conversar?",
      "description": "Clique no botao para iniciar seu atendimento.",
      "buttonLabel": "Falar no WhatsApp",
      "buttonHref": "https://wa.me/5511999999999"
    }'::jsonb,
    3
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '44444444-4444-4444-8444-444444444444',
    'hero',
    'centered',
    '{
      "eyebrow": "Host reservado",
      "title": "app.localtest.me e plataforma",
      "subtitle": "Esse registro existe apenas para validar seed e dominios reservados."
    }'::jsonb,
    1
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '44444444-4444-4444-8444-444444444444',
    'services',
    'default',
    '{
      "title": "Nao usado no runtime",
      "items": ["Registro de apoio para o seed"]
    }'::jsonb,
    2
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '44444444-4444-4444-8444-444444444444',
    'cta',
    'default',
    '{
      "title": "Rota bloqueada no middleware",
      "description": "app.localtest.me nao e tenant.",
      "buttonLabel": "Voltar",
      "buttonHref": "/"
    }'::jsonb,
    3
  );

insert into public.style_presets (id, category, name, description, preview_config, is_active)
values
  ('minimal-clean', 'site', 'Minimal Clean', 'Limpo, leve e focado em clareza.', '{"vibe":"Aereo"}'::jsonb, true),
  ('soft-human', 'site', 'Soft Human', 'Acolhedor para saude e consultoria.', '{"vibe":"Empatico"}'::jsonb, true),
  ('editorial', 'site', 'Editorial Premium', 'Visual elegante com credibilidade.', '{"vibe":"Luxo"}'::jsonb, true),
  ('tech-modern', 'site', 'Tech Modern', 'Impacto digital e energia tech.', '{"vibe":"Inovador"}'::jsonb, true),
  ('bold-contrast', 'site', 'Bold Contrast', 'Tipografia forte e secoes marcantes.', '{"vibe":"Atitude"}'::jsonb, true),
  ('organic-warm', 'site', 'Organic Warm', 'Tons quentes e proximidade humana.', '{"vibe":"Calor"}'::jsonb, true)
on conflict (id) do update
set
  category = excluded.category,
  name = excluded.name,
  description = excluded.description,
  preview_config = excluded.preview_config,
  is_active = excluded.is_active;

insert into public.palette_presets (id, name, primary_color, accent_color, background_color, text_color, is_active)
values
  ('buildsphere', 'BuildSphere', '#3B82F6', '#22D3EE', '#0B1020', '#EAF0FF', true),
  ('midnight-violet', 'Midnight Violet', '#7C5CFF', '#38BDF8', '#111827', '#EEF2FF', true),
  ('aurora-soft', 'Aurora Soft', '#2563EB', '#A78BFA', '#F8FAFC', '#0F172A', true),
  ('warm-premium', 'Warm Premium', '#C2410C', '#FB7185', '#1C1917', '#FFF7ED', true),
  ('forest-trust', 'Forest Trust', '#15803D', '#22C55E', '#0F172A', '#ECFDF5', true),
  ('mono-pro', 'Mono Pro', '#111827', '#52525B', '#FAFAFA', '#09090B', true)
on conflict (id) do update
set
  name = excluded.name,
  primary_color = excluded.primary_color,
  accent_color = excluded.accent_color,
  background_color = excluded.background_color,
  text_color = excluded.text_color,
  is_active = excluded.is_active;

insert into public.template_presets (slug, name, description, site_style_id, palette_id, section_variants, theme_overrides, is_active)
values
  (
    'therapy-pro-split',
    'Therapy Pro Split',
    'Template de servico com hero split e CTA banner.',
    'soft-human',
    'buildsphere',
    '{"hero":"split","services":"minimal","cta":"banner"}'::jsonb,
    '{}'::jsonb,
    true
  ),
  (
    'consulting-editorial',
    'Consulting Editorial',
    'Template premium com narrativa mais institucional.',
    'editorial',
    'midnight-violet',
    '{"hero":"centered","services":"default","cta":"default"}'::jsonb,
    '{}'::jsonb,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  site_style_id = excluded.site_style_id,
  palette_id = excluded.palette_id,
  section_variants = excluded.section_variants,
  theme_overrides = excluded.theme_overrides,
  is_active = excluded.is_active;

commit;
