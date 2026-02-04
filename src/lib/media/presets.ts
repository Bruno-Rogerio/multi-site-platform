export type MediaSlot = "hero" | "services" | "cta" | "logo";

export type MediaPreset = {
  minWidth: number;
  minHeight: number;
  recommendedText: string;
};

export const mediaPresets: Record<MediaSlot, MediaPreset> = {
  hero: {
    minWidth: 1400,
    minHeight: 800,
    recommendedText: "Hero: recomendado 1400x800 (16:9)",
  },
  services: {
    minWidth: 1000,
    minHeight: 750,
    recommendedText: "Services: recomendado 1000x750 (4:3)",
  },
  cta: {
    minWidth: 1200,
    minHeight: 675,
    recommendedText: "CTA: recomendado 1200x675 (16:9)",
  },
  logo: {
    minWidth: 320,
    minHeight: 320,
    recommendedText: "Logo: recomendado 512x512 (1:1)",
  },
};
