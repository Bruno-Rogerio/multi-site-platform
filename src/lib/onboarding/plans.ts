import type { OnboardingPlan, StepDefinition } from "./types";

/* ─── Pricing constants ─── */

export const BASICO_MONTHLY_PRICE = 59.9;
export const CONSTRUIR_BASE_PRICE = 79.9;
export const PREMIUM_FULL_TOTAL = 109.8;

// Legacy alias for backward compatibility
export const BASE_MONTHLY_PRICE = BASICO_MONTHLY_PRICE;

/* ─── Plan definitions ─── */

export type PlanDefinition = {
  id: OnboardingPlan;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  description: string;
  highlights: string[];
  recommended?: boolean;
};

export function getPlanById(id: OnboardingPlan): PlanDefinition | undefined {
  return planDefinitions.find((plan) => plan.id === id);
}

/* ─── Add-on definitions ─── */

export type AddonDefinition = {
  id: string;
  name: string;
  price: number;
};

export const ADDON_DEFINITIONS: AddonDefinition[] = [
  { id: "extra-cta", name: "CTAs extras", price: 9.9 },
  { id: "floating-cta", name: "CTA flutuante", price: 9.9 },
  { id: "premium-icons", name: "Ícones premium", price: 9.9 },
  { id: "extra-cards", name: "Cards extras", price: 9.9 },
  { id: "extra-sections", name: "Seções extras", price: 9.9 },
  { id: "about-page", name: "Página Sobre", price: 14.9 },
  { id: "blog", name: "Blog", price: 29.9 },
  { id: "premium-buttons", name: "Botões premium", price: 4.9 },
  { id: "advanced-motion", name: "Animações avançadas", price: 9.9 },
];

export const planDefinitions: PlanDefinition[] = [
  {
    id: "basico",
    name: "Básico",
    tagline: "Rápido e pronto",
    price: "R$ 59,90",
    priceNote: "/mês",
    description:
      "Escolha um layout pronto e personalize apenas o conteúdo. Ideal para quem quer praticidade.",
    highlights: [
      "8+ layouts profissionais prontos",
      "Personalize textos e serviços",
      "Serviços em grid ou lista",
      "Online em menos de 5 minutos",
    ],
  },
  {
    id: "construir",
    name: "Construir",
    tagline: "Liberdade criativa",
    price: "R$ 79,90",
    priceNote: "/mês + add-ons",
    description:
      "Monte seu site do zero com controle total. Recursos premium disponíveis como extras.",
    highlights: [
      "Paleta de cores customizável",
      "Escolha de fonte e botões",
      "Pack de ícones básico incluso",
      "2 canais de contato inclusos",
      "Expansível com add-ons premium",
    ],
  },
  {
    id: "premium-full",
    name: "Premium Full",
    tagline: "Tudo liberado",
    price: "R$ 109,80",
    priceNote: "/mês",
    description:
      "Construa livremente com todos os recursos premium desbloqueados. Sem limites.",
    highlights: [
      "Tudo do Construir incluso",
      "Ícones premium liberados",
      "Todos os canais de contato",
      "Seções e cards ilimitados",
      "Blog e página Sobre inclusos",
      "Animações avançadas",
    ],
    recommended: true,
  },
];

/* ─── Stripe price IDs per plan ─── */

export const PLAN_PRICE_IDS: Record<OnboardingPlan, string> = {
  "basico":       process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO       ?? "price_1T59HfFFAjgAeuC1RGfeU8wW",
  "construir":    process.env.NEXT_PUBLIC_STRIPE_PRICE_CONSTRUIR     ?? "price_1T59ICFFAjgAeuC1tJrHJFGB",
  "premium-full": process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_FULL ?? "price_1T59ImFFAjgAeuC1PHZZu2M7",
};

/* ─── Step definitions per plan ─── */

const LEAD_CAPTURE_STEP: StepDefinition = {
  id: "lead-capture",
  label: "Início",
  subtitle: "Dados básicos",
};

export function getStepsForPlan(plan: OnboardingPlan | null): StepDefinition[] {
  if (!plan) {
    return [
      LEAD_CAPTURE_STEP,
      { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
    ];
  }

  if (plan === "basico") {
    return [
      LEAD_CAPTURE_STEP,
      { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
      { id: "template-gallery", label: "Template", subtitle: "Escolha o layout" },
      { id: "template-content", label: "Conteúdo", subtitle: "Personalize textos" },
      { id: "finalizar", label: "Finalizar", subtitle: "Criar demonstração" },
    ];
  }

  return [
    LEAD_CAPTURE_STEP,
    { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
    { id: "style-palette", label: "Visual", subtitle: "Estilo, cores e fontes" },
    { id: "section-builder", label: "Construção", subtitle: "Seções, ícones e CTAs" },
    { id: "content-editor", label: "Conteúdo", subtitle: "Textos e descrições" },
    { id: "finalizar", label: "Finalizar", subtitle: "Criar demonstração" },
  ];
}
