# Multi Site Platform (SaaS Multi-Tenant)

Plataforma SaaS para profissionais autonomos (psicologos, terapeutas, coaches, etc.)
com sites independentes por dominio em um unico deploy.

## Stack
- Next.js (App Router)
- Supabase (Postgres, Auth, Storage)
- Multi-tenant por `Host` da requisicao

## Primeiros passos
1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis locais:

```bash
cp .env.example .env.local
```

3. Rode o servidor:

```bash
npm run dev
```

4. Acesse:
- Plataforma: `http://localhost:3000`
- Onboarding visual: `http://localhost:3000/quero-comecar`
- Login: `http://localhost:3000/login`
- Admin: `http://localhost:3000/admin`
- Tenant (exemplo): `http://cliente1.localtest.me:3000`

## Estrutura atual
- `middleware.ts`: classifica host (plataforma x tenant) e faz rewrite interno
- `src/app/page.tsx`: landing da plataforma SaaS
- `src/app/t/[tenant]/page.tsx`: vertical slice do tenant (hero/services/cta)
- `src/lib/tenant/host.ts`: helpers de dominio/subdominio
- `src/lib/tenant/service.ts`: busca tenant no Supabase
- `src/components/site/*`: componentes de secoes da landing page
- `src/components/auth/*`: formularios de login e reset de senha
- `src/lib/auth/session.ts`: sessao autenticada + perfil com role/site
- `src/app/api/contact/route.ts`: endpoint do formulario de contato
- `src/app/api/admin/users/route.ts`: provisionamento de usuarios (invite)
- `src/app/api/admin/sections/route.ts`: leitura/edicao de secoes no admin
- `src/app/api/admin/upload-asset/route.ts`: upload de imagens por tenant
- `src/app/api/admin/site-theme/route.ts`: leitura/edicao de branding do site (logo)
- `supabase/schema.sql`: schema inicial + politicas RLS
- `supabase/seed.sql`: seed local com `cliente1.localtest.me` e `app.localtest.me`

## Como funciona o multi-tenant
1. O app le o `host` da requisicao (`x-forwarded-host` ou `host`).
2. `middleware.ts` decide se o host e plataforma ou tenant.
3. Se for tenant, reescreve internamente para `/t/[tenant]/*`.
4. Server Component busca o tenant na tabela `sites` via subdominio.
5. Carrega pagina `home` e secoes da tabela `sections`.
6. Aplica `theme_settings` para cores e tipografia.

### Variantes por tenant
Cada secao pode definir `variant` na tabela `sections` para mudar layout sem clonar o projeto.
Exemplos atuais:
- `hero`: `default`, `split`, `centered`
- `services`: `default`, `minimal`
- `cta`: `default`, `banner`

## Banco de dados (Supabase)
O arquivo `supabase/schema.sql` inclui tabelas:
- `sites`
- `pages`
- `sections`
- `posts`
- `user_profiles`
- `contact_messages`
- `style_presets`
- `palette_presets`
- `template_presets`
- `onboarding_drafts`

## Proximos passos recomendados
1. Adicionar campos de imagem para header/logo e services.
2. Melhorar UX do editor (salvar em lote e historico simples).
3. Adicionar suporte a dominio proprio de cliente no classificador de host.
4. Iniciar onboarding visual "Quero comecar" com preview.
5. Integrar checkout recorrente (Stripe) para provisionamento automatico.

## Onboarding visual (fase atual)
- Fluxo inicial em `/quero-comecar`
- Escolha de estilo geral + variantes de Header/Hero/Services/CTA
- Escolha de paleta de cores com preview instantaneo
- Coleta guiada de dados do negocio
- Escolha de addons com estimativa de valor mensal
- Resumo final com criacao de rascunho real em `/api/onboarding/draft`

## Auth (robusto)
- Nao existe auto-cadastro no produto.
- Usuarios sao provisionados por admin via invite (`/api/admin/users`).
- Opcional: definir `SUPABASE_AUTH_PROVISION_MODE=password` para criar usuario com senha temporaria (sem envio de email).
- Primeiro acesso e recuperacao usam email + `/auth/callback` + `/reset-password`.
- `user_profiles` e sincronizado automaticamente a partir de `auth.users` via trigger SQL.
- RLS aplica escopo por role/site para evitar vazamento entre tenants.

## Storage (imagens)
- Configure um bucket publico no Supabase (padrao: `site-assets`).
- Ajuste `SUPABASE_ASSETS_BUCKET` no `.env.local` se usar outro nome.
- Upload no admin funciona via endpoint protegido `/api/admin/upload-asset`.
- Campos de imagem atualmente: Hero, Services e CTA, alem de logo no header/footer.

## Deploy
Um unico projeto Next.js no Vercel, com varios dominios apontando para o mesmo deploy.
