import type { OnboardingPlan, StepDefinition } from "./types";

/* ─── Pricing constants ─── */

export const BASE_MONTHLY_PRICE = 59.9;
export const PREMIUM_FULL_ADDON_PRICE = 49.9;
export const PREMIUM_FULL_TOTAL = BASE_MONTHLY_PRICE + PREMIUM_FULL_ADDON_PRICE; // 109.80

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

export const planDefinitions: PlanDefinition[] = [
  {
    id: "basico",
    name: "Basico",
    tagline: "Rapido e pronto",
    price: "R$ 59,90",
    priceNote: "/mes",
    description:
      "Escolha um layout pronto e personalize apenas o conteudo. Ideal para quem quer praticidade.",
    highlights: [
      "8+ layouts profissionais prontos",
      "Personalize textos e servicos",
      "Servicos em grid ou lista",
      "Online em menos de 5 minutos",
    ],
  },
  {
    id: "construir",
    name: "Construir",
    tagline: "Liberdade criativa",
    price: "R$ 59,90",
    priceNote: "/mes + add-ons",
    description:
      "Monte seu site do zero com controle total. Recursos premium disponiveis como extras.",
    highlights: [
      "Paleta de cores customizavel",
      "Escolha de fonte e botoes",
      "Pack de icones basico incluso",
      "2 canais de contato inclusos",
      "Expansivel com add-ons premium",
    ],
  },
  {
    id: "premium-full",
    name: "Premium Full",
    tagline: "Tudo liberado",
    price: "R$ 109,80",
    priceNote: "/mes",
    description:
      "Construa livremente com todos os recursos premium desbloqueados. Sem limites.",
    highlights: [
      "Tudo do Construir incluso",
      "Icones premium liberados",
      "Todos os canais de contato",
      "Secoes e cards ilimitados",
      "Blog e pagina Sobre inclusos",
      "Animacoes avancadas",
    ],
    recommended: true,
  },
];

/* ─── Step definitions per plan ─── */

export function getStepsForPlan(plan: OnboardingPlan | null): StepDefinition[] {
  if (!plan) {
    return [{ id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" }];
  }

  if (plan === "basico") {
    return [
      { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
      { id: "template-gallery", label: "Template", subtitle: "Escolha o layout" },
      { id: "template-content", label: "Conteudo", subtitle: "Personalize textos" },
      { id: "business-info", label: "Negocio", subtitle: "Dados e subdominio" },
      { id: "checkout", label: "Finalizar", subtitle: "Cadastro e pagamento" },
    ];
  }

  return [
    { id: "plan-selection", label: "Plano", subtitle: "Escolha seu modo" },
    { id: "style-palette", label: "Visual", subtitle: "Estilo, cores e fontes" },
    { id: "section-builder", label: "Construcao", subtitle: "Secoes, icones e CTAs" },
    { id: "content-editor", label: "Conteudo", subtitle: "Textos e descricoes" },
    { id: "business-info", label: "Negocio", subtitle: "Dados e subdominio" },
    { id: "checkout", label: "Finalizar", subtitle: "Cadastro e pagamento" },
  ];
}
