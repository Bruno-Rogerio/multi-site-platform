# BuildSphere - Documento de Produto e Execucao

## 1) O que e a plataforma
BuildSphere e uma plataforma SaaS multi-tenant para criacao e gestao de sites profissionais.

- Um unico sistema e deploy
- Cada cliente com site isolado por tenant (subdominio)
- Painel admin centralizado
- Edicao de secoes, tema e conteudo sem codigo

## 2) Objetivo do MVP
Entregar um produto funcional, vendavel e com boa experiencia inicial para:

1. Captar clientes com onboarding guiado
2. Criar site automaticamente com base nas escolhas do cliente
3. Permitir ajustes no painel admin
4. Garantir isolamento por tenant e seguranca de acesso

## 3) Principios do MVP
- Priorizar previsibilidade e velocidade de entrega
- Evitar IA no inicio (custos e complexidade)
- Usar variacoes pre-prontas combinaveis
- Evoluir com base em dados reais de uso e conversao
- Mobile-first como padrao em todos os templates e componentes

## 4) Escopo funcional (MVP)
### 4.1 Plataforma
- Landing da plataforma
- Login/logout/reset de senha
- Provisionamento de usuarios por admin
- Modo sem email para dev (senha temporaria)

### 4.2 Multi-tenant
- Classificacao por host/subdominio
- Separacao plataforma x tenant
- Rotas internas para /t/[tenant]
- Bloqueio de /admin e /login em dominio tenant

### 4.3 Site do cliente (Plano base)
- Secoes: Hero, Services, CTA (e estrutura para outras)
- Variantes por secao (layout pre-definido)
- Tema por tenant
- Formulario de contato

### 4.4 Painel admin
- Convite/criacao de usuarios
- Editor de secoes por tenant
- Ordenacao por `order`
- Mini preview do site em tempo real (antes de salvar)
- Upload de imagens por secao (hero/cta) no Storage
- Editor de branding (logo no header/footer por tenant)

## 5) Etapas concluidas
- [x] Estrutura inicial Next.js + Supabase
- [x] Middleware multi-tenant por host
- [x] Suporte local com localtest.me
- [x] Vertical slice publica por tenant
- [x] Schema + seed no Supabase
- [x] RLS e isolamento por tenant
- [x] Auth robusta (login, callback, reset, logout)
- [x] Provisionamento de usuarios por admin
- [x] Resolucao de problemas de role/perfil e recursion em policy
- [x] Tema visual premium da plataforma (BuildSphere)
- [x] Editor de secoes no admin
- [x] Mini preview em tempo real
- [x] Upload de imagens (hero/cta) + render no site publico
- [x] Upload de imagens em Services + branding logo (header/footer)
- [x] Preview desktop/mobile com simulacao visual no editor
- [x] Fluxo inicial "Quero comecar" com wizard interativo
- [x] Criacao de tenant rascunho direto do wizard (`/api/onboarding/draft`)
- [x] Landing page da plataforma refeita com visual SaaS premium
- [x] Biblioteca SQL de presets (styles, palettes e templates)

## 6) Proximas etapas (priorizadas)
### Curto prazo (agora)
1. Melhorias de UX no editor (salvar tudo / indicador de alteracoes por secao)
2. Padronizar tamanhos/crop das imagens no upload
3. Integrar dados do wizard com criacao automatica de draft do tenant

### Medio prazo (MVP comercial)
1. Conectar wizard ao fluxo real de cadastro + checkout Stripe
2. Escolha guiada de variacoes (header/hero/services/cta)
3. Biblioteca com 6 estilos visuais:
   - Minimal Clean
   - Soft Human
   - Editorial Premium
   - Tech Modern
   - Bold Contrast
   - Organic Warm
4. Seletor de paleta (cores pre-definidas por tema, com opcao de ajuste fino)
5. Dados do negocio para pre-preenchimento de conteudo
6. Checkout Stripe recorrente
7. Provisionamento automatico pos-pagamento

### Pos-MVP
1. IA opcional para sugestao de copy
2. Blog (plano/pro adicional)
3. Areas avancadas (membros, chat, etc.)

## 7) Estrategia de monetizacao (diretriz inicial)
- Plano base: R$ 59,90
- Adicionais avulsos por valor
- Combos sugeridos (hibrido): avulso mais caro, combo com ganho percebido

## 8) Como vamos acompanhar progresso
- Atualizar este arquivo a cada bloco entregue
- Marcar itens concluidos
- Registrar decisoes de produto importantes
- Ajustar roadmap com base em feedback de clientes

## 9) Definicao de pronto (DoD) para cada entrega
- Funcionalidade implementada
- Fluxo validado manualmente
- Lint/build passando
- Documento atualizado

---
Ultima atualizacao: 2026-02-04
