# BuildSphere - Platform Overview

## 1) What this platform is

BuildSphere is a multi-tenant SaaS for autonomous professionals (ex: psychologists, therapists, coaches) to have a professional website without dealing with code, hosting, or deployment.

Core idea:
- one codebase
- one infrastructure
- many clients (tenants)
- each tenant has its own public site and isolated content

Business model:
- monthly subscription (hosting + panel + maintenance)
- no setup fee (client configures everything during onboarding)

---

## 2) Product goals

Main goals for the MVP:
- Deploy the app once.
- Allow each client to have a unique site under subdomain.
- Give clients a simple admin panel to edit content, images, CTA and theme.
- Keep platform admin controls separated from client controls.
- Prepare the base for checkout/subscription and future feature expansion.

---

## 3) High-level architecture

Frontend:
- Next.js (App Router)
- Dynamic rendering by host/subdomain

Backend:
- Supabase
  - PostgreSQL (app data)
  - Auth (users, sessions, role-based access)
  - Storage (images/assets)

Hosting:
- Vercel (single project)

---

## 4) Multi-tenant model (domain routing)

Platform hosts:
- root domain
- `www`
- `app`
- localhost/localtest environments (for development)

Tenant hosts:
- `<tenant>.<platform-domain>`

Routing strategy:
- Middleware classifies host as `platform` or `tenant` (no DB call in middleware).
- Tenant requests are rewritten to internal route: `/t/[tenant]...`.
- Platform-only routes (`/admin`, `/login`, etc.) are blocked for tenant hosts.

---

## 5) User roles and access model

### Platform admin
- Accesses platform admin area (`/admin/platform`).
- Manages internal team/admins.
- Manages platform branding/settings.
- Sees operational metrics.

### Client user
- Accesses client admin area (`/admin/client`).
- Edits only own tenant data (sections, theme, CTA, media).
- Cannot access other tenants.

Security basis:
- Supabase Auth sessions
- Row Level Security (RLS) in DB
- Role-based checks in app layer
- Host-based separation (platform vs tenant)

---

## 6) Data model (main entities)

Main tables:
- `sites`: tenant identity, domain, plan, theme settings
- `pages`: logical pages per site
- `sections`: modular blocks (hero/services/cta/etc) with JSON content
- `posts`: blog posts (for pro plan)
- `user_profiles`: role + site scoping linked to auth user
- `contact_messages`: form submissions
- `onboarding_drafts`: pre-checkout onboarding choices
- `billing_profiles`: subscription/customer state
- `platform_settings`: singleton settings for SaaS brand assets/text
- `style_presets`, `palette_presets`, `template_presets`: onboarding/template catalog

---

## 7) Current product flows (implemented foundation)

1. Public platform landing (`/`)
   - SaaS presentation
   - CTA to onboarding (`/quero-comecar`)

2. Guided onboarding (`/quero-comecar`)
   - style/theme/sections/business info/add-ons
   - live preview while selecting options
   - draft creation endpoint
   - checkout bootstrap endpoint (Stripe integration flow in progress)

3. Authentication
   - login/logout/reset flow
   - role-aware redirect from `/admin`
     - admin -> `/admin/platform`
     - client -> `/admin/client`

4. Client admin
   - section editing
   - image upload
   - theme controls
   - tenant-scoped operations

5. Platform admin
   - basic operational dashboard
   - internal admin creation flow
   - platform branding editor (logo/hero/banner)

---

## 8) Design direction

Brand direction:
- clean-tech, premium, modern
- strong visual identity for SaaS layer
- tenant templates with selectable style/palette
- mobile-first behavior expected in all experiences

---

## 9) Stripe and commercial model

Intended commercial flow:
- user configures website in onboarding
- user registers account
- user goes to Stripe recurring checkout
- payment/webhook confirms subscription
- tenant activation becomes official

Current status:
- checkout pipeline base exists
- webhook/config finalization and production hardening are ongoing steps

---

## 10) What comes next (short roadmap)

Near-term priorities:
- finalize onboarding customization controls (font, icon style, CTA variants, button style)
- complete recurring billing lifecycle (Stripe webhook + subscription states)
- improve visual quality for platform and onboarding (premium polish)
- expand platform admin metrics and team permissions
- strengthen tenant/client operational tools

Mid-term:
- add controlled upsells/add-ons
- blog/pro features expansion
- advanced motion/layout controls
- custom domains support

---

## 11) Guiding principles

- Keep platform and tenant concerns clearly separated.
- Prioritize isolation and data safety over speed shortcuts.
- Deliver a premium visual experience (not generic templates).
- Keep flows simple for end users and operationally efficient for the team.
