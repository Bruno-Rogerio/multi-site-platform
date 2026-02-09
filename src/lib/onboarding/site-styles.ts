/* ─── Site style presets (global visual vibes) ─── */

export type SiteStylePreset = {
  id: string;
  name: string;
  vibe: string;
  description: string;
  previewClass: string;
  // Visual properties applied to preview
  borderRadius: string; // CSS border-radius for cards/sections
  spacing: "compact" | "normal" | "spacious";
  shadowIntensity: "none" | "subtle" | "medium" | "strong";
  suggestedPalette: string; // Default palette ID to suggest
};

export const siteStylePresets: SiteStylePreset[] = [
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    vibe: "Aéreo",
    description: "Limpo, leve e focado em clareza",
    previewClass: "rounded-2xl border border-gray-200 bg-white",
    borderRadius: "8px",
    spacing: "spacious",
    shadowIntensity: "none",
    suggestedPalette: "clean-sky",
  },
  {
    id: "soft-human",
    name: "Soft Human",
    vibe: "Empático",
    description: "Acolhedor para saúde e consultoria",
    previewClass: "rounded-2xl border border-violet-200/30 bg-gradient-to-br from-violet-50 to-blue-50",
    borderRadius: "16px",
    spacing: "spacious",
    shadowIntensity: "subtle",
    suggestedPalette: "lavender-dream",
  },
  {
    id: "editorial",
    name: "Editorial",
    vibe: "Luxo",
    description: "Visual elegante com credibilidade",
    previewClass: "rounded-2xl border border-purple-300/20 bg-gradient-to-br from-gray-900 to-purple-950",
    borderRadius: "4px",
    spacing: "normal",
    shadowIntensity: "medium",
    suggestedPalette: "midnight-gold",
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    vibe: "Inovador",
    description: "Impacto digital e energia tech",
    previewClass: "rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-[#0B1020] to-[#1D1D45]",
    borderRadius: "12px",
    spacing: "normal",
    shadowIntensity: "medium",
    suggestedPalette: "buildsphere",
  },
  {
    id: "bold-contrast",
    name: "Bold Contrast",
    vibe: "Atitude",
    description: "Tipografia forte e seções marcantes",
    previewClass: "rounded-2xl border border-white/20 bg-gray-950",
    borderRadius: "0px",
    spacing: "compact",
    shadowIntensity: "strong",
    suggestedPalette: "buildsphere",
  },
  {
    id: "organic-warm",
    name: "Organic Warm",
    vibe: "Calor",
    description: "Tons quentes e proximidade humana",
    previewClass: "rounded-2xl border border-orange-300/20 bg-gradient-to-br from-orange-950 to-rose-950",
    borderRadius: "20px",
    spacing: "spacious",
    shadowIntensity: "subtle",
    suggestedPalette: "warm-sunset",
  },
];

export function getSiteStyleById(id: string): SiteStylePreset | undefined {
  return siteStylePresets.find((s) => s.id === id);
}

export function getStyleCssVars(style: SiteStylePreset): Record<string, string> {
  const spacingMap = {
    compact: "8px",
    normal: "16px",
    spacious: "24px",
  };
  const shadowMap = {
    none: "none",
    subtle: "0 2px 8px rgba(0,0,0,0.1)",
    medium: "0 4px 16px rgba(0,0,0,0.15)",
    strong: "0 8px 32px rgba(0,0,0,0.25)",
  };

  return {
    "--preview-radius": style.borderRadius,
    "--preview-spacing": spacingMap[style.spacing],
    "--preview-shadow": shadowMap[style.shadowIntensity],
  };
}
