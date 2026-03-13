import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { BASICO_MONTHLY_PRICE, PREMIUM_MONTHLY_PRICE } from "./plans";

export type PlanPrices = {
  basico: number;
  premium: number;
};

const FALLBACK: PlanPrices = {
  basico: BASICO_MONTHLY_PRICE,
  premium: PREMIUM_MONTHLY_PRICE,
};

/** Busca preços atuais dos planos no banco. Usa fallback se DB indisponível. */
export async function getPlanPrices(): Promise<PlanPrices> {
  const admin = createSupabaseAdminClient();
  if (!admin) return FALLBACK;

  const { data } = await admin
    .from("platform_plans")
    .select("key, monthly_price");

  if (!data?.length) return FALLBACK;

  const result = { ...FALLBACK };
  for (const row of data) {
    if (row.key === "basico") result.basico = Number(row.monthly_price);
    if (row.key === "premium") result.premium = Number(row.monthly_price);
  }
  return result;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
