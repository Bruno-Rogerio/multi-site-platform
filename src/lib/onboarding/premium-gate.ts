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
  return 4; // basico
}

export function getSectionsLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 10;
  return 4; // basico
}

export function getCtaTypesLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 5;
  return 2; // basico
}

export function getFloatingCtaSlotsLimit(plan: OnboardingPlan | null): number {
  if (plan === "premium") return 2;
  return 0; // basico
}
