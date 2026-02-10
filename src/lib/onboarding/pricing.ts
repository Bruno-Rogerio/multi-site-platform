/* ─── Pricing calculations ─── */

import type { OnboardingPlan } from "./types";
import { BASICO_MONTHLY_PRICE, CONSTRUIR_BASE_PRICE, PREMIUM_FULL_TOTAL } from "./plans";

/* Five section-level premium add-ons for the Construir plan */
export const SECTION_PREMIUM_PRICES: Record<string, number> = {
  "premium-paleta": 9.9,
  "premium-tipografia": 9.9,
  "premium-variantes": 14.9,
  "premium-canais": 14.9,
  "premium-cards": 14.9,
};

export function calculateMonthlyTotal(
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): number {
  if (!plan) return 0;
  if (plan === "basico") return BASICO_MONTHLY_PRICE;
  if (plan === "premium-full") return PREMIUM_FULL_TOTAL;

  // plan === "construir"
  const addonsTotal = addonsSelected.reduce((sum, addonId) => {
    return sum + (SECTION_PREMIUM_PRICES[addonId] ?? 0);
  }, 0);

  return CONSTRUIR_BASE_PRICE + addonsTotal;
}

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
