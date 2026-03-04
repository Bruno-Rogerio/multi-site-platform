import type { OnboardingPlan, StepDefinition } from "./types";

/* ─── Pricing constants ─── */

export const BASICO_MONTHLY_PRICE = 59.9;
export const PREMIUM_MONTHLY_PRICE = 109.8;

// Legacy alias
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
      "Subdomínio personalizado",
      "Online em menos de 5 minutos",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Tudo liberado",
    price: "R$ 109,80",
    priceNote: "/mês",
    description:
      "Construa livremente com identidade visual completa, múltiplas páginas e todos os recursos desbloqueados.",
    highlights: [
      "Tudo do plano Básico",
      "Personalização visual completa",
      "Múltiplas páginas (FAQ, Depoimentos...)",
      "Depoimentos ilimitados",
      "SEO básico configurável",
      "Sem branding BuildSphere",
    ],
    recommended: true,
  },
];

/* ─── Stripe price IDs per plan ─── */

export const PLAN_PRICE_IDS: Record<OnboardingPlan, string> = {
  basico:   process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO        ?? "price_1T59HfFFAjgAeuC1RGfeU8wW",
  premium:  process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_FULL  ?? "price_1T59ImFFAjgAeuC1PHZZu2M7",
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

  // premium
  return [
    LEAD_CAPTURE_STEP,
    { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
    { id: "visual-identity", label: "Visual", subtitle: "Identidade da marca" },
    { id: "section-canvas", label: "Monte seu site", subtitle: "Estrutura e canais" },
    { id: "content-editor", label: "Conteúdo", subtitle: "Textos e descrições" },
    { id: "finalizar", label: "Finalizar", subtitle: "Criar demonstração" },
  ];
}
