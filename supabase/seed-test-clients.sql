-- ============================================================
-- SEED — Clientes de teste: Camila (Básico) + Rafael (Premium)
-- Rode no SQL Editor do Supabase (Dashboard → SQL Editor)
-- Acesso em produção: camila.bsph.com.br | rafael.bsph.com.br
-- ============================================================

begin;

-- ── UUIDs de referência ──────────────────────────────────────
-- Camila site:  c0ca0001-0000-4000-8000-000000000001
-- Camila page:  c0ca0002-0000-4000-8000-000000000002
-- Rafael site:  fa0a0001-0000-4000-8000-000000000001
-- Rafael page:  fa0a0002-0000-4000-8000-000000000002
-- ────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════
-- 1. SITES
-- ══════════════════════════════════════════════════════════════

insert into public.sites (id, name, domain, plan, theme_settings)
values
  -- ── Dra. Camila — Plano Básico ──────────────────────────
  (
    'c0ca0001-0000-4000-8000-000000000001',
    'Camila Ribeiro Nutrição',
    'camila.bsph.com.br',
    'landing',
    '{
      "selectedPlan": "basico",
      "onboardingDraft": false,
      "paletteId": "forest-trust",
      "primaryColor": "#4F6F5B",
      "accentColor": "#8FAF9A",
      "backgroundColor": "#F7F6F2",
      "textColor": "#2C3329",
      "fontFamily": "Inter",
      "buttonStyle": "pill",
      "headerStyle": "transparent",
      "dividerStyle": "none",
      "logoUrl": "",
      "siteName": "Camila Ribeiro Nutrição",
      "whatsapp": "5519991824735",
      "phone": "(19) 3345-2190",
      "email": "contato@camilanutri.com.br",
      "professionalName": "Dra. Camila Ribeiro de Souza",
      "professionalTitle": "Nutricionista Clínica — CRN-3 48721",
      "city": "Campinas – SP"
    }'::jsonb
  ),

  -- ── Rafael Martins — Plano Premium ──────────────────────
  (
    'fa0a0001-0000-4000-8000-000000000001',
    'Rafael Martins | Consultor de Negócios',
    'rafael.bsph.com.br',
    'pro',
    '{
      "selectedPlan": "premium-full",
      "onboardingDraft": false,
      "paletteId": "midnight-violet",
      "primaryColor": "#1F3A5F",
      "accentColor": "#C8A96A",
      "backgroundColor": "#F4F6F8",
      "textColor": "#2F2F2F",
      "fontFamily": "Playfair Display",
      "bodyFont": "Inter",
      "buttonStyle": "rounded",
      "headerStyle": "solid",
      "dividerStyle": "line",
      "logoUrl": "",
      "siteName": "Rafael Martins",
      "whatsapp": "5511998145527",
      "phone": "(11) 3489-2210",
      "email": "contato@rafaelmartins.com.br",
      "professionalName": "Rafael Martins Carvalho",
      "professionalTitle": "Consultor de Negócios & Mentor",
      "city": "São Paulo – SP",
      "instagram": "@rafaelmartinsnegocios",
      "linkedin": "linkedin.com/in/rafaelmartinsconsultor",
      "youtube": "youtube.com/@rafaelmartinsestrategia"
    }'::jsonb
  )
on conflict (domain) do update
set
  name          = excluded.name,
  plan          = excluded.plan,
  theme_settings = excluded.theme_settings;


-- ══════════════════════════════════════════════════════════════
-- 2. PAGES
-- ══════════════════════════════════════════════════════════════

insert into public.pages (id, site_id, slug, title)
values
  ('c0ca0002-0000-4000-8000-000000000002', 'c0ca0001-0000-4000-8000-000000000001', 'home', 'Home — Camila Ribeiro Nutrição'),
  ('fa0a0002-0000-4000-8000-000000000002', 'fa0a0001-0000-4000-8000-000000000001', 'home', 'Home — Rafael Martins')
on conflict (site_id, slug) do update
set title = excluded.title;


-- ══════════════════════════════════════════════════════════════
-- 3. SECTIONS — Camila (Plano Básico)
-- ══════════════════════════════════════════════════════════════

delete from public.sections
where page_id = 'c0ca0002-0000-4000-8000-000000000002';

insert into public.sections (page_id, type, variant, content, "order")
values
  -- Hero
  (
    'c0ca0002-0000-4000-8000-000000000002',
    'hero', 'split',
    '{
      "eyebrow": "Nutricionista Clínica em Campinas",
      "title": "Nutrição simples e sustentável para transformar sua relação com a comida.",
      "subtitle": "Agende sua consulta e comece hoje um plano alimentar possível para sua rotina.",
      "ctaLabel": "Agendar consulta",
      "ctaHref": "https://wa.me/5519991824735",
      "secondaryCta": "Saiba mais",
      "secondaryHref": "#sobre"
    }'::jsonb,
    1
  ),

  -- Sobre
  (
    'c0ca0002-0000-4000-8000-000000000002',
    'about', 'default',
    '{
      "eyebrow": "Sobre mim",
      "title": "Nutrição que cabe na sua rotina",
      "body": "Sou nutricionista clínica formada pela Universidade Estadual de Campinas, com foco em emagrecimento saudável e mudança de hábitos alimentares. Ao longo dos últimos anos tenho ajudado pessoas que já tentaram diversas dietas e não conseguiram manter resultados duradouros.\n\nMeu trabalho é construir um plano alimentar realista, adaptado à rotina de cada paciente. Acredito que comer bem não precisa ser complicado, restritivo ou distante da vida real. O objetivo é criar consistência e autonomia alimentar no longo prazo.",
      "credential": "CRN-3 48721",
      "location": "Campinas – SP",
      "onlineAttendance": true
    }'::jsonb,
    2
  ),

  -- Serviços
  (
    'c0ca0002-0000-4000-8000-000000000002',
    'services', 'cards',
    '{
      "eyebrow": "Serviços",
      "title": "Como posso te ajudar",
      "items": [
        {
          "name": "Consulta Nutricional Inicial",
          "description": "Avaliação completa de hábitos alimentares, composição corporal e histórico de saúde para construção do plano alimentar personalizado.",
          "price": "R$ 180"
        },
        {
          "name": "Acompanhamento Nutricional",
          "description": "Sessão de acompanhamento para ajustes no plano alimentar, análise de progresso e novas estratégias.",
          "price": "R$ 120"
        },
        {
          "name": "Plano Alimentar Personalizado",
          "description": "Estratégia alimentar estruturada com opções de refeições adaptadas à rotina do paciente.",
          "price": "R$ 150"
        },
        {
          "name": "Reeducação Alimentar",
          "description": "Programa focado em mudança gradual de hábitos para quem deseja melhorar saúde e energia no dia a dia.",
          "price": "R$ 200"
        }
      ]
    }'::jsonb,
    3
  ),

  -- Depoimentos
  (
    'c0ca0002-0000-4000-8000-000000000002',
    'testimonials', 'default',
    '{
      "eyebrow": "Depoimentos",
      "title": "O que dizem os pacientes",
      "items": [
        {
          "name": "Mariana Alves",
          "role": "Professora",
          "text": "Eu já tinha tentado várias dietas antes. Com a Camila consegui criar uma rotina alimentar que realmente funciona para mim."
        },
        {
          "name": "Ricardo Mendes",
          "role": "Analista de Sistemas",
          "text": "Perdi 8 kg em quatro meses sem dietas malucas. Foi a primeira vez que consegui manter constância."
        },
        {
          "name": "Patrícia Gonçalves",
          "role": "Enfermeira",
          "text": "O atendimento é muito acolhedor e prático. As orientações são fáceis de aplicar no dia a dia."
        }
      ]
    }'::jsonb,
    4
  ),

  -- CTA / Contato
  (
    'c0ca0002-0000-4000-8000-000000000002',
    'cta', 'banner',
    '{
      "title": "Pronta para cuidar da sua alimentação?",
      "description": "Atendimento online e presencial. Segunda a sexta, 9h–18h. Sábado, 9h–13h.",
      "buttonLabel": "Falar no WhatsApp",
      "buttonHref": "https://wa.me/5519991824735",
      "secondaryLabel": "contato@camilanutri.com.br",
      "secondaryHref": "mailto:contato@camilanutri.com.br",
      "disclaimer": "Atendimento particular · Consulta online disponível"
    }'::jsonb,
    5
  );


-- ══════════════════════════════════════════════════════════════
-- 4. SECTIONS — Rafael (Plano Premium)
-- ══════════════════════════════════════════════════════════════

delete from public.sections
where page_id = 'fa0a0002-0000-4000-8000-000000000002';

insert into public.sections (page_id, type, variant, content, "order")
values
  -- Hero
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'hero', 'centered',
    '{
      "eyebrow": "Mentoria Estratégica para Profissionais",
      "title": "Transforme seu conhecimento em um negócio lucrativo.",
      "subtitle": "Mentoria estratégica para profissionais autônomos que querem crescer com método.",
      "valueProposition": "Ajudo especialistas a estruturar posicionamento, vendas e crescimento previsível.",
      "ctaLabel": "Quero conhecer a mentoria",
      "ctaHref": "https://wa.me/5511998145527",
      "secondaryCta": "Ver programas",
      "secondaryHref": "#servicos"
    }'::jsonb,
    1
  ),

  -- Sobre
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'about', 'default',
    '{
      "eyebrow": "Sobre Rafael",
      "title": "De gestor a mentor de especialistas",
      "body": "Durante mais de dez anos trabalhei com estratégia e gestão de negócios. Nesse período percebi que muitos profissionais altamente qualificados — psicólogos, nutricionistas, advogados e consultores — têm enorme conhecimento técnico, mas dificuldade em estruturar um negócio sustentável.\n\nFoi assim que comecei a trabalhar com mentoria estratégica para profissionais autônomos. Meu foco é transformar conhecimento em posicionamento claro, serviços bem estruturados e vendas previsíveis.\n\nMeu método combina três pilares: posicionamento de mercado, estrutura de oferta e aquisição consistente de clientes. O objetivo não é apenas faturar mais, mas construir um negócio sólido e sustentável no longo prazo.",
      "credentials": ["MBA em Gestão Estratégica — FGV", "Certified Business Coach — IBC", "Mentor de Empreendedores Digitais"],
      "location": "São Paulo – SP",
      "onlineAttendance": true
    }'::jsonb,
    2
  ),

  -- Serviços
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'services', 'cards',
    '{
      "eyebrow": "Programas",
      "title": "Como posso te ajudar",
      "items": [
        {
          "name": "Mentoria Estratégica Individual",
          "description": "Programa de acompanhamento para estruturação completa do negócio. Sessões semanais online ao longo de 8 semanas.",
          "format": "Online · 8 semanas",
          "price": "R$ 3.200"
        },
        {
          "name": "Diagnóstico de Negócio",
          "description": "Análise profunda de posicionamento, oferta, precificação e aquisição de clientes em uma sessão estratégica.",
          "format": "Online · 90 min",
          "price": "R$ 480"
        },
        {
          "name": "Programa Estrutura de Ofertas",
          "description": "Criação e organização de serviços escaláveis para profissionais autônomos. Formato em grupo.",
          "format": "Grupo online · 4 semanas",
          "price": "R$ 1.200"
        },
        {
          "name": "Consultoria de Posicionamento",
          "description": "Definição de nicho, comunicação e estratégia de autoridade para se destacar no mercado.",
          "format": "Online ou presencial",
          "price": "R$ 850"
        },
        {
          "name": "Workshop Vendas para Especialistas",
          "description": "Treinamento prático sobre vendas consultivas e aquisição de clientes para profissionais técnicos.",
          "format": "Online ao vivo",
          "price": "R$ 290"
        }
      ]
    }'::jsonb,
    3
  ),

  -- Depoimentos
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'testimonials', 'default',
    '{
      "eyebrow": "Resultados",
      "title": "Quem já transformou o negócio",
      "items": [
        {
          "name": "Ana Paula Rocha",
          "role": "Psicóloga",
          "result": "+70% de faturamento em 6 meses",
          "text": "Eu tinha muitos atendimentos mas pouca organização financeira. A mentoria ajudou a estruturar meus serviços e hoje tenho agenda cheia."
        },
        {
          "name": "Lucas Andrade",
          "role": "Personal Trainer",
          "result": "De 8 para 25 alunos recorrentes",
          "text": "O Rafael me ajudou a posicionar melhor meus serviços e criar pacotes mais claros para os clientes."
        },
        {
          "name": "Juliana Freitas",
          "role": "Nutricionista",
          "result": "Ticket médio dobrado",
          "text": "Aprendi a comunicar melhor meu valor profissional e estruturar programas em vez de apenas consultas isoladas."
        },
        {
          "name": "Fernando Campos",
          "role": "Advogado",
          "result": "Consultoria jurídica online estruturada",
          "text": "A mentoria trouxe visão estratégica para transformar meu conhecimento em um serviço escalável."
        }
      ]
    }'::jsonb,
    4
  ),

  -- Blog
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'blog', 'default',
    '{
      "eyebrow": "Conteúdo",
      "title": "Artigos e insights",
      "preview": [
        {
          "title": "Como profissionais autônomos podem atrair mais clientes",
          "category": "Marketing",
          "summary": "Estratégias práticas de posicionamento e autoridade para profissionais liberais.",
          "date": "2026-03-12",
          "slug": "atrair-mais-clientes"
        },
        {
          "title": "Por que muitos especialistas têm dificuldade em vender",
          "category": "Vendas",
          "summary": "Análise dos principais bloqueios de vendas entre profissionais técnicos e acadêmicos.",
          "date": "2026-02-28",
          "slug": "dificuldade-em-vender"
        },
        {
          "title": "O erro mais comum na precificação de serviços",
          "category": "Negócios",
          "summary": "Como definir preço baseado em valor e não apenas em horas trabalhadas.",
          "date": "2026-02-14",
          "slug": "precificacao-de-servicos"
        }
      ]
    }'::jsonb,
    5
  ),

  -- Galeria
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'gallery', 'default',
    '{
      "eyebrow": "Galeria",
      "title": "Bastidores e momentos",
      "items": [
        { "caption": "Mentoria estratégica em andamento", "alt": "Rafael orientando cliente em frente a notebook" },
        { "caption": "Workshop presencial", "alt": "Sala com participantes acompanhando apresentação" },
        { "caption": "Planejamento de negócios", "alt": "Quadro branco com mapa estratégico" },
        { "caption": "Gravação de conteúdo", "alt": "Rafael gravando aula ou vídeo educacional" },
        { "caption": "Reunião em coworking", "alt": "Ambiente moderno com notebook e café" },
        { "caption": "Mentoria online ao vivo", "alt": "Tela de chamada com cliente" }
      ]
    }'::jsonb,
    6
  ),

  -- Eventos
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'events', 'default',
    '{
      "eyebrow": "Agenda",
      "title": "Próximos eventos",
      "items": [
        {
          "name": "Workshop Estruturando seu Negócio",
          "date": "2026-04-25",
          "format": "Online",
          "spots": 40,
          "price": "R$ 197",
          "ctaLabel": "Garantir minha vaga",
          "ctaHref": "https://wa.me/5511998145527"
        },
        {
          "name": "Imersão Profissionais de Alta Performance",
          "date": "2026-05-10",
          "format": "Presencial — São Paulo",
          "spots": 25,
          "price": "R$ 890",
          "ctaLabel": "Quero participar",
          "ctaHref": "https://wa.me/5511998145527"
        }
      ]
    }'::jsonb,
    7
  ),

  -- CTA Final
  (
    'fa0a0002-0000-4000-8000-000000000002',
    'cta', 'banner',
    '{
      "title": "Pronto para estruturar seu negócio?",
      "description": "Atendimento online e presencial. Segunda a sexta, 9h–19h.",
      "buttonLabel": "Falar com Rafael",
      "buttonHref": "https://wa.me/5511998145527",
      "secondaryLabel": "contato@rafaelmartins.com.br",
      "secondaryHref": "mailto:contato@rafaelmartins.com.br",
      "disclaimer": "Atendimento online e presencial · São Paulo – SP"
    }'::jsonb,
    8
  );


-- ══════════════════════════════════════════════════════════════
-- 5. POSTS — Rafael (artigos do blog)
-- ══════════════════════════════════════════════════════════════

insert into public.posts (site_id, title, slug, content, seo_title, seo_description, published_at)
values
  (
    'fa0a0001-0000-4000-8000-000000000001',
    'Como profissionais autônomos podem atrair mais clientes',
    'atrair-mais-clientes',
    'Estratégias práticas de posicionamento e autoridade para profissionais liberais que querem crescer com consistência. Descubra como definir seu nicho, comunicar seu valor e construir uma presença digital que converte.',
    'Como atrair mais clientes sendo autônomo | Rafael Martins',
    'Estratégias práticas de posicionamento e autoridade para profissionais liberais.',
    '2026-03-12 10:00:00+00'
  ),
  (
    'fa0a0001-0000-4000-8000-000000000001',
    'Por que muitos especialistas têm dificuldade em vender',
    'dificuldade-em-vender',
    'Análise dos principais bloqueios de vendas entre profissionais técnicos e acadêmicos. Entenda por que conhecimento técnico não é suficiente e como desenvolver a habilidade de comunicar valor.',
    'Por que especialistas têm dificuldade em vender | Rafael Martins',
    'Os principais bloqueios de vendas que impedem profissionais técnicos de crescer.',
    '2026-02-28 10:00:00+00'
  ),
  (
    'fa0a0001-0000-4000-8000-000000000001',
    'O erro mais comum na precificação de serviços',
    'precificacao-de-servicos',
    'Como definir preço baseado em valor e não apenas em horas trabalhadas. Descubra o método que profissionais de alta performance usam para precificar de forma estratégica e lucrativa.',
    'Como precificar seus serviços corretamente | Rafael Martins',
    'Aprenda a precificar por valor, não por hora trabalhada.',
    '2026-02-14 10:00:00+00'
  )
on conflict (site_id, slug) do update
set
  title           = excluded.title,
  content         = excluded.content,
  seo_title       = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at    = excluded.published_at;


commit;

-- ============================================================
-- PRÓXIMOS PASSOS:
--
-- 1. Crie as contas de usuário pelo painel Supabase Auth:
--    - camila@teste.com  (senha: Teste@123)  → role: client
--    - rafael@teste.com  (senha: Teste@123)  → role: client
--
-- 2. Depois de criar, atualize user_profiles para vincular
--    cada usuário ao site correto:
--
--    update public.user_profiles
--    set site_id = 'c0ca0001-0000-4000-8000-000000000001'
--    where email = 'camila@teste.com';
--
--    update public.user_profiles
--    set site_id = 'fa0a0001-0000-4000-8000-000000000001'
--    where email = 'rafael@teste.com';
--
-- 3. Acesse em produção:
--    https://camila.bsph.com.br
--    https://rafael.bsph.com.br
-- ============================================================
