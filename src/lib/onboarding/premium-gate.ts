/* ─── Premium feature gating logic ─── */

import type { OnboardingPlan } from "./types";

export type PremiumFeatureId =
  | "extra-cta-types"
  | "floating-cta"
  | "premium-icon-pack"
  | "extra-service-cards"
  | "extra-sections"
  | "about-page"
  | "blog-page"
  | "premium-button-models"
  | "advanced-motion"
  | "premium-hero-variants"
  | "premium-services-variants"
  | "premium-cta-variants"
  | "custom-colors"
  | "premium-fonts";

export type PremiumFeature = {
  id: PremiumFeatureId;
  label: string;
  description: string;
  monthlyPrice: number;
  addonId: string;
};

export const premiumFeatures: PremiumFeature[] = [
  {
    id: "extra-cta-types",
    label: "CTAs extras",
    description: "Mais de 2 canais de contato (até 5)",
    monthlyPrice: 9.9,
    addonId: "extra-cta",
  },
  {
    id: "floating-cta",
    label: "CTA flutuante",
    description: "Botão fixo na tela para contato rápido",
    monthlyPrice: 9.9,
    addonId: "floating-cta",
  },
  {
    id: "premium-icon-pack",
    label: "Ícones premium",
    description: "60+ ícones temáticos exclusivos",
    monthlyPrice: 9.9,
    addonId: "premium-icons",
  },
  {
    id: "extra-service-cards",
    label: "Cards extras",
    description: "Mais de 4 cards de serviço",
    monthlyPrice: 9.9,
    addonId: "extra-cards",
  },
  {
    id: "extra-sections",
    label: "Seções extras",
    description: "Mais de 4 seções no site",
    monthlyPrice: 9.9,
    addonId: "extra-sections",
  },
  {
    id: "about-page",
    label: "Página Sobre",
    description: "Página dedicada sobre você",
    monthlyPrice: 14.9,
    addonId: "about-page",
  },
  {
    id: "blog-page",
    label: "Blog",
    description: "Sistema de posts com SEO",
    monthlyPrice: 29.9,
    addonId: "blog",
  },
  {
    id: "premium-button-models",
    label: "Botões premium",
    description: "Estilos de botão avançados com efeitos",
    monthlyPrice: 4.9,
    addonId: "premium-buttons",
  },
  {
    id: "advanced-motion",
    label: "Animações avançadas",
    description: "Parallax, glow e microinterações",
    monthlyPrice: 9.9,
    addonId: "advanced-motion",
  },
  {
    id: "premium-hero-variants",
    label: "Hero premium",
    description: "Variantes Split e Card no hero",
    monthlyPrice: 9.9,
    addonId: "premium-design",
  },
  {
    id: "premium-services-variants",
    label: "Serviços premium",
    description: "Variantes colunas e passos nos serviços",
    monthlyPrice: 9.9,
    addonId: "premium-design",
  },
  {
    id: "premium-cta-variants",
    label: "CTA premium",
    description: "Variante dupla no CTA",
    monthlyPrice: 9.9,
    addonId: "premium-design",
  },
  {
    id: "custom-colors",
    label: "Cores personalizadas",
    description: "Escolha suas próprias cores para o site",
    monthlyPrice: 4.9,
    addonId: "custom-colors",
  },
  {
    id: "premium-fonts",
    label: "Fontes premium",
    description: "Poppins, Playfair, Montserrat e Lora",
    monthlyPrice: 4.9,
    addonId: "premium-fonts",
  },
];

export function getFeatureById(id: PremiumFeatureId): PremiumFeature | undefined {
  return premiumFeatures.find((f) => f.id === id);
}

export function isFeatureUnlocked(
  featureIdOrAddonId: PremiumFeatureId | string,
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): boolean {
  if (plan === "premium-full") return true;
  if (plan === "basico" || !plan) return false;

  // plan === "construir": check if the corresponding addon is purchased
  // First try to find by featureId
  const feature = getFeatureById(featureIdOrAddonId as PremiumFeatureId);
  if (feature) {
    return addonsSelected.includes(feature.addonId);
  }

  // If not found, treat the input as an addonId directly
  return addonsSelected.includes(featureIdOrAddonId);
}

export type FeatureStatus = "included" | "premium" | "blocked";

export function getFeatureStatus(
  featureId: PremiumFeatureId,
  plan: OnboardingPlan | null,
  addonsSelected: string[]
): FeatureStatus {
  if (plan === "premium-full") return "included";
  if (plan === "basico" || !plan) return "blocked";

  const feature = getFeatureById(featureId);
  if (!feature) return "blocked";

  return addonsSelected.includes(feature.addonId) ? "included" : "premium";
}

export function getFeaturePrice(featureId: PremiumFeatureId): number {
  const feature = getFeatureById(featureId);
  return feature?.monthlyPrice ?? 0;
}

/* ─── Limits per plan ─── */

export const BASIC_SERVICE_CARDS_LIMIT = 4;
export const BASIC_SECTIONS_LIMIT = 4;
export const BASIC_CTA_TYPES_LIMIT = 2;

export function getServiceCardsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 20; // Effectively unlimited
  if (plan === "basico") return 4;
  if (addonsSelected.includes("extra-cards")) return 20;
  return BASIC_SERVICE_CARDS_LIMIT;
}

export function getSectionsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 10;
  if (plan === "basico") return 4;
  if (addonsSelected.includes("extra-sections")) return 10;
  return BASIC_SECTIONS_LIMIT;
}

export function getCtaTypesLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 5;
  if (plan === "basico") return 2;
  if (addonsSelected.includes("extra-cta")) return 5;
  return BASIC_CTA_TYPES_LIMIT;
}

export function getFloatingCtaSlotsLimit(plan: OnboardingPlan | null, addonsSelected: string[]): number {
  if (plan === "premium-full") return 2;
  if (plan === "basico") return 0;
  if (addonsSelected.includes("floating-cta")) return 2;
  return 0;
}

export type FeatureLimits = {
  maxCards: number;
  maxSections: number;
  maxCtas: number;
  maxFloatingCtas: number;
};

export function getFeatureLimits(plan: OnboardingPlan | null, addonsSelected: string[]): FeatureLimits {
  return {
    maxCards: getServiceCardsLimit(plan, addonsSelected),
    maxSections: getSectionsLimit(plan, addonsSelected),
    maxCtas: getCtaTypesLimit(plan, addonsSelected),
    maxFloatingCtas: getFloatingCtaSlotsLimit(plan, addonsSelected),
  };
}
