#!/usr/bin/env bash
# ============================================================
# BuildSphere — Testes de Segurança (Seção 6 do checklist)
# Uso:
#   bash scripts/test-security.sh                    # localhost
#   bash scripts/test-security.sh https://seu.app    # produção
#
# PRÉ-REQUISITOS:
#   1. curl instalado (Git Bash no Windows já tem)
#   2. Preencha as variáveis de sessão abaixo antes de rodar
#
# AVISO PRODUÇÃO (Vercel):
#   Os testes 6.1 (rate limit) podem falhar em produção porque o
#   limiter é in-memory por instância — requests caem em instâncias
#   diferentes e os contadores não acumulam. Isso é uma limitação
#   conhecida (ver src/lib/rate-limit.ts). Os demais testes (6.2,
#   6.3, 6.4) funcionam normalmente em produção.
# ============================================================

BASE="${1:-https://bsph.com.br}"
BASE="${BASE%/}"  # remove trailing slash to avoid double // in URLs
echo "Base URL: $BASE"

# ──────────────────────────────────────────────────────────
# SESSÕES (preencha após logar no browser)
# Como obter:
#   1. Abra DevTools → Application → Cookies → localhost:3000
#   2. Copie o valor do cookie "sb-<project>-auth-token"
#   3. Cole abaixo SEM as aspas externas do browser
# ──────────────────────────────────────────────────────────
CLIENT_COOKIE="sb-qtlaxgeckbzdveszkmtg-auth-token"
ADMIN_COOKIE="sb-qtlaxgeckbzdveszkmtg-auth-token"

# IDs reais (preencha com valores do seu banco)
TICKET_DO_CLIENT_B="05412884-afe4-4f04-aba3-7e679eca5306"
DRAFT_ID_QUALQUER="76d6477f-1320-468d-84c0-98e015bf39ff"

# ──────────────────────────────────────────────────────────
# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }
info() { echo -e "${YELLOW}[INFO]${NC} $1"; }
section() { echo -e "\n${YELLOW}══════════════════════════════════════${NC}"; echo -e "${YELLOW} $1${NC}"; echo -e "${YELLOW}══════════════════════════════════════${NC}"; }

# ──────────────────────────────────────────────────────────
# Helper: envia N requests e mostra status de cada um
# check_rate_limit <url> <body_json> <limit_n> <ip_fake>
# ──────────────────────────────────────────────────────────
check_rate_limit() {
  local URL="$1"
  local BODY="$2"
  local LIMIT="$3"
  local IP="$4"
  local TOTAL=$((LIMIT + 1))

  info "Enviando $TOTAL requests para $URL (limite=$LIMIT, ip=$IP)"

  for i in $(seq 1 $TOTAL); do
    STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" -X POST "$URL" \
      -H "Content-Type: application/json" \
      -H "x-forwarded-for: $IP" \
      -d "$BODY")

    if [ "$i" -le "$LIMIT" ]; then
      if [ "$STATUS" -ne 429 ]; then
        echo "  req $i → $STATUS (esperado != 429) ✓"
      else
        echo "  req $i → $STATUS ← LIMITADO CEDO (falha)"
      fi
    else
      if [ "$STATUS" -eq 429 ]; then
        pass "  req $i → 429 (rate limited corretamente)"
      else
        fail "  req $i → $STATUS (esperava 429!)"
      fi
    fi
  done
}

# ══════════════════════════════════════════════════════════
section "6.1 Rate Limiting"
# ══════════════════════════════════════════════════════════

# Cada teste usa um IP diferente para não interferir entre si.
# O rate-limiter usa x-forwarded-for como chave, então IPs
# diferentes = buckets diferentes = testes independentes.

echo ""
info "→ save-lead (limite: 5/h)"
check_rate_limit \
  "$BASE/api/onboarding/save-lead" \
  '{"email":"test@example.com","businessName":"Teste","businessType":"restaurante"}' \
  5 \
  "10.0.0.1"

echo ""
info "→ register-owner (limite: 3/h)"
check_rate_limit \
  "$BASE/api/onboarding/register-owner" \
  '{"email":"owner@example.com","password":"Senha@12345","fullName":"Test User"}' \
  3 \
  "10.0.0.2"

echo ""
info "→ register-checkout (limite: 3/h)"
check_rate_limit \
  "$BASE/api/onboarding/register-checkout" \
  '{"siteId":"00000000-0000-0000-0000-000000000001","fullName":"Test User","email":"pay@example.com","password":"Senha@12345"}' \
  3 \
  "10.0.0.3"

echo ""
info "→ resend-verification (limite: 3/h)"
check_rate_limit \
  "$BASE/api/onboarding/resend-verification" \
  '{"email":"verify@example.com"}' \
  3 \
  "10.0.0.4"

echo ""
info "→ contact (limite: 10/h)"
check_rate_limit \
  "$BASE/api/contact" \
  '{"siteId":"00000000-0000-0000-0000-000000000001","name":"Test","email":"c@example.com","message":"mensagem de teste aqui"}' \
  10 \
  "10.0.0.5"

# ══════════════════════════════════════════════════════════
section "6.2 Autorização de Endpoints"
# ══════════════════════════════════════════════════════════

echo ""
info "→ GET /api/admin/tickets sem autenticação → espera 401"
STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$BASE/api/admin/tickets")
if [ "$STATUS" -eq 401 ]; then
  pass "GET /api/admin/tickets sem auth → 401 ✓"
else
  fail "GET /api/admin/tickets sem auth → $STATUS (esperava 401)"
fi

echo ""
info "→ POST /api/admin/tickets como admin (role=admin) → espera 403"
STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/tickets" \
  -H "Content-Type: application/json" \
  -H "Cookie: $ADMIN_COOKIE" \
  -d '{"subject":"Teste admin","category":"suporte","body":"Mensagem de teste longa o suficiente"}')
BODY=$(curl -s -L -X POST "$BASE/api/admin/tickets" \
  -H "Content-Type: application/json" \
  -H "Cookie: $ADMIN_COOKIE" \
  -d '{"subject":"Teste admin","category":"suporte","body":"Mensagem de teste longa o suficiente"}')
if [ "$STATUS" -eq 403 ]; then
  pass "POST /api/admin/tickets como admin → 403 ✓"
else
  fail "POST /api/admin/tickets como admin → $STATUS | body: $BODY"
fi

echo ""
info "→ PATCH /api/admin/pipeline/$DRAFT_ID_QUALQUER como client → espera 403"
STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" -X PATCH "$BASE/api/admin/pipeline/$DRAFT_ID_QUALQUER" \
  -H "Content-Type: application/json" \
  -H "Cookie: $CLIENT_COOKIE" \
  -d '{"status":"active"}')
if [ "$STATUS" -eq 403 ]; then
  pass "PATCH /api/admin/pipeline como client → 403 ✓"
else
  fail "PATCH /api/admin/pipeline como client → $STATUS (esperava 403)"
fi

echo ""
info "→ GET /api/admin/tickets/$TICKET_DO_CLIENT_B como client A → espera 403 ou 404"
STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$BASE/api/admin/tickets/$TICKET_DO_CLIENT_B" \
  -H "Cookie: $CLIENT_COOKIE")
if [ "$STATUS" -eq 403 ] || [ "$STATUS" -eq 404 ]; then
  pass "GET ticket de outro site → $STATUS ✓"
else
  fail "GET ticket de outro site → $STATUS (esperava 403 ou 404)"
fi

# ══════════════════════════════════════════════════════════
section "6.3 Isolamento de Tenant (RLS)"
# ══════════════════════════════════════════════════════════

echo ""
info "→ Client A não vê tickets do Client B via GET /api/admin/tickets"
TICKETS=$(curl -s -L "$BASE/api/admin/tickets" -H "Cookie: $CLIENT_COOKIE")
echo "  Tickets retornados para Client A:"
echo "$TICKETS" | grep -o '"site_id":"[^"]*"' | sort -u || echo "  (nenhum ou formato diferente)"
info "  Verifique manualmente se algum site_id diferente do seu aparece acima."

echo ""
info "→ Para verificar RLS de page_view_logs, acesse o Supabase Studio:"
info "  Execute: SELECT * FROM page_view_logs WHERE site_id != '<seu_site_id>' LIMIT 5"
info "  Como client autenticado via SQL Editor — RLS deve retornar 0 rows."

# ══════════════════════════════════════════════════════════
section "6.4 Inputs Maliciosos"
# ══════════════════════════════════════════════════════════

echo ""
info "→ Ticket com XSS no assunto"
XSS_PAYLOAD='<script>alert(1)<\/script>'
RESP=$(curl -s -L -X POST "$BASE/api/admin/tickets" \
  -H "Content-Type: application/json" \
  -H "Cookie: $CLIENT_COOKIE" \
  -d "{\"subject\":\"$XSS_PAYLOAD\",\"category\":\"suporte\",\"body\":\"Mensagem de teste para verificar XSS no assunto do ticket\"}")
echo "  Resposta da API: $RESP"
info "  Após criar, abra o painel admin → Tickets e verifique:"
info "  1. O assunto aparece como texto literal (não executa alert)"
info "  2. DevTools → Console: nenhum alert disparado"
info "  3. DevTools → Elements: o texto está escaped (&lt;script&gt;)"

echo ""
info "→ Nome de site com caracteres especiais"
RESP=$(curl -s -L -X PATCH "$BASE/api/admin/site-settings" \
  -H "Content-Type: application/json" \
  -H "Cookie: $CLIENT_COOKIE" \
  -d '{"name":"Café & Bistrô <Especial> \"Testando\" '\''aspas'\''"}')
echo "  Resposta: $RESP"
info "  Se 200, abra /admin/client e verifique se o nome exibe corretamente escaped."

echo ""
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo -e "${GREEN} Testes concluídos. Revise os [FAIL] acima.${NC}"
echo -e "${GREEN}══════════════════════════════════════${NC}"
