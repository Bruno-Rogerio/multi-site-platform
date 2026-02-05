/* ─── Site style presets (global visual vibes) ─── */

export type SiteStylePreset = {
  id: string;
  name: string;
  vibe: string;
  description: string;
  previewClass: string;
};

export const siteStylePresets: SiteStylePreset[] = [
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    vibe: "Aereo",
    description: "Limpo, leve e focado em clareza",
    previewClass: "rounded-2xl border border-gray-200 bg-white",
  },
  {
    id: "soft-human",
    name: "Soft Human",
    vibe: "Empatico",
    description: "Acolhedor para saude e consultoria",
    previewClass: "rounded-2xl border border-violet-200/30 bg-gradient-to-br from-violet-50 to-blue-50",
  },
  {
    id: "editorial",
    name: "Editorial",
    vibe: "Luxo",
    description: "Visual elegante com credibilidade",
    previewClass: "rounded-2xl border border-purple-300/20 bg-gradient-to-br from-gray-900 to-purple-950",
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    vibe: "Inovador",
    description: "Impacto digital e energia tech",
    previewClass: "rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-[#0B1020] to-[#1D1D45]",
  },
  {
    id: "bold-contrast",
    name: "Bold Contrast",
    vibe: "Atitude",
    description: "Tipografia forte e secoes marcantes",
    previewClass: "rounded-2xl border border-white/20 bg-gray-950",
  },
  {
    id: "organic-warm",
    name: "Organic Warm",
    vibe: "Calor",
    description: "Tons quentes e proximidade humana",
    previewClass: "rounded-2xl border border-orange-300/20 bg-gradient-to-br from-orange-950 to-rose-950",
  },
];
