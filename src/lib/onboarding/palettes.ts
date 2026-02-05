/* ─── Color palette presets ─── */

export type PalettePreset = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
};

export const palettePresets: PalettePreset[] = [
  { id: "buildsphere", name: "BuildSphere", primary: "#3B82F6", accent: "#22D3EE", background: "#0B1020", text: "#EAF0FF" },
  { id: "midnight-violet", name: "Midnight Violet", primary: "#7C5CFF", accent: "#38BDF8", background: "#111827", text: "#EEF2FF" },
  { id: "aurora-soft", name: "Aurora Soft", primary: "#2563EB", accent: "#A78BFA", background: "#F8FAFC", text: "#0F172A" },
  { id: "warm-premium", name: "Warm Premium", primary: "#C2410C", accent: "#FB7185", background: "#1C1917", text: "#FFF7ED" },
  { id: "forest-trust", name: "Forest Trust", primary: "#15803D", accent: "#22C55E", background: "#0F172A", text: "#ECFDF5" },
  { id: "mono-pro", name: "Mono Pro", primary: "#111827", accent: "#52525B", background: "#FAFAFA", text: "#09090B" },
  { id: "solar-pop", name: "Solar Pop", primary: "#F59E0B", accent: "#F97316", background: "#111827", text: "#FFFBEB" },
  { id: "mint-cloud", name: "Mint Cloud", primary: "#0D9488", accent: "#14B8A6", background: "#F0FDFA", text: "#134E4A" },
  { id: "rose-luxe", name: "Rose Luxe", primary: "#E11D48", accent: "#FB7185", background: "#1F1022", text: "#FFE4E6" },
  { id: "ocean-deep", name: "Ocean Deep", primary: "#0EA5E9", accent: "#06B6D4", background: "#082F49", text: "#E0F2FE" },
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
