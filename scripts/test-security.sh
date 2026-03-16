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
CLIENT_COOKIE="sb-qtlaxgeckbzdveszkmtg-auth-token=base64-eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1NMk5qZ3daams0TFRJNVptUXROREk0WXkwNE4yTXlMVFJoT0dWak9USTBOVGMyTXlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMM0YwYkdGNFoyVmphMko2WkhabGMzcHJiWFJuTG5OMWNHRmlZWE5sTG1OdkwyRjFkR2d2ZGpFaUxDSnpkV0lpT2lKak1qY3hOMlkxWXkwd056aGtMVFJtTnpZdFltVTNNQzFoTmpFeU4yWTBabVUxTWpBaUxDSmhkV1FpT2lKaGRYUm9aVzUwYVdOaGRHVmtJaXdpWlhod0lqb3hOemN6TXpJNU5qVXlMQ0pwWVhRaU9qRTNOek16TWpZd05USXNJbVZ0WVdsc0lqb2ljbUZwZW1FdVkyOXVkbVZ1ZEc5QWFHOTBiV0ZwYkM1amIyMGlMQ0p3YUc5dVpTSTZJaUlzSW1Gd2NGOXRaWFJoWkdGMFlTSTZleUp3Y205MmFXUmxjaUk2SW1WdFlXbHNJaXdpY0hKdmRtbGtaWEp6SWpwYkltVnRZV2xzSWwxOUxDSjFjMlZ5WDIxbGRHRmtZWFJoSWpwN0ltVnRZV2xzWDNabGNtbG1hV1ZrSWpwMGNuVmxMQ0ptZFd4c1gyNWhiV1VpT2lKU1lXbDZZU0o5TENKeWIyeGxJam9pWVhWMGFHVnVkR2xqWVhSbFpDSXNJbUZoYkNJNkltRmhiREVpTENKaGJYSWlPbHQ3SW0xbGRHaHZaQ0k2SW5CaGMzTjNiM0prSWl3aWRHbHRaWE4wWVcxd0lqb3hOemN6TXpJMk1EVXlmVjBzSW5ObGMzTnBiMjVmYVdRaU9pSmlOekZrWm1aaU9TMHhOREJtTFRSaU9HVXRPVEppTmkwNU1qYzFNMk5pWlRBd09UUWlMQ0pwYzE5aGJtOXVlVzF2ZFhNaU9tWmhiSE5sZlEuWmhMeGJyTnNONWppZ2NQdnA4OUdHNzhvTTBnbWZHY2JPdFBleGlBcnBsZWxmS2YtTnVpc1g5S2tSRHRYR0ZaSjVmbGdERDJab2IyWU1HZU5pcEZta3ciLCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwiZXhwaXJlc19pbiI6MzYwMCwiZXhwaXJlc19hdCI6MTc3MzMyOTY1MiwicmVmcmVzaF90b2tlbiI6Ink0MzVmMnZpcXR1ZSIsInVzZXIiOnsiaWQiOiJjMjcxN2Y1Yy0wNzhkLTRmNzYtYmU3MC1hNjEyN2Y0ZmU1MjAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJlbWFpbCI6InJhaXphLmNvbnZlbnRvQGhvdG1haWwuY29tIiwiZW1haWxfY29uZmlybWVkX2F0IjoiMjAyNi0wMy0wOVQxNDozMzozOC41NzgyOTJaIiwicGhvbmUiOiIiLCJjb25maXJtYXRpb25fc2VudF9hdCI6IjIwMjYtMDMtMDlUMTQ6MzI6NDYuNDgyOTkyWiIsImNvbmZpcm1lZF9hdCI6IjIwMjYtMDMtMDlUMTQ6MzM6MzguNTc4MjkyWiIsImxhc3Rfc2lnbl9pbl9hdCI6IjIwMjYtMDMtMTJUMTQ6MzQ6MTIuOTI1Njg4MDA0WiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJSYWl6YSJ9LCJpZGVudGl0aWVzIjpbeyJpZGVudGl0eV9pZCI6Ijg4M2FjMmYyLTM0MDUtNGMwNS04ZDgwLTI5ZjEyNDY0MzliNSIsImlkIjoiYzI3MTdmNWMtMDc4ZC00Zjc2LWJlNzAtYTYxMjdmNGZlNTIwIiwidXNlcl9pZCI6ImMyNzE3ZjVjLTA3OGQtNGY3Ni1iZTcwLWE2MTI3ZjRmZTUyMCIsImlkZW50aXR5X2RhdGEiOnsiZW1haWwiOiJyYWl6YS5jb252ZW50b0Bob3RtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImMyNzE3ZjVjLTA3OGQtNGY3Ni1iZTcwLWE2MTI3ZjRmZTUyMCJ9LCJwcm92aWRlciI6ImVtYWlsIiwibGFzdF9zaWduX2luX2F0IjoiMjAyNi0wMy0wOVQxNDozMjo0Ni4zNjc2NjdaIiwiY3JlYXRlZF9hdCI6IjIwMjYtMDMtMDlUMTQ6MzI6NDYuMzY3NzI0WiIsInVwZGF0ZWRfYXQiOiIyMDI2LTAzLTA5VDE0OjMyOjQ2LjM2NzcyNFoiLCJlbWFpbCI6InJhaXphLmNvbnZlbnRvQGhvdG1haWwuY29tIn1dLCJjcmVhdGVkX2F0IjoiMjAyNi0wMy0wOVQxNDozMjo0Ni4yOTEyMDlaIiwidXBkYXRlZF9hdCI6IjIwMjYtMDMtMTJUMTQ6MzQ6MTIuOTQ4OTE2WiIsImlzX2Fub255bW91cyI6ZmFsc2V9LCJ3ZWFrX3Bhc3N3b3JkIjpudWxsfQ"
ADMIN_COOKIE="sb-qtlaxgeckbzdveszkmtg-auth-token=base64-eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1NMk5qZ3daams0TFRJNVptUXROREk0WXkwNE4yTXlMVFJoT0dWak9USTBOVGMyTXlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMM0YwYkdGNFoyVmphMko2WkhabGMzcHJiWFJuTG5OMWNHRmlZWE5sTG1OdkwyRjFkR2d2ZGpFaUxDSnpkV0lpT2lJeU56ZzFNV05tTVMwM05XWTJMVFJoTm1JdE9HWmxNaTB5WkRReE5tRmhNR05pWm1NaUxDSmhkV1FpT2lKaGRYUm9aVzUwYVdOaGRHVmtJaXdpWlhod0lqb3hOemN6TXpNd09UTTNMQ0pwWVhRaU9qRTNOek16TWpjek16Y3NJbVZ0WVdsc0lqb2lZbkoxYm05QVluSjFibTh1WTI5dExtSnlJaXdpY0hodmJtVWlPaUlpTENKaGNIQmZiV1YwWVdSaGRHRWlPbnNpY0hKdmRtbGtaWElpT2lKbGJXRnBiQ0lzSW5CeWIzWnBaR1Z5Y3lJNld5SmxiV0ZwYkNKZGZTd2lkWE5sY2w5dFpYUmhaR0YwWVNJNmV5SmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpY205c1pTSTZJbUZrYldsdUlpd2ljMmwwWlY5cFpDSTZiblZzYkgwc0luSnZiR1VpT2lKaGRYUm9aVzUwYVdOaGRHVmtJaXdpWVdGc0lqb2lZV0ZzTVNJc0ltRnRjaUk2VzNzaWJXVjBhRzlrSWpvaWNHRnpjM2R2Y21RaUxDSjBhVzFsYzNSaGJYQWlPakUzTnpNek1qY3pNemQ5WFN3aWMyVnpjMmx2Ymw5cFpDSTZJbVU1WmpWbU1EZGtMVE16WVdRdE5Ea3lNQzA0WXpSakxXSTVZVEZqT1dNNU5tRXdPQ0lzSW1selgyRnViMjU1Ylc5MWN5STZabUZzYzJWOS44SEdveHY3X3lQeXRRTHRUS0k3bnlRU1hCd2N0aDFzNnRJUlhIRHI5Z1VvaEFQaWlna21fakNZc3dVQVMtalFsdmdqS2l3LUtRcG9MMVVGZ2R5a2RGUSIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJleHBpcmVzX2F0IjoxNzczMzMwOTM3LCJyZWZyZXNoX3Rva2VuIjoiZ3FqbmFnbDJqMnFjIiwidXNlciI6eyJpZCI6IjI3ODUxY2YxLTc1ZjYtNGE2Yi04ZmUyLTJkNDE2YWEwY2JmYyIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImVtYWlsIjoiYnJ1bm9AYnJ1bm8uY29tLmJyIiwiZW1haWxfY29uZmlybWVkX2F0IjoiMjAyNi0wMi0wM1QyMjowNTowNi41NTYwNjRaIiwicGhvbmUiOiIiLCJjb25maXJtZWRfYXQiOiIyMDI2LTAyLTAzVDIyOjA1OjA2LjU1NjA2NFoiLCJyZWNvdmVyeV9zZW50X2F0IjoiMjAyNi0wMy0xMFQxNToxMzo0Ni43NjYzNDdaIiwibGFzdF9zaWduX2luX2F0IjoiMjAyNi0wMy0xMlQxNDo1NTozNy4zODkyMzU0NjdaIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGUiOiJhZG1pbiIsInNpdGVfaWQiOm51bGx9LCJpZGVudGl0aWVzIjpbeyJpZGVudGl0eV9pZCI6IjNiMWM0Yzk0LWQ4MjAtNDlhYi05NjA3LTUwMGJhZTgyNDY4YiIsImlkIjoiMjc4NTFjZjEtNzVmNi00YTZiLThmZTItMmQ0MTZhYTBjYmZjIiwidXNlcl9pZCI6IjI3ODUxY2YxLTc1ZjYtNGE2Yi04ZmUyLTJkNDE2YWEwY2JmYyIsImlkZW50aXR5X2RhdGEiOnsiZW1haWwiOiJicnVub0BicnVuby5jb20uYnIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMjc4NTFjZjEtNzVmNi00YTZiLThmZTItMmQ0MTZhYTBjYmZjIn0sInByb3ZpZGVyIjoiZW1haWwiLCJsYXN0X3NpZ25faW5fYXQiOiIyMDI2LTAyLTAzVDIyOjA1OjA2LjU0MTg3OVoiLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0wM1QyMjowNTowNi41NDI1MTFaIiwidXBkYXRlZF9hdCI6IjIwMjYtMDItMDNUMjI6MDU6MDYuNTQyNTExWiIsImVtYWlsIjoiYnJ1bm9AYnJ1bm8uY29tLmJyIn1dLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0wM1QyMjowNTowNi41MDU4ODNaIiwidXBkYXRlZF9hdCI6IjIwMjYtMDMtMTJUMTQ6NTU6MzcuNDI4NTczWiIsImlzX2Fub255bW91cyI6ZmFsc2V9LCJ3ZWFrX3Bhc3N3b3JkIjpudWxsfQ"

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
