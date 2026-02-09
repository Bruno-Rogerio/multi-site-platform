/* ─── Section variant definitions with premium flags ─── */

export type SectionVariant = {
  id: string;
  name: string;
  label?: string;
  description: string;
  premium: boolean;
};

export const heroVariants: SectionVariant[] = [
  { id: "centered", name: "Centralizado", description: "Texto centralizado com destaque", premium: false },
  { id: "minimal", name: "Minimal", description: "Limpo e direto ao ponto", premium: false },
  { id: "split", name: "Split", description: "Texto e imagem lado a lado", premium: true },
  { id: "card", name: "Card", description: "Bloco destacado com fundo", premium: true },
  { id: "centered-gradient", name: "Gradiente", description: "Centralizado com fundo gradiente", premium: false },
];

export const servicesVariants: SectionVariant[] = [
  { id: "default", name: "Grid", description: "Cards em grade organizada", premium: false },
  { id: "minimal-list", name: "Lista", description: "Lista vertical limpa", premium: false },
  { id: "masonry", name: "Masonry", description: "Layout dinâmico escalonado", premium: false },
  { id: "columns", name: "Colunas", description: "Colunas comparativas", premium: true },
  { id: "steps", name: "Passos", description: "Fluxo numerado por etapas", premium: true },
];

export const ctaVariants: SectionVariant[] = [
  { id: "banner", name: "Banner", description: "Faixa de destaque com botão", premium: false },
  { id: "centered", name: "Centralizado", description: "Bloco central com CTA", premium: false },
  { id: "banner-gradient", name: "Banner Gradiente", description: "Banner com fundo gradiente", premium: false },
  { id: "centered-gradient", name: "Centralizado Gradiente", description: "Centralizado com gradiente", premium: false },
  { id: "double", name: "Duplo", description: "Duas opções de ação", premium: true },
];

export const motionStyles: SectionVariant[] = [
  { id: "motion-none", name: "Sem animação", description: "Minimalista e direto", premium: false },
  { id: "motion-fade", name: "Fade simples", description: "Transição suave de opacidade", premium: false },
  { id: "motion-reveal", name: "Reveal suave", description: "Elementos surgem ao rolar", premium: true },
  { id: "motion-parallax", name: "Parallax", description: "Profundidade com camadas", premium: true },
  { id: "motion-vivid", name: "Vivo premium", description: "Microinterações e glow", premium: true },
];
