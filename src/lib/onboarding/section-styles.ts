/* ─── Section variant definitions with premium flags ─── */

export type SectionVariant = {
  id: string;
  label: string;
  description: string;
  premium: boolean;
};

export const heroVariants: SectionVariant[] = [
  { id: "centered", label: "Centralizado", description: "Texto centralizado com destaque", premium: false },
  { id: "minimal", label: "Minimal", description: "Limpo e direto ao ponto", premium: false },
  { id: "split", label: "Split", description: "Texto e imagem lado a lado", premium: true },
  { id: "card", label: "Card", description: "Bloco destacado com fundo", premium: true },
];

export const servicesVariants: SectionVariant[] = [
  { id: "default", label: "Grid", description: "Cards em grade organizada", premium: false },
  { id: "minimal", label: "Lista", description: "Lista vertical limpa", premium: false },
  { id: "columns", label: "Colunas", description: "Colunas comparativas", premium: true },
  { id: "steps", label: "Passos", description: "Fluxo numerado por etapas", premium: true },
];

export const ctaVariants: SectionVariant[] = [
  { id: "banner", label: "Banner", description: "Faixa de destaque com botao", premium: false },
  { id: "default", label: "Card", description: "Bloco central com CTA", premium: false },
  { id: "double", label: "Duplo", description: "Duas opcoes de acao", premium: true },
  { id: "floating", label: "Flutuante", description: "CTA destacado com efeito", premium: true },
];

export const motionStyles: SectionVariant[] = [
  { id: "motion-none", label: "Sem animacao", description: "Minimalista e direto", premium: false },
  { id: "motion-reveal", label: "Reveal suave", description: "Elementos surgem ao rolar", premium: false },
  { id: "motion-parallax", label: "Parallax", description: "Profundidade com camadas", premium: true },
  { id: "motion-vivid", label: "Vivo premium", description: "Microinteracoes e glow", premium: true },
];
