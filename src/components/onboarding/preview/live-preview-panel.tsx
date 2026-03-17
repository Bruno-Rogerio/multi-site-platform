"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useWizard } from "../wizard-context";
import { SectionRenderer } from "@/components/site/section-renderer";
import { buildSiteStyles, buttonStyleClasses } from "@/components/site/site-shell";
import { getPaletteById, getSiteStyleVars, getContrastTextColor } from "@/lib/onboarding/palettes";
import { wizardToPreviewSite, wizardToPreviewSections } from "./wizard-to-preview-site";
import Image from "next/image";

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

export function LivePreviewPanel() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const { state } = useWizard();
  const { paletteId, customColors, floatingCtaEnabled, fontFamily } = state;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width reactively
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  // Build preview site + sections from wizard state
  const previewSite = useMemo(() => wizardToPreviewSite(state), [state]);
  const previewSections = useMemo(() => wizardToPreviewSections(state), [state]);
  const btnClass = buttonStyleClasses[state.buttonStyle ?? "rounded"];
  const siteStyles = useMemo(
    () => buildSiteStyles(previewSite.themeSettings),
    [previewSite.themeSettings]
  );

  const palette = paletteId ? getPaletteById(paletteId) : null;

  // --preview-* aliases so PreviewHeader still works unchanged
  const previewAliases = useMemo(() => {
    let primaryHex: string;
    let bgHex: string;
    let textHex: string;
    let accentHex: string;
    if (paletteId === "custom") {
      primaryHex = customColors.primary;
      bgHex = customColors.background;
      textHex = customColors.text;
      accentHex = customColors.accent;
    } else if (palette) {
      primaryHex = palette.primary;
      bgHex = palette.background;
      textHex = palette.text;
      accentHex = palette.accent;
    } else {
      primaryHex = "#3B82F6";
      bgHex = "#0B1020";
      textHex = "#EAF0FF";
      accentHex = "#22D3EE";
    }
    return {
      "--preview-bg": bgHex,
      "--preview-text": textHex,
      "--preview-primary": primaryHex,
      "--preview-accent": accentHex,
      "--preview-muted": `${textHex}99`,
      "--preview-button-text": getContrastTextColor(primaryHex),
    };
  }, [palette, paletteId, customColors]);

  const isMobile = deviceMode === "mobile";

  // Virtual widths — same as MiniSitePreview in admin
  const VIRTUAL_WIDTH = isMobile ? 390 : 1280;
  const PREVIEW_HEIGHT = 520;

  const targetDisplayWidth = isMobile
    ? Math.min(containerWidth * 0.78, 360)
    : containerWidth;
  const scale = targetDisplayWidth > 0 ? targetDisplayWidth / VIRTUAL_WIDTH : 0;
  const innerHeight = scale > 0 ? Math.round(PREVIEW_HEIGHT / scale) : 9999;

  const theme = previewSite.themeSettings;

  return (
    <div className="flex flex-col gap-3">
      {/* Device toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--platform-text)]/60">
          Preview ao vivo
        </span>
        <div className="inline-flex rounded-md border border-white/15 bg-[#0B1020] p-0.5">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
              deviceMode === "desktop"
                ? "bg-[#3B82F6] text-white"
                : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"
            }`}
          >
            <Monitor size={11} className="inline mr-1 -mt-0.5" />
            Desktop
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
              deviceMode === "mobile"
                ? "bg-[#3B82F6] text-white"
                : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"
            }`}
          >
            <Smartphone size={11} className="inline mr-1 -mt-0.5" />
            Mobile
          </button>
        </div>
      </div>

      {/* Mobile CSS overrides — simulates responsive breakpoints at 390px virtual width */}
      {isMobile && (
        <style>{`
          .preview-mobile section { min-height: 0 !important; }
          .preview-mobile [class*="md:grid-cols-"] { grid-template-columns: 1fr !important; }
          .preview-mobile [class*="sm:grid-cols-"] { grid-template-columns: 1fr !important; }
          .preview-mobile [class*="lg:grid-cols-"] { grid-template-columns: 1fr !important; }
          .preview-mobile [class*="md:flex-row"] { flex-direction: column !important; }
          .preview-mobile [class*="sm:flex-row"] { flex-direction: column !important; }
          .preview-mobile [class*="md:py-28"] { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .preview-mobile [class*="md:py-24"] { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .preview-mobile [class*="md:py-20"] { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .preview-mobile [class*="md:py-16"] { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .preview-mobile [class*="md:p-12"] { padding: 1.5rem !important; }
          .preview-mobile [class*="md:p-8"] { padding: 1rem !important; }
          .preview-mobile [class*="md:text-7xl"] { font-size: 2.5rem !important; line-height: 1.1 !important; }
          .preview-mobile [class*="md:text-6xl"] { font-size: 2.5rem !important; line-height: 1.15 !important; }
          .preview-mobile [class*="md:text-5xl"] { font-size: 2rem !important; line-height: 1.2 !important; }
          .preview-mobile [class*="md:text-3xl"] { font-size: 1.5rem !important; }
          .preview-mobile [class*="md:items-center"] { align-items: flex-start !important; }
          .preview-mobile [class*="md:grid-cols-2"] { grid-template-columns: 1fr !important; }
          .preview-mobile [class*="lg:text-7xl"] { font-size: 2.5rem !important; line-height: 1.1 !important; }
          .preview-mobile [class*="lg:text-6xl"] { font-size: 2.2rem !important; line-height: 1.15 !important; }
        `}</style>
      )}

      {/* Preview frame */}
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-xl border border-white/10 ${
          isMobile ? "flex items-start justify-center bg-[#070D1A] py-3" : ""
        }`}
        style={{ height: PREVIEW_HEIGHT }}
      >
        {scale > 0 && (
          <div
            style={{
              zoom: scale,
              width: VIRTUAL_WIDTH,
              height: innerHeight,
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.backgroundColor,
              ...(isMobile && {
                borderRadius: "44px",
                border: "10px solid #111827",
                boxShadow: "0 0 0 2px #1f2937, 0 12px 40px rgba(0,0,0,0.7)",
                overflow: "hidden",
              }),
            }}
          >
            {/* Browser bar (desktop) */}
            {!isMobile && (
              <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#0A1122] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                <div className="ml-2 h-5 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-2 text-[10px] leading-5 text-white/50 font-mono truncate">
                  {state.preferredSubdomain || "seusite"}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
                </div>
              </div>
            )}

            {/* Phone notch (mobile) */}
            {isMobile && (
              <div className="flex shrink-0 justify-center bg-black pt-2 pb-3">
                <div className="h-4 w-20 rounded-full bg-black border border-white/10" />
              </div>
            )}

            {/* Mini header */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-2.5"
              style={{
                backgroundColor:
                  (theme.headerStyle ?? "blur") === "solid"
                    ? theme.primaryColor
                    : (theme.headerStyle ?? "blur") === "minimal"
                    ? "transparent"
                    : `${theme.backgroundColor}cc`,
                borderBottom: `1px solid var(--site-border, rgba(234,240,255,0.16))`,
                backdropFilter:
                  (theme.headerStyle ?? "blur") === "blur"
                    ? "blur(8px)"
                    : undefined,
                fontFamily: theme.fontFamily,
                ...siteStyles,
                ...previewAliases,
              }}
            >
              {theme.logoUrl ? (
                <Image
                  src={theme.logoUrl}
                  alt={state.businessName}
                  width={32}
                  height={32}
                  className="h-8 w-auto max-w-[120px] object-contain rounded"
                />
              ) : (
                <div>
                  <span
                    className="text-sm font-bold truncate block leading-tight"
                    style={{
                      color:
                        (theme.headerStyle ?? "blur") === "solid"
                          ? (siteStyles["--site-button-text" as keyof typeof siteStyles] as string ?? "#fff")
                          : theme.primaryColor,
                    }}
                  >
                    {state.businessName || "Seu Negócio"}
                  </span>
                  {!!state.content.slogan && (
                    <span
                      className="text-xs block leading-tight opacity-60"
                      style={{ color: theme.textColor }}
                    >
                      {String(state.content.slogan)}
                    </span>
                  )}
                </div>
              )}
              <span
                className="shrink-0 px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: theme.primaryColor,
                  color:
                    siteStyles["--site-button-text" as keyof typeof siteStyles] as string ?? "#fff",
                  borderRadius: btnClass.includes("full")
                    ? "9999px"
                    : btnClass.includes("none")
                    ? "0"
                    : "6px",
                }}
              >
                Menu
              </span>
            </div>

            {/* Sections */}
            <div
              className={`${isMobile ? "preview-mobile" : ""} overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 flex-1`}
              style={{ ...siteStyles, ...previewAliases }}
            >
              {previewSections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  site={previewSite}
                  buttonStyleClassName={btnClass}
                  maxEventsPreview={3}
                />
              ))}
            </div>

            {/* Mini footer */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-2 text-xs opacity-50"
              style={{
                color: theme.textColor,
                borderTop: `1px solid var(--site-border, rgba(234,240,255,0.16))`,
                fontFamily: theme.fontFamily,
                ...siteStyles,
              }}
            >
              <span>{state.businessName || "Meu Site"}</span>
              <span>BuildSphere</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
