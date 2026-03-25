-- ─────────────────────────────────────────────────────────────────────────────
-- Adiciona o plano Starter à plataforma
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Atualiza a constraint de sites.plan para aceitar 'starter'
ALTER TABLE public.sites
  DROP CONSTRAINT IF EXISTS sites_plan_check;

ALTER TABLE public.sites
  ADD CONSTRAINT sites_plan_check
  CHECK (plan IN ('landing', 'pro', 'starter'));

-- 2. Insere o plano Starter na tabela platform_plans
--    Após adicionar STRIPE_STARTER_PRICE_ID no Vercel, atualize stripe_price_id
--    via admin ou com: UPDATE platform_plans SET stripe_price_id = '<id>' WHERE key = 'starter';
INSERT INTO platform_plans (key, name, monthly_price, stripe_price_id)
VALUES ('starter', 'Starter', 29.90, 'pending')
ON CONFLICT (key) DO NOTHING;
