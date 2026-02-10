/* ─── Premium feature gating (section-level toggles) ─── */

import type { OnboardingPlan } from "./types";

export type SectionPremiumId =
  | "premium-paleta"
  | "premium-tipografia"
  | "premium-variantes"
  | "premium-canais"
  | "premium-cards";

/* Map each feature to its section toggle */
const FEATURE_TO_SECTION: Record<string, SectionPremiumId> = {
  "custom-colors": "premium-paleta",
  "premium-fonts": "premium-tipografia",
  "premium-hero-variants": "premium-variantes",
  "premium-services-variants": "premium-variantes",
  "premium-cta-variants": "premium-variantes",
  "advanced-motion": "premium-variantes",
  "extra-cta-types": "premium-canais",
  "floating-cta": "premium-canais",
  "extra-service-cards": "premium-cards",
  "premium-icon-pack": "premium-cards",
  "extra-sections": "premium-cards",
};

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

/** Returns which section-premium unlocks a given feature */
export function getSectionPremiumFor(featureId: PremiumFeatureId): SectionPremiumId {
  return FEATURE_TO_SECTION[featureId] ?? "premium-variantes";
}

/** Check if a feature is unlocked given the current plan and addons */
export function isFeatureUnlocked(
  featureId: PremiumFeatureId | string,
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): boolean {
  if (plan === "premium-full") return true;
  if (plan === "basico" || !plan) return false;

  // plan === "construir": check section-level premium
  const sectionId = FEATURE_TO_SECTION[featureId];
  if (!sectionId) return false;
  return addonsSelected.includes(sectionId);
}

/** Check if a section-level premium is active */
export function isSectionPremiumActive(
  sectionId: SectionPremiumId,
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): boolean {
  if (plan === "premium-full") return true;
  if (plan !== "construir") return false;
  return addonsSelected.includes(sectionId);
}

/* ─── Limits per plan ─── */

export function getServiceCardsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 20;
  if (plan === "basico") return 4;
  if (addonsSelected.includes("premium-cards")) return 20;
  return 4;
}

export function getSectionsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 10;
  if (plan === "basico") return 4;
  if (addonsSelected.includes("premium-cards")) return 10;
  return 4;
}

export function getCtaTypesLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 5;
  if (plan === "basico") return 2;
  if (addonsSelected.includes("premium-canais")) return 5;
  return 2;
}

export function getFloatingCtaSlotsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 2;
  if (plan === "basico") return 0;
  if (addonsSelected.includes("premium-canais")) return 2;
  return 0;
}
