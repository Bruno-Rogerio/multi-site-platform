/* ─── General helper utilities for the wizard ─── */

/* ─── Color utilities ─── */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

export function isDarkColor(hex: string): boolean {
  return getLuminance(hex) < 0.5;
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getReadableTextColor(bgColor: string): string {
  const darkText = "#0B1020";
  const lightText = "#EAF0FF";

  const darkContrast = getContrastRatio(darkText, bgColor);
  const lightContrast = getContrastRatio(lightText, bgColor);

  return darkContrast > lightContrast ? darkText : lightText;
}

/* ─── Array utilities ─── */

export function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function moveInArray<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/* ─── String utilities ─── */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ─── Content utilities ─── */

export function parseServiceItems(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatServiceItems(items: string[]): string {
  return items.join("\n");
}

/* ─── Section variant mapping ─── */

export function mapVariantToDbVariant(variant: string): string {
  // Maps UI variant IDs like "hero-split" to DB variant "split"
  const mapping: Record<string, string> = {
    "hero-split": "split",
    "hero-centered": "centered",
    "hero-minimal": "minimal",
    "hero-card": "card",
    "services-grid": "default",
    "services-list": "minimal",
    "services-columns": "columns",
    "services-steps": "steps",
    "cta-banner": "banner",
    "cta-card": "default",
    "cta-double": "double",
    "cta-floating": "floating",
  };

  return mapping[variant] ?? variant;
}

/* ─── Default content ─── */

export const DEFAULT_CONTENT = {
  heroEyebrow: "",
  heroTitle: "Título do seu site",
  heroSubtitle: "Uma breve descrição do que você faz e como pode ajudar seus clientes.",
  heroCtaLabel: "Falar comigo",
  heroCtaUrl: "",
  servicesTitle: "Serviços",
  ctaTitle: "Vamos conversar?",
  ctaDescription: "Entre em contato e saiba como posso te ajudar.",
  ctaButtonLabel: "Falar no WhatsApp",
  ctaButtonUrl: "",
  ctaSecondaryLabel: "Saiba mais",
  ctaSecondaryUrl: "",
  contactTitle: "Contato",
  contactSubtitle: "Entre em contato pelos canais abaixo",
};

export const DEFAULT_SERVICE_CARDS = [
  { title: "Serviço 1", description: "Descrição do serviço", iconName: "Star" },
  { title: "Serviço 2", description: "Descrição do serviço", iconName: "Heart" },
  { title: "Serviço 3", description: "Descrição do serviço", iconName: "Shield" },
  { title: "Serviço 4", description: "Descrição do serviço", iconName: "Zap" },
];
