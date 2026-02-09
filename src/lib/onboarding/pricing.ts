/* ─── Pricing calculations ─── */

import type { OnboardingPlan } from "./types";
import { BASICO_MONTHLY_PRICE, CONSTRUIR_BASE_PRICE, PREMIUM_FULL_TOTAL } from "./plans";

export const ADDON_PRICES: Record<string, number> = {
  "extra-cta": 9.9,
  "floating-cta": 9.9,
  "premium-icons": 9.9,
  "extra-cards": 9.9,
  "extra-sections": 9.9,
  "about-page": 14.9,
  "blog": 29.9,
  "premium-buttons": 4.9,
  "advanced-motion": 9.9,
  "premium-design": 19.9,
  "custom-colors": 4.9,
  "premium-fonts": 4.9,
  // Legacy addon IDs for backward compatibility
  "lead-capture": 19.9,
  "appointments": 29.9,
  "members-area": 49.9,
};

export function calculateMonthlyTotal(
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): number {
  if (!plan) return 0;

  if (plan === "basico") {
    return BASICO_MONTHLY_PRICE;
  }

  if (plan === "premium-full") {
    return PREMIUM_FULL_TOTAL;
  }

  // plan === "construir"
  const addonsTotal = addonsSelected.reduce((sum, addonId) => {
    return sum + (ADDON_PRICES[addonId] ?? 0);
  }, 0);

  return CONSTRUIR_BASE_PRICE + addonsTotal;
}

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function getAllAddonsTotal(): number {
  return Object.values(ADDON_PRICES).reduce((sum, price) => sum + price, 0);
}

export function getPremiumFullSavings(): number {
  // Compare buying all addons separately vs premium-full
  const allAddons = getAllAddonsTotal();
  const premiumAddonPrice = PREMIUM_FULL_TOTAL - CONSTRUIR_BASE_PRICE; // Savings vs Construir + all addons
  return allAddons - premiumAddonPrice;
}
