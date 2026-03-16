"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Section, Site, ThemeSettings } from "@/lib/tenant/types";
import { defaultThemeSettings } from "@/lib/tenant/types";
import { SectionRenderer } from "@/components/site/section-renderer";
import { buttonStyleClasses, buildSiteStyles } from "@/components/site/site-shell";

type MiniSitePreviewProps = {
  siteName: string;
  siteDomain: string;
  sections: Section[];
  hasUnsavedChanges: boolean;
  activeSectionId: string | null;
  themeSettings?: Record<string, unknown> | null;
};

function buildTheme(raw: Record<string, unknown> | null | undefined): ThemeSettings {
  const d = defaultThemeSettings;
  return {
    primaryColor:   (raw?.primaryColor   as string) || d.primaryColor,
    accentColor:    (raw?.accentColor    as string) || d.accentColor,
    backgroundColor:(raw?.backgroundColor as string) || d.backgroundColor,
    textColor:      (raw?.textColor      as string) || d.textColor,
    fontFamily:     (raw?.fontFamily     as string) || d.fontFamily,
    buttonStyle:    ((raw?.buttonStyle   as ThemeSettings["buttonStyle"]) || d.buttonStyle),
    logoUrl:        (raw?.logoUrl        as string) || undefined,
    headerStyle:    (raw?.headerStyle    as ThemeSettings["headerStyle"]) || "blur",
    dividerStyle:   (raw?.dividerStyle   as ThemeSettings["dividerStyle"]) || undefined,
    motionStyle:    (raw?.motionStyle    as string) || undefined,
    footerText:     (raw?.footerText     as string) || undefined,
    "--site-radius":  (raw?.["--site-radius"]  as string) || undefined,
    "--site-spacing": (raw?.["--site-spacing"] as string) || undefined,
    "--site-shadow":  (raw?.["--site-shadow"]  as string) || undefined,
  };
}

export function MiniSitePreview({
  siteName,
  siteDomain,
  sections,
  hasUnsavedChanges,
  activeSectionId,
  themeSettings,
}: MiniSitePreviewProps) {
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);
  const isMobilePreview = previewViewport === "mobile";

  // Virtual widths: desktop renders as 1280px page, mobile as 390px (iPhone)
  const VIRTUAL_WIDTH = isMobilePreview ? 390 : 1280;
  const PREVIEW_HEIGHT = 540; // visible height in px

  const scale = containerWidth > 0 ? containerWidth / VIRTUAL_WIDTH : 0;
  const innerHeight = scale > 0 ? Math.round(PREVIEW_HEIGHT / scale) : 9999;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const theme = buildTheme(themeSettings);
  const btnClass = buttonStyleClasses[theme.buttonStyle] ?? buttonStyleClasses.rounded;
  const siteStyles = buildSiteStyles(theme);

  const mockSite: Site = {
    id: "preview",
    name: siteName,
    domain: siteDomain,
    plan: "landing",
    themeSettings: theme,
    homePage: {
      id: "preview-page",
      siteId: "preview",
      slug: "home",
      title: siteName,
      sections: orderedSections,
    },
  };

  useEffect(() => {
    if (!activeSectionId) return;
    sectionRefs.current[activeSectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeSectionId]);

  return (
    <aside className="sticky top-4 rounded-2xl border border-white/10 bg-[#12182B] p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      {/* Topbar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview</p>
          <p className="text-sm font-semibold text-[var(--platform-text)]">{siteName}</p>
          <p className="text-xs text-[var(--platform-text)]/60">{siteDomain}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="inline-flex rounded-md border border-white/15 bg-[#0B1020] p-0.5">
            <button
              type="button"
              onClick={() => setPreviewViewport("desktop")}
              className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                previewViewport === "desktop"
                  ? "bg-[#3B82F6] text-white"
                  : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport("mobile")}
              className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                previewViewport === "mobile"
                  ? "bg-[#3B82F6] text-white"
                  : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"
              }`}
            >
              Mobile
            </button>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              hasUnsavedChanges
                ? "border border-amber-300/40 bg-amber-500/10 text-amber-200"
                : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {hasUnsavedChanges ? "Não salvo" : "Sincronizado"}
          </span>
        </div>
      </div>

      {/* Device chrome + site — proportionally scaled */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border border-white/10"
        style={{ height: PREVIEW_HEIGHT }}
      >
        {scale > 0 && (
          <div
            style={{
              zoom: scale,
              width: VIRTUAL_WIDTH,
              backgroundColor: theme.backgroundColor,
            }}
          >
            {/* Browser bar (desktop) */}
            {!isMobilePreview && (
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#0A1122] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                <div className="ml-2 h-5 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-2 text-[10px] leading-5 text-[var(--platform-text)]/50 font-mono truncate">
                  {siteDomain}
                </div>
              </div>
            )}

            {/* Phone notch (mobile) */}
            {isMobilePreview && (
              <div className="flex justify-center bg-black pt-2 pb-3">
                <div className="h-4 w-20 rounded-full bg-black border border-white/10" />
              </div>
            )}

            {/* Mini header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 sticky top-0 z-10"
              style={{
                backgroundColor:
                  (theme.headerStyle ?? "blur") === "solid"
                    ? theme.backgroundColor
                    : (theme.headerStyle ?? "blur") === "minimal"
                    ? "transparent"
                    : `${theme.backgroundColor}cc`,
                borderBottom: `1px solid var(--site-border, rgba(234,240,255,0.16))`,
                backdropFilter: (theme.headerStyle ?? "blur") === "blur" ? "blur(8px)" : undefined,
                fontFamily: theme.fontFamily,
                ...siteStyles,
              }}
            >
              {theme.logoUrl ? (
                <Image
                  src={theme.logoUrl}
                  alt={siteName}
                  width={32}
                  height={32}
                  className="h-8 w-auto max-w-[100px] object-contain rounded"
                />
              ) : (
                <span className="text-xs font-bold truncate" style={{ color: theme.textColor }}>
                  {siteName}
                </span>
              )}
              <span
                className="shrink-0 px-2.5 py-1 text-[10px] font-semibold"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: siteStyles["--site-button-text" as keyof typeof siteStyles] as string || "#fff",
                  borderRadius: btnClass.includes("full") ? "9999px" : btnClass.includes("none") ? "0" : "6px",
                }}
              >
                Menu
              </span>
            </div>

            {/* Sections — real SectionRenderer */}
            <div
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
              style={{ ...siteStyles, maxHeight: innerHeight }}
            >
              {orderedSections.length === 0 ? (
                <div className="py-12 text-center" style={{ color: theme.textColor, opacity: 0.4 }}>
                  <p className="text-sm">Nenhuma seção cadastrada</p>
                </div>
              ) : (
                orderedSections.map((section) => (
                  <div
                    key={section.id}
                    ref={(el) => { sectionRefs.current[section.id] = el; }}
                    className={`transition ${
                      activeSectionId === section.id
                        ? "outline outline-2 outline-[#22D3EE] outline-offset-[-2px]"
                        : ""
                    }`}
                  >
                    <SectionRenderer
                      section={section}
                      site={mockSite}
                      buttonStyleClassName={btnClass}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Mini footer */}
            <div
              className="flex items-center justify-between px-4 py-2 text-[10px] opacity-50"
              style={{ color: theme.textColor, borderTop: `1px solid var(--site-border, rgba(234,240,255,0.16))`, fontFamily: theme.fontFamily }}
            >
              <span>{siteName}</span>
              <span>Powered by BuildSphere</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
