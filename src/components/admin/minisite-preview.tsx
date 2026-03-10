"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Section } from "@/lib/tenant/types";

export type SiteTheme = {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  logoUrl?: string;
  headerStyle?: string;
  buttonStyle?: string;
  fontFamily?: string;
  [key: string]: unknown;
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
  const primary  = themeSettings?.primaryColor    ?? "#3B82F6";
  const accent   = themeSettings?.accentColor     ?? "#22D3EE";
  const bg       = themeSettings?.backgroundColor ?? "#0B1020";
  const text     = themeSettings?.textColor       ?? "#EAF0FF";
  const font     = themeSettings?.fontFamily      ?? undefined;
  const btnStyle = themeSettings?.buttonStyle     ?? "rounded";
  const headerStyle = themeSettings?.headerStyle  ?? "blur";
  const btnRadius = btnStyle === "pill" ? "999px" : btnStyle === "square" ? "0px" : "8px";

  const headerBg =
    headerStyle === "solid"   ? bg :
    headerStyle === "minimal" ? "transparent" :
    "rgba(255,255,255,0.05)"; // blur: vidro fosco
  const headerBorder =
    headerStyle === "minimal" ? `1px solid ${text}35` : `1px solid ${text}15`;
  const headerBackdrop = headerStyle === "blur" ? "blur(8px)" : undefined;

  const siteColors = hasSiteTheme
    ? {
        "--preview-primary": primary,
        "--preview-accent": accent,
        "--preview-bg": bg,
        "--preview-text": text,
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

            {/* Wrapper com gradiente — revela diferença do header style */}
            <div style={{ background: `linear-gradient(180deg, ${primary}45 0%, ${bg} 28%)` }}>
              {/* Mini header — aplica headerStyle */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{
                  backgroundColor: headerBg,
                  borderBottom: headerBorder,
                  backdropFilter: headerBackdrop,
                  WebkitBackdropFilter: headerBackdrop,
                  fontFamily: font,
                }}
              >
                {themeSettings?.logoUrl ? (
                  <Image
                    src={themeSettings.logoUrl}
                    alt={siteName}
                    width={80}
                    height={24}
                    className="h-5 w-auto max-w-[80px] object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold" style={{ color: text }}>
                    {siteName}
                  </span>
                )}
                <span
                  className="px-2 py-0.5 text-[8px] font-semibold text-white"
                  style={{ backgroundColor: primary, borderRadius: btnRadius }}
                >
                  Menu
                </span>
              </div>

              <div
                className={`space-y-4 overflow-y-auto px-4 py-4 ${
                  isMobilePreview ? "max-h-[58vh]" : "h-[330px]"
                }`}
                style={{
                  backgroundColor: bg,
                  color: text,
                  fontFamily: font,
                }}
              >
              {orderedSections.map((section) => {
                const sectionContainerClassName =
                  activeSectionId === section.id
                    ? "ring-2 ring-[#22D3EE] ring-offset-2 ring-offset-[#0B1020]"
                    : "";

                const surfaceBorder = `${text}18`;

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
                        style={{ color: accent }}
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
                  const cards = Array.isArray(section.content.cards)
                    ? (section.content.cards as Array<{ title: string; description?: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
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
                          className="mt-2 aspect-[4/3] h-auto w-full rounded-lg object-cover"
                          style={{ border: `1px solid ${surfaceBorder}` }}
                        />
                      )}
                      {cards.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          {cards.slice(0, 4).map((card, i) => (
                            <div
                              key={i}
                              className="rounded-lg p-2"
                              style={{ border: `1px solid ${surfaceBorder}`, backgroundColor: `${primary}12` }}
                            >
                              <p className="text-[10px] font-semibold leading-tight opacity-90">{card.title || "Serviço"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {cards.length === 0 && (
                        <p className="mt-2 text-[10px] opacity-40">Nenhum serviço cadastrado</p>
                      )}
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
                          ? `linear-gradient(135deg, ${primary}, ${accent})`
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
                          style={{ backgroundColor: accent }}
                        >
                          {asString(section.content.whatsappLabel, "WhatsApp")}
                        </span>
                      )}
                    </section>
                  );
                }

                if (section.type === "testimonials") {
                  const items = Array.isArray(section.content.items)
                    ? (section.content.items as Array<{ quote: string; author: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">{asString(section.content.title, "Depoimentos")}</h3>
                      <div className="mt-2 space-y-2">
                        {items.slice(0, 2).map((item, i) => (
                          <div key={i} className="rounded-lg p-2" style={{ border: `1px solid ${surfaceBorder}` }}>
                            <p className="text-[10px] opacity-80 line-clamp-2">"{item.quote}"</p>
                            <p className="mt-1 text-[9px] font-semibold opacity-50">— {item.author}</p>
                          </div>
                        ))}
                        {items.length === 0 && <p className="text-[10px] opacity-40">Nenhum depoimento cadastrado</p>}
                      </div>
                    </section>
                  );
                }

                if (section.type === "faq") {
                  const items = Array.isArray(section.content.items)
                    ? (section.content.items as Array<{ question: string; answer: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">{asString(section.content.title, "Perguntas Frequentes")}</h3>
                      <div className="mt-2 space-y-1.5">
                        {items.slice(0, 3).map((item, i) => (
                          <div key={i} className="rounded-lg px-2.5 py-1.5" style={{ border: `1px solid ${surfaceBorder}` }}>
                            <p className="text-[10px] font-medium opacity-85">{item.question}</p>
                          </div>
                        ))}
                        {items.length === 0 && <p className="text-[10px] opacity-40">Nenhuma pergunta cadastrada</p>}
                      </div>
                    </section>
                  );
                }

                if (section.type === "blog") {
                  const posts = Array.isArray(section.content.posts)
                    ? (section.content.posts as Array<{ title: string; excerpt?: string; imageUrl?: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">{asString(section.content.title, "Blog")}</h3>
                      <div className="mt-2 space-y-1.5">
                        {posts.slice(0, 2).map((post, i) => (
                          <div key={i} className="flex gap-2 rounded-lg p-2" style={{ border: `1px solid ${surfaceBorder}` }}>
                            {post.imageUrl && (
                              <Image src={post.imageUrl} alt={post.title} width={40} height={30}
                                className="h-7 w-10 shrink-0 rounded object-cover" />
                            )}
                            <p className="text-[10px] font-medium opacity-85 line-clamp-2">{post.title || "Artigo"}</p>
                          </div>
                        ))}
                        {posts.length === 0 && <p className="text-[10px] opacity-40">Nenhum artigo cadastrado</p>}
                      </div>
                    </section>
                  );
                }

                if (section.type === "gallery") {
                  const images = Array.isArray(section.content.images)
                    ? (section.content.images as Array<{ url: string; alt: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">{asString(section.content.title, "Galeria")}</h3>
                      <div className="mt-2 grid grid-cols-3 gap-1">
                        {images.slice(0, 6).map((img, i) => (
                          img.url
                            ? <Image key={i} src={img.url} alt={img.alt} width={80} height={60}
                                className="aspect-square h-full w-full rounded object-cover" />
                            : <div key={i} className="aspect-square rounded" style={{ backgroundColor: `${primary}20` }} />
                        ))}
                        {images.length === 0 && (
                          <div className="col-span-3 py-2 text-center text-[10px] opacity-40">Nenhuma imagem cadastrada</div>
                        )}
                      </div>
                    </section>
                  );
                }

                if (section.type === "events") {
                  const events = Array.isArray(section.content.events)
                    ? (section.content.events as Array<{ title: string; date: string }>)
                    : [];
                  return (
                    <section
                      key={section.id}
                      ref={(element) => { sectionRefs.current[section.id] = element; }}
                      className={`rounded-xl p-4 ${sectionContainerClassName}`}
                      style={{ border: `1px solid ${surfaceBorder}` }}
                    >
                      <h3 className="text-sm font-semibold">{asString(section.content.title, "Agenda")}</h3>
                      <div className="mt-2 space-y-1.5">
                        {events.slice(0, 3).map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ border: `1px solid ${surfaceBorder}` }}>
                            <div className="shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold text-white"
                              style={{ backgroundColor: primary }}>
                              {ev.date ? new Date(ev.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "—"}
                            </div>
                            <p className="text-[10px] opacity-80 truncate">{ev.title}</p>
                          </div>
                        ))}
                        {events.length === 0 && <p className="text-[10px] opacity-40">Nenhum evento cadastrado</p>}
                      </div>
                    </section>
                  );
                }

                return (
                  <section
                    key={section.id}
                    ref={(element) => { sectionRefs.current[section.id] = element; }}
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
                borderTop: `1px solid ${text}15`,
                color: text,
                backgroundColor: bg,
                fontFamily: font,
              }}
            >
              <span>{siteName}</span>
              <span>Powered by BuildSphere</span>
            </div>
            </div>{/* fecha wrapper gradiente */}
          </div>

          {!isMobilePreview ? (
            <div className="mx-auto mt-2 h-2 w-[220px] rounded-full bg-white/10" />
          ) : null}
        </div>
      </div>
    </aside>
  );
}
