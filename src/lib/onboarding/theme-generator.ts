/* ─── Visual Identity Theme Generator ─── */
// Derives a complete site theme from 4 strategic inputs, using pure JS HSL math.

export type VisualTone = "dark" | "light" | "neutral";
export type VisualPersonality = "clean" | "bold" | "elegant" | "friendly";
export type VisualMotion = "none" | "subtle" | "lively";

export interface GeneratedTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  buttonStyle: "rounded" | "pill" | "square";
  motionStyle: string;
  headerStyle: "blur" | "solid" | "minimal" | "gradient" | "dark";
  dividerStyle: "wave" | "diagonal" | "curve" | "line" | "none";
  "--site-radius": string;
  "--site-spacing": string;
  "--site-shadow": string;
}

/* ─── HSL utilities ─── */

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;
  if (hNorm < 60)      { r = c; g = x; b = 0; }
  else if (hNorm < 120){ r = x; g = c; b = 0; }
  else if (hNorm < 180){ r = 0; g = c; b = x; }
  else if (hNorm < 240){ r = 0; g = x; b = c; }
  else if (hNorm < 300){ r = x; g = 0; b = c; }
  else                  { r = c; g = 0; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* ─── Accent derivation ─── */

function deriveAccent(primaryHex: string, personality: VisualPersonality): string {
  const [h, s, l] = hexToHsl(primaryHex);
  switch (personality) {
    case "clean":    return hslToHex(h + 180, Math.round(s * 0.85), l);
    case "bold":     return hslToHex(h + 30,  Math.min(Math.round(s * 1.15), 95), l);
    case "elegant":  return hslToHex(h + 240, Math.round(s * 0.65), l + 8);
    case "friendly": return hslToHex(h + 60,  s, l + 5);
  }
}

/* ─── Tone presets ─── */

const TONE_PRESETS: Record<VisualTone, { bg: string; text: string }> = {
  dark:    { bg: "#0B1020", text: "#EAF0FF" },
  light:   { bg: "#F8FAFF", text: "#1A2040" },
  neutral: { bg: "#12182B", text: "#E8EEFF" },
};

/* ─── Personality presets ─── */

const PERSONALITY_PRESETS: Record<
  VisualPersonality,
  {
    fontFamily: string;
    buttonStyle: "rounded" | "pill" | "square";
    radius: string;
    spacing: string;
    shadow: string;
    headerStyle: "blur" | "solid" | "minimal" | "gradient" | "dark";
    dividerStyle: "wave" | "diagonal" | "curve" | "line" | "none";
  }
> = {
  clean: {
    fontFamily: "Inter",
    buttonStyle: "rounded",
    radius: "8px",
    spacing: "16px",
    shadow: "0 2px 8px rgba(0,0,0,0.08)",
    headerStyle: "blur",
    dividerStyle: "line",
  },
  bold: {
    fontFamily: "Sora",
    buttonStyle: "pill",
    radius: "20px",
    spacing: "24px",
    shadow: "0 8px 32px rgba(0,0,0,0.2)",
    headerStyle: "solid",
    dividerStyle: "diagonal",
  },
  elegant: {
    fontFamily: "Playfair Display",
    buttonStyle: "square",
    radius: "0px",
    spacing: "24px",
    shadow: "0 4px 16px rgba(0,0,0,0.1)",
    headerStyle: "minimal",
    dividerStyle: "wave",
  },
  friendly: {
    fontFamily: "Poppins",
    buttonStyle: "pill",
    radius: "16px",
    spacing: "16px",
    shadow: "0 4px 12px rgba(0,0,0,0.1)",
    headerStyle: "blur",
    dividerStyle: "curve",
  },
};

/* ─── Motion mapping ─── */

const MOTION_MAP: Record<VisualMotion, string> = {
  none:   "motion-none",
  subtle: "motion-fade",
  lively: "motion-vivid",
};

/* ─── Main export ─── */

export function generateTheme(
  primaryHex: string,
  tone: VisualTone,
  personality: VisualPersonality,
  motion: VisualMotion
): GeneratedTheme {
  const preset = PERSONALITY_PRESETS[personality];
  const colors = TONE_PRESETS[tone];

  return {
    primaryColor:    primaryHex,
    accentColor:     deriveAccent(primaryHex, personality),
    backgroundColor: colors.bg,
    textColor:       colors.text,
    fontFamily:      preset.fontFamily,
    buttonStyle:     preset.buttonStyle,
    motionStyle:     MOTION_MAP[motion],
    headerStyle:     preset.headerStyle,
    dividerStyle:    preset.dividerStyle,
    "--site-radius":  preset.radius,
    "--site-spacing": preset.spacing,
    "--site-shadow":  preset.shadow,
  };
}
