"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import { useWizard } from "../wizard-context";
import { PreviewHeader } from "./preview-header";
import { PreviewHero } from "./preview-hero";
import { PreviewServices } from "./preview-services";
import { PreviewCta } from "./preview-cta";
import { PreviewContact } from "./preview-contact";
import { PreviewFloatingCta } from "./preview-floating-cta";
import { getPaletteById, getPaletteStyleVars } from "@/lib/onboarding/palettes";

type DeviceMode = "desktop" | "mobile";

// Map font families to Google Fonts URLs
const GOOGLE_FONTS_MAP: Record<string, string> = {
  "Inter": "Inter:wght@400;500;600;700",
  "Poppins": "Poppins:wght@400;500;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  "Montserrat": "Montserrat:wght@400;500;600;700",
  "Lora": "Lora:wght@400;500;600;700",
  "Sora": "Sora:wght@400;500;600;700",
};

// Motion animation variants based on motionStyle
type MotionVariants = {
  container: Variants;
  item: Variants;
};

const getMotionVariants = (style: string): MotionVariants => {
  switch (style) {
    case "motion-fade":
      return {
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
        },
        item: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        },
      };
    case "motion-reveal":
      return {
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        },
        item: {
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        },
      };
    case "motion-parallax":
      return {
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        },
        item: {
          hidden: { opacity: 0, y: 20, scale: 0.98 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
        },
      };
    case "motion-vivid":
      return {
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        },
        item: {
          hidden: { opacity: 0, x: -10, scale: 0.95 },
          visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3, type: "spring", stiffness: 300 } },
        },
      };
    default:
      return {
        container: { hidden: {}, visible: {} },
        item: { hidden: {}, visible: {} },
      };
  }
};

export function LivePreviewPanel() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const { state } = useWizard();
  const { paletteId, customColors, floatingCtaEnabled, fontFamily, motionStyle, enabledSections } = state;

  const palette = paletteId ? getPaletteById(paletteId) : null;
  const { container: containerVariants, item: itemVariants } = getMotionVariants(motionStyle);

  // Load Google Font dynamically
  useEffect(() => {
    const fontName = fontFamily?.split(",")[0]?.trim() || "Inter";
    const fontUrl = GOOGLE_FONTS_MAP[fontName];

    if (!fontUrl) return;

    const linkId = `google-font-${fontName.replace(/\s+/g, "-")}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);

  const previewStyles = useMemo(() => {
    // Color vars — use custom colors when paletteId is "custom", otherwise use palette
    let colorVars: Record<string, string>;
    if (paletteId === "custom") {
      colorVars = {
        "--preview-bg": customColors.background,
        "--preview-text": customColors.text,
        "--preview-primary": customColors.primary,
        "--preview-accent": customColors.accent,
        "--preview-muted": `${customColors.text}99`,
      };
    } else if (palette) {
      colorVars = {
        "--preview-bg": palette.background,
        "--preview-text": palette.text,
        "--preview-primary": palette.primary,
        "--preview-accent": palette.accent,
        "--preview-muted": `${palette.text}99`,
      };
    } else {
      colorVars = {
        "--preview-bg": "#0B1020",
        "--preview-text": "#EAF0FF",
        "--preview-primary": "#3B82F6",
        "--preview-accent": "#22D3EE",
        "--preview-muted": "rgba(234, 240, 255, 0.6)",
      };
    }

    // Style vars derived from palette
    const styleVars = palette ? getPaletteStyleVars(palette) : {
      "--preview-radius": "12px",
      "--preview-spacing": "16px",
      "--preview-shadow": "none",
    };

    return { ...colorVars, ...styleVars } as React.CSSProperties;
  }, [palette, paletteId, customColors]);

  return (
    <div className="flex flex-col h-[600px]">
      {/* Device toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--platform-text)]/60">
          Preview ao vivo
        </span>
        <div className="flex rounded-lg border border-white/10 p-0.5">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
              deviceMode === "desktop"
                ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
            }`}
          >
            <Monitor size={12} />
            Desktop
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
              deviceMode === "mobile"
                ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
            }`}
          >
            <Smartphone size={12} />
            Mobile
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 rounded-xl border border-white/10 bg-[#1A2035] p-2 overflow-hidden">
        {/* Device chrome */}
        <div
          className={`h-full rounded-lg overflow-hidden transition-all duration-300 ${
            deviceMode === "mobile" ? "max-w-[280px] mx-auto" : ""
          }`}
        >
          {/* Browser bar (desktop only) */}
          {deviceMode === "desktop" && (
            <div className="flex items-center gap-2 bg-[#0B1020] px-3 py-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 rounded bg-white/5 px-2 py-0.5">
                <span className="text-[10px] text-[var(--platform-text)]/40 font-mono">
                  {state.preferredSubdomain || "seusite"}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
                </span>
              </div>
            </div>
          )}

          {/* Phone notch (mobile only) */}
          {deviceMode === "mobile" && (
            <div className="flex justify-center bg-[#0B1020] pt-1 pb-2">
              <div className="h-5 w-24 rounded-full bg-black" />
            </div>
          )}

          {/* Preview content — unified motion.div path (no-op variants for motion-none) */}
          <div
            style={previewStyles}
            className="h-[calc(100%-32px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
          >
            <motion.div
              className="min-h-full flex flex-col"
              style={{ backgroundColor: "var(--preview-bg)" }}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              key={motionStyle}
            >
              <motion.div variants={itemVariants}>
                <PreviewHeader deviceMode={deviceMode} />
              </motion.div>
              {enabledSections.includes("hero") && (
                <motion.div variants={itemVariants}>
                  <PreviewHero deviceMode={deviceMode} />
                </motion.div>
              )}
              {enabledSections.includes("services") && (
                <motion.div variants={itemVariants}>
                  <PreviewServices deviceMode={deviceMode} />
                </motion.div>
              )}
              {enabledSections.includes("cta") && (
                <motion.div variants={itemVariants}>
                  <PreviewCta deviceMode={deviceMode} />
                </motion.div>
              )}
              {enabledSections.includes("contact") && (
                <motion.div variants={itemVariants}>
                  <PreviewContact deviceMode={deviceMode} />
                </motion.div>
              )}
              <div className="flex-1" />
              {floatingCtaEnabled && <PreviewFloatingCta />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
