-- ─────────────────────────────────────────────────────────────────────────────
-- Platform Plans: preços dinâmicos por plano (substitui valores hardcoded)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_plans (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key             text        UNIQUE NOT NULL,          -- 'basico' | 'premium'
  name            text        NOT NULL,
  monthly_price   numeric(10,2) NOT NULL,               -- preço em BRL
  stripe_price_id text        NOT NULL,                 -- ID do Price ativo no Stripe
  updated_at      timestamptz DEFAULT now()
);

-- Dados iniciais (valores atuais)
INSERT INTO platform_plans (key, name, monthly_price, stripe_price_id)
VALUES
  ('basico',  'Básico',  59.90,  'price_1T59HfFFAjgAeuC1RGfeU8wW'),
  ('premium', 'Premium', 109.80, 'price_1T59ImFFAjgAeuC1PHZZu2M7')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Platform Coupons: cupons/promoções sincronizados com Stripe
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_coupons (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  code                      text        UNIQUE NOT NULL,  -- código público (ex: PROMO50)
  name                      text        NOT NULL,         -- label interno

  -- Desconto (um dos dois deve ser preenchido)
  percent_off               numeric(5,2),                 -- 0-100; NULL se amount_off
  amount_off_cents          integer,                      -- em centavos BRL; NULL se percent_off

  -- Duração
  duration                  text        NOT NULL CHECK (duration IN ('once', 'repeating', 'forever')),
  duration_in_months        integer,                      -- apenas se duration = 'repeating'

  -- Restrições
  applicable_plans          text[],                       -- NULL = todos os planos
  max_redemptions           integer,                      -- NULL = ilimitado
  expires_at                timestamptz,                  -- NULL = sem expiração

  -- IDs no Stripe
  stripe_coupon_id          text,
  stripe_promotion_code_id  text,

  -- Estado
  active                    boolean     NOT NULL DEFAULT true,
  redemption_count          integer     NOT NULL DEFAULT 0,
  created_at                timestamptz NOT NULL DEFAULT now()
);

-- Índice para busca rápida por code no checkout
CREATE INDEX IF NOT EXISTS idx_platform_coupons_code
  ON platform_coupons (lower(code))
  WHERE active = true;
