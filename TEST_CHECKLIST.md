# Checklist de Testes — Plataforma BuildSphere
> Gerado em 2026-03-06 · Marque cada item após validar

---

## 0. Pré-requisitos

- [ ] Variáveis de ambiente configuradas (`.env.local`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_ESSENCIAL`, `STRIPE_PRICE_ID_PREMIUM`
- [ ] Migration `20260306_page_views.sql` executada no Supabase (tabela `page_view_logs`)
- [ ] Migration `20260306_ticket_messages_realtime.sql` executada (realtime em `ticket_messages` + `support_tickets`)
- [ ] Supabase Realtime habilitado no painel para as tabelas `ticket_messages`, `support_tickets`, `notifications`
- [ ] DNS: `*.bsph.com.br` apontando para o deploy
- [ ] Resend: domínio `bsph.com.br` verificado + from address configurado
- [ ] Stripe: webhook endpoint registrado (`/api/stripe/webhook`) com evento `checkout.session.completed`
- [ ] `npm run dev` (ou build de produção) rodando sem erros no terminal

---

## 1. Onboarding — Captura de Lead

### 1.1 Formulário inicial (desktop)
- [ ] Acessar `https://bsph.com.br` → landing page carrega corretamente
- [ ] Scroll até a seção "Começar" → formulário de lead visível
- [ ] Preencher nome + e-mail válido + tipo de negócio → clicar "Continuar"
- [ ] Verificar que lead foi salvo em `onboarding_drafts` (Supabase > Table Editor)
- [ ] E-mail de boas-vindas recebido (checar caixa de entrada + spam)
- [ ] Tentar enviar o mesmo e-mail duas vezes → deve retornar erro "e-mail já cadastrado" ou avançar para o passo seguinte

### 1.2 Rate limit no save-lead
- [ ] Enviar o formulário de lead 6× seguidas com IPs/e-mails variados (ou via ferramenta HTTP) → a 6ª requisição deve retornar HTTP 429

### 1.3 Wizard — Plano Essencial (R$ 59,90/mês)
- [ ] Após lead capturado, avançar no wizard até a seleção de plano
- [ ] Selecionar plano **Essencial**
- [ ] Preencher dados do negócio (nome, segmento, telefone/WhatsApp)
- [ ] Chegar ao passo de preview → site preview renderizado corretamente
- [ ] Clicar "Publicar / Ir para pagamento" → Stripe Checkout embedded abre
- [ ] Completar pagamento com cartão de teste (`4242 4242 4242 4242`, qualquer data/cvv)
- [ ] Webhook recebido → site criado em `sites` + usuário criado em `auth.users` + `user_profiles`
- [ ] E-mail de confirmação/senha enviado ao novo proprietário
- [ ] Subdomain acessível: `https://<slug>.bsph.com.br` → site carrega sem auth gate

### 1.4 Wizard — Plano Premium Full (R$ 109,80/mês)
- [ ] Repetir fluxo completo com plano **Premium Full**
- [ ] Verificar que `theme_settings.selectedPlan === "premium-full"` no Supabase
- [ ] SLA de tickets será 2h (verificar em ticket criado pelo cliente deste site)

### 1.5 Rate limit no register-owner e register-checkout
- [ ] Enviar `POST /api/onboarding/register-owner` 4× → 4ª deve retornar 429
- [ ] Enviar `POST /api/onboarding/register-checkout` 4× → 4ª deve retornar 429

---

## 2. Autenticação

### 2.1 Login padrão
- [ ] Acessar `/login` → formulário de login renderiza
- [ ] Login com credenciais inválidas → mensagem de erro em português
- [ ] Login com credenciais válidas (client ou admin) → redireciona para `/admin`

### 2.2 Verificação de e-mail
- [ ] Criar conta sem verificar o e-mail → tentar acessar `/admin` → redirecionado para `/verify-email`
- [ ] Página `/verify-email` exibe aviso amber com link para reenviar
- [ ] Clicar "Reenviar link" → e-mail de verificação recebido
- [ ] Clicar no link de verificação → `email_confirmed_at` preenchido no Supabase
- [ ] Fazer login novamente → acesso liberado ao `/admin`
- [ ] Tentar `/api/onboarding/resend-verification` 4× → 4ª retorna 429

### 2.3 Session timeout (30 min)
- [ ] Login como qualquer usuário → acessar `/admin`
- [ ] Aguardar 28 minutos sem interação (ou alterar `WARN_MS` temporariamente para teste rápido)
- [ ] Aviso "Sessão prestes a expirar" aparece no canto inferior direito
- [ ] Clicar "Continuar conectado" → aviso some, timer reinicia
- [ ] Aguardar mais 2 minutos → logout automático + redirecionado para `/login?reason=session_expired`
- [ ] Mensagem "Sessão encerrada por inatividade" exibida no login

### 2.4 2FA / TOTP (apenas admin da plataforma)
- [ ] Login como admin → ir para `/admin/platform/settings`
- [ ] Seção "Segurança da conta" → "Ativar autenticador TOTP" visível
- [ ] Clicar "Ativar" → QR code SVG + código secreto exibidos
- [ ] Escanear QR com Google Authenticator / Authy
- [ ] Inserir código de 6 dígitos → TOTP ativado (badge "Ativo" aparece)
- [ ] Fazer logout → login novamente com mesmas credenciais
- [ ] Redirecionado para `/auth/mfa` (desafio TOTP)
- [ ] Inserir código incorreto → mensagem de erro
- [ ] Inserir código correto → redirecionado para `/admin`
- [ ] Voltar em `/admin/platform/settings` → "Desativar TOTP" disponível → desativar
- [ ] Login sem TOTP funciona normalmente após desativação

---

## 3. Painel Admin — Platform (role: admin)

### 3.1 Visão geral
- [ ] Login como admin → `/admin/platform` carrega (dashboard com stat cards)
- [ ] Sidebar: links para Sites, Usuários, Pipeline, Mensagens, Configurações visíveis
- [ ] Topbar: nome do usuário + badge "Admin" + botão logout

### 3.2 Sites (`/admin/platform/sites`)
- [ ] Lista de sites carrega (tabela com busca + paginação)
- [ ] Buscar por nome de site → filtro funciona em tempo real
- [ ] Clicar em um site → detalhes / ações disponíveis (ex: suspender)
- [ ] Suspender um site → `theme_settings.suspended = true`
- [ ] Acessar o site suspenso `https://<slug>.bsph.com.br` → tela de "indisponível" sem expor dados de billing
- [ ] Reativar o site → site volta a aparecer normalmente

### 3.3 Usuários (`/admin/platform/users`)
- [ ] Lista de usuários carrega com roles corretas
- [ ] Convidar novo usuário (em `/admin/platform/settings`) → e-mail de convite enviado
- [ ] Usuário convidado aparece na lista após aceitar

### 3.4 Pipeline Kanban (`/admin/platform/pipeline`)
- [ ] Board com colunas "Rascunho", "Checkout pendente", "Ativo", "Arquivado" renderiza
- [ ] Cards de leads/drafts aparecem nas colunas corretas
- [ ] **Desktop**: arrastar card de "Rascunho" para "Checkout pendente" → card move
- [ ] Verificar na DB que `onboarding_drafts.status` foi atualizado
- [ ] Arrastar card de "Checkout pendente" para "Ativo" → move + persiste
- [ ] Arrastar para "Arquivado" → move + persiste
- [ ] Tentar clicar em card sem arrastar → ação de clique não ativa drag (activationConstraint distance=8)
- [ ] Soltar card fora de qualquer coluna → card volta à posição original (rollback)

### 3.5 Mensagens/Tickets (`/admin/platform/messages`)
- [ ] Lista de tickets carrega ordenada por `sla_deadline` asc
- [ ] Tickets com SLA vencido exibem badge vermelho pulsante "SLA violado"
- [ ] Selecionar ticket → thread de mensagens carrega
- [ ] Responder como admin → mensagem aparece no thread
- [ ] **Realtime**: abrir outra aba como cliente e enviar mensagem → aparece na aba admin sem refresh
- [ ] **Realtime lista**: cliente abre novo chamado → aparece na lista do admin sem refresh

### 3.6 SLA automático
- [ ] Via Supabase SQL: `UPDATE support_tickets SET sla_deadline = now() - interval '1 hour' WHERE id = '<id>'`
- [ ] Fazer `GET /api/admin/tickets` (admin logado) → verificar que `sla_breached = true` no ticket modificado
- [ ] Via SQL: criar ticket com `sla_deadline = now() + interval '1 hour'`
- [ ] Fazer GET novamente → verificar que notificação `sla_warning` foi criada em `notifications`

### 3.7 Configurações da plataforma (`/admin/platform/settings`)
- [ ] Seção "Convidar usuário" funciona
- [ ] Seção "Segurança da conta" (MFA) — testado no item 2.4

---

## 4. Painel Admin — Client (role: client)

### 4.1 Dashboard (`/admin/client`)
- [ ] Login como cliente → `/admin/client` carrega
- [ ] **Estado rascunho** (site em draft): banner/countdown de pré-visualização visível, botão para publicar
- [ ] **Estado ativo**: 4 cards visuais (Editor, Aparência, Mensagens, Configurações)
- [ ] **Cards de analytics** (site ativo): "Visitas hoje", "Visitas esta semana", "Visitas este mês" visíveis com números

### 4.2 Editor de conteúdo (`/admin/client/editor`)
- [ ] Editor carrega com seções do site
- [ ] Editar texto de uma seção → salvar → mudança refletida no site público
- [ ] Adicionar nova seção → aparece no site
- [ ] Remover seção → some do site

### 4.3 Aparência (`/admin/client/appearance`)
- [ ] **Plano Essencial (básico)**: apenas upload de logo disponível; demais opções desabilitadas ou ocultas
- [ ] **Plano Premium Full**: editor completo visível
  - [ ] 13 paletas de cores disponíveis → aplicar → site atualiza
  - [ ] Seletor de fonte funcional
  - [ ] Estilos de botão (rounded, sharp, etc.) funcionam
  - [ ] Estilos de header/divider aplicáveis
- [ ] Upload de logo: arquivo PNG/JPG aceito → logo salvo + exibido no site

### 4.4 Mensagens/Tickets (`/admin/client/messages`)
- [ ] Lista de tickets do site do cliente carrega
- [ ] Botão "Novo chamado" abre modal
- [ ] Preencher assunto, categoria, mensagem → criar → ticket aparece na lista
- [ ] SLA calculado: plano Essencial → deadline 24h; Premium Full → deadline 2h (checar DB)
- [ ] Selecionar ticket → thread carrega
- [ ] **Realtime**: abrir aba admin da plataforma e responder → mensagem aparece no cliente sem refresh

### 4.5 Configurações (`/admin/client/settings`)
- [ ] Formulário de alteração de senha funciona (senha atual + nova senha)
- [ ] Editar nome do site → salvo via `PATCH /api/admin/site-settings`
- [ ] Subdomain exibido (somente leitura)
- [ ] CTA de suporte via WhatsApp visível

---

## 5. Site Público do Tenant

### 5.1 Site ativo
- [ ] Acessar `https://<slug>.bsph.com.br` → site público carrega sem auth gate
- [ ] SEO: `<title>` e `<meta description>` corretos (baseados em `seoTitle`/`seoDescription`)
- [ ] Open Graph tags presentes (`og:title`, `og:description`, `og:site_name`)
- [ ] Seções do site renderizadas na ordem correta
- [ ] Animações de scroll (motionStyle) funcionando
- [ ] Dividers entre seções aparecendo (se configurado)
- [ ] Botões flutuantes de contato (WhatsApp, etc.) visíveis (se configurados)

### 5.2 Analytics
- [ ] Acessar site público 3× (ou em abas diferentes)
- [ ] Verificar em `page_view_logs` no Supabase: 3 registros com o `site_id` correto
- [ ] Acessar `/admin/client` → cards de analytics exibem contagem correta
- [ ] Sites em draft não geram pageviews (confirmar: `isDraft = true` pula o fetch)

### 5.3 Site em draft (pré-publicação)
- [ ] Acessar site de draft sem estar logado → redirecionado para `/login?return=...`
- [ ] Login com conta não proprietária → redirecionado para `/`
- [ ] Login com conta proprietária → site exibido com `PreviewBanner` no topo
- [ ] `PreviewBanner` exibe contagem regressiva correta (baseada em `previewExpiresAt`)

### 5.4 Site suspenso
- [ ] Acessar site suspenso → tela genérica "temporariamente indisponível" exibida
- [ ] Nenhuma informação de billing ou plano exposta

---

## 6. Segurança

### 6.1 Rate Limiting
- [ ] `/api/onboarding/save-lead`: 5 req/h por IP → 6ª retorna 429 + mensagem em PT
- [ ] `/api/onboarding/register-owner`: 3 req/h → 4ª retorna 429
- [ ] `/api/onboarding/register-checkout`: 3 req/h → 4ª retorna 429
- [ ] `/api/onboarding/resend-verification`: 3 req/h → 4ª retorna 429
- [ ] `/api/contact`: 10 req/h → 11ª retorna 429

### 6.2 Autorização de endpoints
- [ ] `GET /api/admin/tickets` sem autenticação → 401
- [ ] `POST /api/admin/tickets` como admin (não client) → 403
- [ ] `PATCH /api/admin/pipeline/:id` como client → 403
- [ ] `GET /api/admin/tickets/:id` de outro site → deve retornar 404 ou 403 (RLS)

### 6.3 Isolamento de tenant (RLS)
- [ ] Client A não consegue ver tickets do Client B via API
- [ ] Client A não consegue ver `page_view_logs` do site de Client B
- [ ] Admin consegue ver todos os tickets e logs

### 6.4 Inputs maliciosos
- [ ] Assunto de ticket com `<script>alert(1)</script>` → não executa XSS no admin
- [ ] Nome de site com caracteres especiais → salvo e exibido corretamente (escaped)

---

## 7. Notificações

### 7.1 Bell de notificações (admin e client)
- [ ] Sininho no topbar exibe contador de não-lidas
- [ ] Clicar → dropdown abre com lista de notificações
- [ ] Marcar como lida → contador decresce
- [ ] Notificação `ticket_new` criada quando cliente abre chamado → admin recebe
- [ ] Notificação `sla_warning` criada quando ticket está dentro de 2h do deadline

### 7.2 E-mails transacionais
- [ ] Boas-vindas (lead capturado)
- [ ] Credenciais de acesso (após pagamento)
- [ ] Novo ticket (admin recebe quando cliente abre chamado)
- [ ] Resposta no ticket (se implementado)

---

## 8. Mobile (< 768px)

### 8.1 Landing page
- [ ] Hero responsivo, sem overflow horizontal
- [ ] Menu mobile (hambúrguer / drawer) funciona
- [ ] Formulário de lead ocupa largura total
- [ ] Seção de preços empilha cards verticalmente

### 8.2 Wizard de onboarding
- [ ] Todos os passos do wizard navegáveis em mobile
- [ ] Stripe Checkout embedded renderiza corretamente
- [ ] Preview do site no wizard legível em tela pequena

### 8.3 Admin panel (mobile)
- [ ] Sidebar recolhe → drawer hamburger funciona
- [ ] Dashboard: cards de stat empilham verticalmente
- [ ] Tabela de sites: scroll horizontal ou layout adaptado
- [ ] **Pipeline Kanban**: colunas em scroll horizontal (swipe entre colunas)
- [ ] Drag-and-drop em mobile via PointerSensor (touch) — testar arrastar card
- [ ] **Mensagens**: lista de tickets ocupa tela inteira → seta "voltar" para thread
- [ ] Thread de mensagens: botão "Voltar" visível e funcional
- [ ] Editor de seções: campos de input acessíveis sem zoom forçado

### 8.4 Site público (mobile)
- [ ] Site carrega corretamente em viewport 375px (iPhone SE)
- [ ] Botões flutuantes não bloqueiam conteúdo principal
- [ ] PreviewBanner não sobrepõe conteúdo
- [ ] Animações de scroll funcionam

---

## 9. Realtime

### 9.1 Thread de mensagens (client ↔ admin)
- [ ] Abrir ticket como cliente (tab A) e como admin (tab B) simultaneamente
- [ ] Cliente envia mensagem → aparece na aba do admin sem refresh
- [ ] Admin responde → aparece na aba do cliente sem refresh
- [ ] Fechar e reabrir ticket → subscription limpa (sem memory leak no console)

### 9.2 Lista de tickets (admin)
- [ ] Admin com `/admin/platform/messages` aberto (tab A)
- [ ] Cliente abre novo chamado (tab B)
- [ ] Novo ticket aparece no topo da lista do admin (tab A) sem refresh

### 9.3 Bell de notificações (realtime)
- [ ] Admin recebe notificação em tempo real quando cliente abre ticket (sininho atualiza sem refresh)

---

## 10. Performance & Edge Cases

### 10.1 Carregamento
- [ ] Site público carrega em menos de 3s em conexão 4G simulada (DevTools > Network throttle)
- [ ] Admin panel (dashboard) carrega em menos de 2s

### 10.2 Erros de rede
- [ ] Desconectar internet durante drag-and-drop → card volta à posição original (rollback)
- [ ] Desconectar durante envio de mensagem → mensagem não duplicada ao reconectar

### 10.3 Dados ausentes
- [ ] Site sem seções configuradas → `notFound()` (404) exibido
- [ ] Tenant inexistente (`https://naoe.bsph.com.br`) → 404

### 10.4 Navegadores
- [ ] Chrome/Edge (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

---

## Resumo de Aprovação

| Área | Total | Aprovado | Falhou |
|------|-------|----------|--------|
| 0. Pré-requisitos | 9 | | |
| 1. Onboarding | 15 | | |
| 2. Autenticação | 17 | | |
| 3. Platform Admin | 22 | | |
| 4. Client Admin | 17 | | |
| 5. Site Público | 13 | | |
| 6. Segurança | 11 | | |
| 7. Notificações | 8 | | |
| 8. Mobile | 14 | | |
| 9. Realtime | 7 | | |
| 10. Performance | 8 | | |
| **Total** | **141** | | |

---

*Checklist gerado automaticamente — BuildSphere MVP v1.0*
