/* ─── Premium feature gating ─── */

import type { OnboardingPlan } from "./types";

export type PremiumFeatureId =
  | "custom-colors"
  | "premium-fonts"
  | "premium-hero-variants"
  | "premium-services-variants"
  | "premium-cta-variants"
  | "advanced-motion"
  | "floating-cta"
  | "extra-cta-types"
  | "premium-icon-pack"
  | "extra-service-cards"
  | "extra-sections";

/** Check if a feature is unlocked given the current plan */
export function isFeatureUnlocked(
  _featureId: PremiumFeatureId | string,
  plan: OnboardingPlan | null,
): boolean {
  return plan === "premium";
}

/* ─── Limits per plan ─── */

export function getServiceCardsLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 20;
  if (plan === "starter") return 3;
  return 999; // basico: ilimitado
}

export function getSectionsLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 10;
  if (plan === "starter") return 4;
  return 99; // basico: todas as seções disponíveis
}

export function getCtaTypesLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 5;
  if (plan === "starter") return 1;
  return 99; // basico: todos os tipos disponíveis
}

export function getFloatingCtaSlotsLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 2;
  if (plan === "basico") return 2; // liberto no Básico
  return 0; // starter: bloqueado
}
