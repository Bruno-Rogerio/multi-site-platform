-- Adiciona stripe_subscription_id em billing_profiles
-- Necessário para o webhook gravar o ID da assinatura após checkout.session.completed

ALTER TABLE billing_profiles
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Índice para facilitar buscas por subscription_id (ex: cancelamento de assinatura)
CREATE INDEX IF NOT EXISTS idx_billing_profiles_subscription
  ON billing_profiles (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Depois de rodar esta migration, atualizar o webhook para gravar o campo:
-- UPDATE billing_profiles SET stripe_subscription_id = $1 WHERE stripe_customer_id = $2
