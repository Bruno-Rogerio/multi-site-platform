/* ─── Pricing calculations ─── */

import type { OnboardingPlan } from "./types";
import { STARTER_MONTHLY_PRICE, BASICO_MONTHLY_PRICE, PREMIUM_MONTHLY_PRICE } from "./plans";

export function calculateMonthlyTotal(plan: OnboardingPlan | null): number {
  if (!plan) return 0;
  if (plan === "starter") return STARTER_MONTHLY_PRICE;
  if (plan === "basico") return BASICO_MONTHLY_PRICE;
  return PREMIUM_MONTHLY_PRICE;
}

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
