# Guia de Testes de Segurança — Seção 6

## Como rodar

```bash
# Localhost (precisa de npm run dev rodando)
bash scripts/test-security.sh

# Produção (Vercel)
bash scripts/test-security.sh https://seu-dominio.vercel.app
```

---

## Pré-requisitos: Pegar sessões do browser

Antes de rodar o script, você precisa das cookies de sessão de dois usuários:

1. Abra o browser em `http://localhost:3000`
2. Faça login como **client** → DevTools → Application → Cookies → localhost:3000
3. Copie o cookie cujo nome começa com `sb-` e termina em `-auth-token`
4. Cole no script na variável `CLIENT_COOKIE`
5. Repita fazendo login como **admin** → cole em `ADMIN_COOKIE`
6. Preencha `TICKET_DO_CLIENT_B` com o UUID de um ticket que pertence a **outro** client (pegue no Supabase Studio)
7. Preencha `DRAFT_ID_QUALQUER` com qualquer UUID de draft existente

---

## 6.1 Rate Limiting — O que o script faz

O rate-limiter usa `x-forwarded-for` como chave de IP. O script manda IPs diferentes por teste (10.0.0.1, 10.0.0.2...) para que os buckets não se misturem.

**Importante:** O rate-limiter é **em memória** — reiniciar o `npm run dev` zera todos os contadores. Se quiser retestar, reinicie o servidor e rode de novo.

| Endpoint | Limite | IP usado no script |
|---|---|---|
| save-lead | 5/h | 10.0.0.1 |
| register-owner | 3/h | 10.0.0.2 |
| register-checkout | 3/h | 10.0.0.3 |
| resend-verification | 3/h | 10.0.0.4 |
| contact | 10/h | 10.0.0.5 |

**Resultado esperado:** A última request de cada bloco retorna `429`.

**Verificar mensagem em PT:** Para ver o corpo do 429:
```bash
curl -s -X POST http://localhost:3000/api/onboarding/save-lead \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: 10.0.0.1" \
  -d '{"email":"x@x.com","businessName":"X","businessType":"restaurante"}'
# (rodar 6x — na 6ª aparece o JSON de erro em português)
```

---

## 6.2 Autorização — Casos manuais

### Caso que o script NÃO consegue automatizar facilmente

**POST /api/admin/tickets sem cookie (401):**
```bash
curl -s -X POST http://localhost:3000/api/admin/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"teste","category":"suporte","body":"mensagem longa aqui"}' | jq .
# Deve retornar: {"error":"Authentication required."} com status 401
```

---

## 6.3 Isolamento de Tenant — Verificação manual no Supabase Studio

1. Acesse o [Supabase Studio](http://localhost:54323) (se usar local) ou o dashboard online
2. Vá em **SQL Editor**
3. Execute como usuário autenticado (use o JWT do client A no header Authorization da API REST, não pelo Studio)

**Alternativa mais prática — via API com curl:**

```bash
# Substitua CLIENT_A_COOKIE e CLIENT_B_SITE_ID
curl -s "http://localhost:3000/api/admin/tickets" \
  -H "Cookie: $CLIENT_A_COOKIE" | jq '[.tickets[].site_id] | unique'

# Deve retornar apenas o site_id do client A
# Se retornar outros site_ids → FALHA DE RLS
```

**Para page_view_logs** (não tem rota de API exposta, testar direto no Supabase):
```sql
-- Execute com o JWT do client A (via apikey + Authorization: Bearer <jwt>)
SELECT COUNT(*) FROM page_view_logs WHERE site_id != 'SEU_SITE_ID_AQUI';
-- RLS deve retornar 0
```

---

## 6.4 XSS — Verificação manual obrigatória

O script cria o ticket/atualiza o nome, mas **você precisa verificar no browser**:

### XSS em assunto de ticket
1. Rode o script — ele cria um ticket com `<script>alert(1)</script>` no assunto
2. Acesse `http://localhost:3000/admin/platform` → Tickets
3. **O que verificar:**
   - Nenhum `alert` disparou
   - O assunto exibe literalmente `<script>alert(1)</script>` como texto
   - No DevTools → Elements, o HTML mostra `&lt;script&gt;` (escaped)

### Nome de site com caracteres especiais
1. O script tenta salvar `Café & Bistrô <Especial> "Testando" 'aspas'`
2. Acesse o painel do client → Settings
3. **O que verificar:**
   - O nome exibe exatamente como foi digitado (sem quebrar o layout)
   - No HTML: `&amp;`, `&lt;`, `&quot;` nos lugares certos

---

## Dicas de troubleshooting

| Problema | Solução |
|---|---|
| Todos os requests retornam 401 | Cookie expirou — faça login de novo e atualize o script |
| Rate limit já atingido antes do teste (dev) | Reinicie `npm run dev` para zerar o store em memória |
| 429 nunca aparece em produção (Vercel) | Esperado — limiter é in-memory por instância, Vercel escala horizontalmente |
| 500 em vez de 403/401 | Verifique se o banco está rodando (`supabase start` se local) |
| Cookie com espaços/caracteres especiais | Coloque entre aspas simples: `'sb-xxx-auth-token=valor'` |
