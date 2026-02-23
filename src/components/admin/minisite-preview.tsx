"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Section } from "@/lib/tenant/types";

type SiteTheme = {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
} | null;

type MiniSitePreviewProps = {
  siteName: string;
  siteDomain: string;
  sections: Section[];
  hasUnsavedChanges: boolean;
  activeSectionId: string | null;
  themeSettings?: SiteTheme;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function MiniSitePreview({
  siteName,
  siteDomain,
  sections,
  hasUnsavedChanges,
  activeSectionId,
  themeSettings,
}: MiniSitePreviewProps) {
  const hasSiteTheme = themeSettings?.primaryColor;
  const siteColors = hasSiteTheme
    ? {
        "--preview-primary": themeSettings.primaryColor,
        "--preview-accent": themeSettings.accentColor ?? themeSettings.primaryColor,
        "--preview-bg": themeSettings.backgroundColor ?? "#0B1020",
        "--preview-text": themeSettings.textColor ?? "#EAF0FF",
      }
    : {};
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);
  const isMobilePreview = previewViewport === "mobile";

  useEffect(() => {
    if (!activeSectionId) {
      return;
    }
    sectionRefs.current[activeSectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeSectionId]);

  return (
    <aside className="sticky top-4 rounded-2xl border border-white/10 bg-[#12182B] p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
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

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1020]">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-sm font-semibold text-[var(--platform-text)]">{siteName}</p>
          <p className="text-xs text-[var(--platform-text)]/60">Mini-site em tempo real (pre-save)</p>
        </div>

        <div className="p-4">
          <div
            style={siteColors as React.CSSProperties}
            className={`mx-auto overflow-hidden border transition-all ${
              isMobilePreview
                ? "max-w-[310px] rounded-[2rem] border-white/15"
                : "w-full rounded-2xl border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            }`}
          >
            {isMobilePreview ? (
              <div className="px-4 pt-3">
                <div className="mx-auto h-1.5 w-20 rounded-full bg-white/25" />
              </div>
            ) : (
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#0A1122] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                <div className="ml-2 h-5 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-2 text-[10px] leading-5 text-[var(--platform-text)]/50">
                  {siteDomain}
                </div>
              </div>
            )}

            {/* Mini header */}
            <div
              className="flex items-center justify-between border-b px-3 py-2"
              style={{
                backgroundColor: hasSiteTheme ? `${themeSettings.backgroundColor}ee` : "#0B1020ee",
                borderColor: hasSiteTheme ? `${themeSettings.textColor}18` : "rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: hasSiteTheme ? themeSettings.textColor : undefined }}
              >
                {siteName}
              </span>
              <span
                className="rounded px-2 py-0.5 text-[8px] font-semibold text-white"
                style={{ backgroundColor: hasSiteTheme ? themeSettings.primaryColor : "#3B82F6" }}
              >
                CTA
              </span>
            </div>

            <div
              className={`space-y-4 overflow-y-auto px-4 py-4 ${
                isMobilePreview ? "max-h-[58vh]" : "h-[330px]"
              }`}
              style={{
                backgroundColor: hasSiteTheme ? themeSettings.backgroundColor : "#0D1428",
                color: hasSiteTheme ? themeSettings.textColor : undefined,
              }}
            >
              {orderedSections.map((section) => {
                const sectionContainerClassName =
                  activeSectionId === section.id
                    ? "ring-2 ring-[#22D3EE] ring-offset-2 ring-offset-[#0B1020]"
                    : "";

                const surfaceBorder = hasSiteTheme
                  ? `${themeSettings.textColor}18`
                  : "rgba(255,255,255,0.1)";

                if (section.type === "hero") {
                  return (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.id] = element;
                      }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: hasSiteTheme ? themeSettings.accentColor : "#22D3EE" }}
                      >
                        {asString(section.content.eyebrow)}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">
                        {asString(section.content.title, siteName)}
                      </h3>
                      <p className="mt-2 text-xs opacity-75">
                        {asString(section.content.subtitle)}
                      </p>
                      {asString(section.content.imageUrl) && (
                        <Image
                          src={asString(section.content.imageUrl)}
                          alt={asString(section.content.title, siteName)}
                          width={1280}
                          height={720}
                          className="mt-3 aspect-[16/9] h-auto w-full rounded-lg object-cover"
                          style={{ border: `1px solid ${surfaceBorder}` }}
                        />
                      )}
                    </section>
                  );
                }

                if (section.type === "services") {
                  const items = asStringArray(section.content.items);
                  return (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.id] = element;
                      }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(section.content.title, "Serviços")}
                      </h3>
                      {asString(section.content.imageUrl) && (
                        <Image
                          src={asString(section.content.imageUrl)}
                          alt={asString(section.content.title, "Serviços")}
                          width={960}
                          height={720}
                          className="mt-3 aspect-[4/3] h-auto w-full rounded-lg object-cover"
                          style={{ border: `1px solid ${surfaceBorder}` }}
                        />
                      )}
                      <ul className="mt-2 space-y-1">
                        {items.map((item) => (
                          <li key={item} className="text-xs opacity-80">
                            - {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                }

                if (section.type === "cta") {
                  return (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.id] = element;
                      }}
                      className={`rounded-xl p-4 text-white ${sectionContainerClassName}`}
                      style={{
                        background: hasSiteTheme
                          ? `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.accentColor})`
                          : "linear-gradient(135deg, #3B82F6, #7C5CFF, #22D3EE)",
                      }}
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(section.content.title, "Vamos conversar?")}
                      </h3>
                      <p className="mt-2 text-xs text-white/90">
                        {asString(section.content.description)}
                      </p>
                      {asString(section.content.imageUrl) && (
                        <Image
                          src={asString(section.content.imageUrl)}
                          alt={asString(section.content.title, "CTA")}
                          width={1280}
                          height={720}
                          className="mt-3 aspect-[16/9] h-auto w-full rounded-lg border border-white/35 object-cover"
                        />
                      )}
                      <span className="mt-3 inline-block rounded-lg border border-white/35 px-3 py-1 text-xs font-semibold">
                        {asString(section.content.buttonLabel, "Entrar em contato")}
                      </span>
                    </section>
                  );
                }

                if (section.type === "about") {
                  return (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.id] = element;
                      }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(section.content.title, "Sobre")}
                      </h3>
                      <p className="mt-2 text-xs opacity-80 line-clamp-3">
                        {asString(section.content.body)}
                      </p>
                    </section>
                  );
                }

                if (section.type === "contact") {
                  return (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.id] = element;
                      }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(section.content.title, "Contato")}
                      </h3>
                      <p className="mt-1 text-xs opacity-70">
                        {asString(section.content.subtitle)}
                      </p>
                      {asString(section.content.whatsappUrl) && (
                        <span
                          className="mt-2 inline-block rounded px-2 py-0.5 text-[9px] font-semibold text-white"
                          style={{ backgroundColor: hasSiteTheme ? themeSettings.accentColor : "#22D3EE" }}
                        >
                          {asString(section.content.whatsappLabel, "WhatsApp")}
                        </span>
                      )}
                    </section>
                  );
                }

                return (
                  <section
                    key={section.id}
                    ref={(element) => {
                      sectionRefs.current[section.id] = element;
                    }}
                    className={`rounded-xl p-4 ${sectionContainerClassName}`}
                    style={{ border: `1px solid ${surfaceBorder}` }}
                  >
                    <p className="text-xs opacity-80">Seção {section.type}</p>
                  </section>
                );
              })}
            </div>

            {/* Mini footer */}
            <div
              className="flex items-center justify-between px-3 py-2 text-[8px] opacity-60"
              style={{
                borderTop: `1px solid ${hasSiteTheme ? `${themeSettings.textColor}18` : "rgba(255,255,255,0.1)"}`,
                color: hasSiteTheme ? themeSettings.textColor : undefined,
              }}
            >
              <span>{siteName}</span>
              <span>Powered by BuildSphere</span>
            </div>
          </div>

          {!isMobilePreview ? (
            <div className="mx-auto mt-2 h-2 w-[220px] rounded-full bg-white/10" />
          ) : null}
        </div>
      </div>
    </aside>
  );
}
