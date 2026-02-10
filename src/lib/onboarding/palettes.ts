/* ─── Color palette presets (includes style properties) ─── */

export type PalettePreset = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  // Style properties (previously from site-styles)
  borderRadius: string;
  spacing: "compact" | "normal" | "spacious";
  shadowIntensity: "none" | "subtle" | "medium" | "strong";
};

export const palettePresets: PalettePreset[] = [
  { id: "buildsphere", name: "BuildSphere", primary: "#3B82F6", accent: "#22D3EE", background: "#0B1020", text: "#EAF0FF", borderRadius: "12px", spacing: "normal", shadowIntensity: "medium" },
  { id: "midnight-violet", name: "Midnight Violet", primary: "#7C5CFF", accent: "#38BDF8", background: "#111827", text: "#EEF2FF", borderRadius: "4px", spacing: "normal", shadowIntensity: "medium" },
  { id: "aurora-soft", name: "Aurora Soft", primary: "#2563EB", accent: "#A78BFA", background: "#F8FAFC", text: "#0F172A", borderRadius: "16px", spacing: "spacious", shadowIntensity: "subtle" },
  { id: "warm-premium", name: "Warm Premium", primary: "#C2410C", accent: "#FB7185", background: "#1C1917", text: "#FFF7ED", borderRadius: "20px", spacing: "spacious", shadowIntensity: "subtle" },
  { id: "forest-trust", name: "Forest Trust", primary: "#15803D", accent: "#22C55E", background: "#0F172A", text: "#ECFDF5", borderRadius: "12px", spacing: "normal", shadowIntensity: "subtle" },
  { id: "mono-pro", name: "Mono Pro", primary: "#111827", accent: "#52525B", background: "#FAFAFA", text: "#09090B", borderRadius: "0px", spacing: "compact", shadowIntensity: "strong" },
  { id: "solar-pop", name: "Solar Pop", primary: "#F59E0B", accent: "#F97316", background: "#111827", text: "#FFFBEB", borderRadius: "8px", spacing: "compact", shadowIntensity: "strong" },
  { id: "mint-cloud", name: "Mint Cloud", primary: "#0D9488", accent: "#14B8A6", background: "#F0FDFA", text: "#134E4A", borderRadius: "16px", spacing: "spacious", shadowIntensity: "subtle" },
  { id: "rose-luxe", name: "Rose Luxe", primary: "#E11D48", accent: "#FB7185", background: "#1F1022", text: "#FFE4E6", borderRadius: "8px", spacing: "normal", shadowIntensity: "medium" },
  { id: "ocean-deep", name: "Ocean Deep", primary: "#0EA5E9", accent: "#06B6D4", background: "#082F49", text: "#E0F2FE", borderRadius: "12px", spacing: "normal", shadowIntensity: "medium" },
];

export function getPaletteById(id: string): PalettePreset | undefined {
  return palettePresets.find((p) => p.id === id);
}

export function isDarkBackground(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const spacingMap = { compact: "8px", normal: "16px", spacious: "24px" };
const shadowMap = {
  none: "none",
  subtle: "0 2px 8px rgba(0,0,0,0.1)",
  medium: "0 4px 16px rgba(0,0,0,0.15)",
  strong: "0 8px 32px rgba(0,0,0,0.25)",
};

export function getPaletteStyleVars(palette: PalettePreset): Record<string, string> {
  return {
    "--preview-radius": palette.borderRadius,
    "--preview-spacing": spacingMap[palette.spacing],
    "--preview-shadow": shadowMap[palette.shadowIntensity],
  };
}
