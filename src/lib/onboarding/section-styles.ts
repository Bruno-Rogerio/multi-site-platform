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

export const testimonialsVariants: SectionVariant[] = [
  { id: "grid", name: "Grade", description: "Cards em grade organizada", premium: false },
  { id: "carousel", name: "Carrossel", description: "Deslize entre depoimentos", premium: false },
  { id: "quotes", name: "Citações", description: "Estilo aspas destacadas", premium: true },
];

export const galleryVariants: SectionVariant[] = [
  { id: "grid", name: "Grade", description: "Grade uniforme de imagens", premium: false },
  { id: "masonry", name: "Masonry", description: "Layout dinâmico escalonado", premium: false },
  { id: "carousel", name: "Carrossel", description: "Deslize pelas fotos", premium: true },
];

export const faqVariants: SectionVariant[] = [
  { id: "accordion", name: "Acordeão", description: "Clique para expandir", premium: false },
  { id: "numbered", name: "Numerado", description: "Números grandes coloridos", premium: false },
  { id: "two-col", name: "Duas colunas", description: "Layout em grid de duas colunas", premium: true },
];

export const blogVariants: SectionVariant[] = [
  { id: "grid", name: "Grade", description: "Cards em grade 3 colunas", premium: false },
  { id: "list", name: "Lista", description: "Cards horizontais empilhados", premium: false },
  { id: "magazine", name: "Magazine", description: "Primeiro post em destaque", premium: true },
];

export const eventsVariants: SectionVariant[] = [
  { id: "timeline", name: "Timeline", description: "Linha do tempo vertical", premium: false },
  { id: "cards", name: "Cards", description: "Cards com destaque de data", premium: false },
  { id: "list", name: "Lista", description: "Linhas compactas", premium: true },
];

export const statsVariants: SectionVariant[] = [
  { id: "default", name: "Cards", description: "Cards glassmorphism com número em destaque", premium: false },
  { id: "banner", name: "Faixa", description: "Fundo na cor da marca, números em contraste", premium: false },
  { id: "accent", name: "Destaque", description: "Linha sólida no topo, estilo editorial", premium: false },
];

export const contactVariants: SectionVariant[] = [
  { id: "cards",   name: "Cards",   description: "Cards com glassmorphism e ícone de canal", premium: false },
  { id: "buttons", name: "Botões",  description: "Botões largos empilhados, estilo CTA",     premium: false },
  { id: "icons",   name: "Ícones",  description: "Ícones grandes em linha, visual minimalista", premium: false },
  { id: "banner",  name: "Faixa",   description: "Chips compactos em linha, estilo corporativo", premium: false },
];

export const motionStyles: SectionVariant[] = [
  { id: "motion-none", name: "Sem animação", description: "Minimalista e direto", premium: false },
  { id: "motion-fade", name: "Fade simples", description: "Transição suave de opacidade", premium: false },
  { id: "motion-reveal", name: "Reveal suave", description: "Elementos surgem ao rolar", premium: true },
  { id: "motion-parallax", name: "Parallax", description: "Profundidade com camadas", premium: true },
  { id: "motion-vivid", name: "Vivo premium", description: "Microinterações e glow", premium: true },
];
