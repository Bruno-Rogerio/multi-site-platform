"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Lock, Sparkles, Monitor, Smartphone } from "lucide-react";

import {
  palettePresets,
  spacingMap,
  shadowMap,
  type PalettePreset,
} from "@/lib/onboarding/palettes";
import { UpgradeModal } from "@/components/admin/upgrade-modal";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
};

type ThemeSettings = Record<string, unknown>;

type SiteBrandingEditorProps = {
  sites: SiteOption[];
  defaultSiteId: string | null;
  /** "basico" = locked view. "construir" | "premium-full" = full editor. */
  plan?: string;
};

type Status =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const FONT_OPTIONS = [
  { value: "Inter, system-ui, sans-serif", label: "Inter" },
  { value: "Sora, system-ui, sans-serif", label: "Sora" },
  { value: "Poppins, system-ui, sans-serif", label: "Poppins" },
  { value: "Montserrat, system-ui, sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "Roboto, system-ui, sans-serif", label: "Roboto" },
  { value: "'DM Sans', system-ui, sans-serif", label: "DM Sans" },
];

const BUTTON_STYLES = [
  { value: "rounded", label: "Arredondado", preview: "rounded-lg" },
  { value: "pill", label: "Pílula", preview: "rounded-full" },
  { value: "square", label: "Quadrado", preview: "rounded-none" },
] as const;

const HEADER_STYLES = [
  { value: "blur", label: "Vidro (blur)", desc: "Fundo desfocado com transparência" },
  { value: "solid", label: "Sólido", desc: "Cor de fundo opaca" },
  { value: "minimal", label: "Minimalista", desc: "Linha fina, quase invisível" },
] as const;

const DIVIDER_STYLES = [
  { value: "wave", label: "Onda" },
  { value: "diagonal", label: "Diagonal" },
  { value: "curve", label: "Curva" },
  { value: "line", label: "Linha" },
  { value: "none", label: "Nenhum" },
] as const;

/** Colorful palette previews shown blurred behind the lock overlay */
const PREVIEW_PALETTES = [
  { p: "#3B82F6", a: "#22D3EE", b: "#0f172a", t: "#f8fafc" },
  { p: "#7C5CFF", a: "#F472B6", b: "#1a0f2e", t: "#f8f5ff" },
  { p: "#10B981", a: "#06B6D4", b: "#052e16", t: "#ecfdf5" },
  { p: "#F59E0B", a: "#EF4444", b: "#1c1917", t: "#fffbeb" },
  { p: "#EC4899", a: "#8B5CF6", b: "#1e1b2e", t: "#fdf2f8" },
  { p: "#14B8A6", a: "#3B82F6", b: "#042f2e", t: "#f0fdfa" },
];

function applyPalette(
  current: ThemeSettings,
  palette: PalettePreset,
): ThemeSettings {
  return {
    ...current,
    primaryColor: palette.primary,
    accentColor: palette.accent,
    backgroundColor: palette.background,
    textColor: palette.text,
    "--site-radius": palette.borderRadius,
    "--site-spacing": spacingMap[palette.spacing],
    "--site-shadow": shadowMap[palette.shadowIntensity],
  };
}

/* ── Appearance Mini Preview ─────────────────────────────────────────────── */

type AppearancePreviewProps = {
  siteName: string;
  siteDomain: string;
  theme: ThemeSettings;
};

function AppearancePreview({ siteName, siteDomain, theme }: AppearancePreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const primary    = (theme.primaryColor   as string | undefined) || "#3B82F6";
  const accent     = (theme.accentColor    as string | undefined) || "#22D3EE";
  const bg         = (theme.backgroundColor as string | undefined) || "#0B1020";
  const text       = (theme.textColor      as string | undefined) || "#EAF0FF";
  const font       = (theme.fontFamily     as string | undefined) || "system-ui, sans-serif";
  const btnStyle   = (theme.buttonStyle    as string | undefined) || "rounded";
  const headerStyle = (theme.headerStyle   as string | undefined) || "blur";
  const logoUrl    = (theme.logoUrl        as string | undefined) || "";

  const btnRadius = btnStyle === "pill" ? "999px" : btnStyle === "square" ? "0px" : "8px";

  const headerBg =
    headerStyle === "solid"   ? bg :
    headerStyle === "minimal" ? "transparent" :
    `${bg}cc`; // blur sim

  const headerBorder =
    headerStyle === "minimal" ? `1px solid ${text}22` :
    `1px solid ${text}12`;

  const isMobile = viewport === "mobile";

  return (
    <aside className="sticky top-4 rounded-2xl border border-white/10 bg-[#12182B] p-4 shadow-[0_0_20px_rgba(124,92,255,0.15)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview</p>
          <p className="text-sm font-semibold text-[var(--platform-text)]">{siteName}</p>
          <p className="text-xs text-[var(--platform-text)]/60">{siteDomain}</p>
        </div>
        <div className="inline-flex rounded-md border border-white/15 bg-[#0B1020] p-0.5">
          <button type="button" onClick={() => setViewport("desktop")}
            className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${viewport === "desktop" ? "bg-[#3B82F6] text-white" : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"}`}>
            <Monitor size={12} />
          </button>
          <button type="button" onClick={() => setViewport("mobile")}
            className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${viewport === "mobile" ? "bg-[#3B82F6] text-white" : "text-[var(--platform-text)]/65 hover:text-[var(--platform-text)]"}`}>
            <Smartphone size={12} />
          </button>
        </div>
      </div>

      {/* Browser frame */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1020]">
        {/* Chrome */}
        {isMobile ? (
          <div className="px-4 pt-3"><div className="mx-auto h-1.5 w-20 rounded-full bg-white/25" /></div>
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

        {/* Site content */}
        <div
          className={`mx-auto overflow-hidden transition-all ${isMobile ? "max-w-[240px]" : "w-full"}`}
          style={{ backgroundColor: bg, fontFamily: font, color: text }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: headerBg, borderBottom: headerBorder }}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={80} height={24} className="h-5 w-auto max-w-[80px] object-contain" />
            ) : (
              <span className="text-[11px] font-bold" style={{ color: text }}>{siteName}</span>
            )}
            <span className="px-2.5 py-1 text-[9px] font-bold text-white" style={{ background: primary, borderRadius: btnRadius }}>
              Contato
            </span>
          </div>

          {/* Hero */}
          <div className="px-4 py-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
              Profissional
            </p>
            <h2 className="mt-1.5 text-base font-black leading-tight" style={{ color: text }}>
              {siteName}
            </h2>
            <p className="mt-1.5 text-[10px] leading-relaxed" style={{ color: `${text}99` }}>
              Bem-vindo ao meu site profissional. Aqui você encontra tudo sobre meus serviços.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-3 py-1.5 text-[10px] font-bold text-white" style={{ background: primary, borderRadius: btnRadius }}>
                Saiba mais
              </span>
              <span className="border px-3 py-1.5 text-[10px] font-semibold" style={{ borderColor: `${text}30`, color: text, borderRadius: btnRadius }}>
                Ver serviços
              </span>
            </div>
          </div>

          {/* Services strip */}
          <div className="px-4 pb-5">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: `${text}60` }}>
              Serviços
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {["Serviço 1", "Serviço 2", "Serviço 3"].map((s) => (
                <div key={s} className="rounded-lg p-2 text-center" style={{ background: `${primary}18`, border: `1px solid ${primary}25` }}>
                  <div className="mx-auto mb-1 h-4 w-4 rounded-full" style={{ background: `${accent}40` }} />
                  <p className="text-[8px] font-semibold leading-tight" style={{ color: text }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA strip */}
          <div className="px-4 pb-4">
            <div className="rounded-lg p-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
              <p className="text-[10px] font-bold text-white">Vamos conversar?</p>
              <span className="mt-1.5 inline-block border border-white/40 px-3 py-1 text-[8px] font-bold text-white" style={{ borderRadius: btnRadius }}>
                Entrar em contato
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SiteBrandingEditor({
  sites,
  defaultSiteId,
  plan = "basico",
}: SiteBrandingEditorProps) {
  const isFullEditor = plan !== "basico";

  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const effectiveSiteId = selectedSiteId || defaultSiteId || sites[0]?.id || "";

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === effectiveSiteId) ?? null,
    [sites, effectiveSiteId],
  );
  void selectedSite;

  useEffect(() => {
    if (!effectiveSiteId || !isFullEditor) return;

    const loadTheme = async () => {
      setIsLoading(true);
      setStatus(null);
      const res = await fetch(
        `/api/admin/site-theme?siteId=${encodeURIComponent(effectiveSiteId)}`,
        { method: "GET", cache: "no-store" },
      );
      const payload = (await res.json().catch(() => null)) as
        | { themeSettings?: ThemeSettings; error?: string; details?: string }
        | null;
      setIsLoading(false);
      if (!res.ok) {
        setStatus({
          type: "error",
          message:
            `${payload?.error ?? "Não foi possível carregar aparência."} ${payload?.details ?? ""}`.trim(),
        });
        return;
      }
      setThemeSettings(payload?.themeSettings ?? {});
    };

    void loadTheme();
  }, [effectiveSiteId, isFullEditor]);

  async function onSave() {
    if (!effectiveSiteId) return;
    setIsSaving(true);
    setStatus(null);
    const res = await fetch(
      `/api/admin/site-theme?siteId=${encodeURIComponent(effectiveSiteId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeSettings }),
      },
    );
    const payload = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string; details?: string }
      | null;
    setIsSaving(false);
    if (!res.ok) {
      setStatus({
        type: "error",
        message:
          `${payload?.error ?? "Não foi possível salvar."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }
    setStatus({ type: "success", message: "Aparência salva com sucesso!" });
  }

  function set(key: string, value: unknown) {
    setThemeSettings((c) => ({ ...c, [key]: value }));
  }

  const currentPalette = palettePresets.find(
    (p) =>
      p.primary === asString(themeSettings.primaryColor) &&
      p.accent === asString(themeSettings.accentColor),
  );

  /* ── LOCKED VIEW (Básico) ──────────────────────────────────────────────── */
  if (!isFullEditor) {
    return (
      <>
        {/* Site selector — still useful even on locked view */}
        {sites.length > 1 && (
          <div className="mb-4">
            <select
              value={effectiveSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.domain}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Locked card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* Gradient top-border glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE]" />

          {/* Blurred content preview */}
          <div
            className="pointer-events-none select-none space-y-5 bg-[#12182B] p-5 opacity-40"
            aria-hidden
            style={{ filter: "blur(3.5px)" }}
          >
            {/* Fake palette grid */}
            <div>
              <div className="mb-2 h-2.5 w-32 rounded-full bg-white/25" />
              <div className="grid grid-cols-6 gap-2">
                {PREVIEW_PALETTES.map((c, i) => (
                  <div
                    key={i}
                    className="grid h-9 grid-cols-2 overflow-hidden rounded-lg"
                  >
                    <span style={{ background: c.p }} />
                    <span style={{ background: c.a }} />
                    <span style={{ background: c.b }} />
                    <span style={{ background: c.t }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Fake font selector */}
            <div className="h-9 w-full rounded-xl bg-white/10" />
            {/* Fake button styles */}
            <div className="flex gap-2">
              <div className="h-16 flex-1 rounded-xl bg-white/10" />
              <div className="h-16 flex-1 rounded-xl bg-white/10" />
              <div className="h-16 flex-1 rounded-xl bg-white/10" />
            </div>
            {/* Fake header styles */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-14 rounded-xl bg-white/10" />
              <div className="h-14 rounded-xl bg-white/10" />
              <div className="h-14 rounded-xl bg-white/10" />
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1426]/78 p-8">
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, #7C5CFF 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Lock icon */}
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] shadow-[0_0_32px_rgba(124,92,255,0.50)]">
                <Lock size={26} className="text-white" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-extrabold text-white">
                Personalização Visual
              </h3>
              <p className="mt-2 max-w-xs text-sm text-white/50">
                Cores, fontes, botões, header e separadores — disponíveis no plano
                Premium.
              </p>

              {/* CTA */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] px-8 py-3 text-sm font-bold text-white shadow-[0_6px_28px_rgba(124,92,255,0.45)] transition hover:brightness-110 active:scale-[0.98]"
              >
                <Sparkles size={14} />
                Fazer upgrade
              </button>
            </div>
          </div>
        </div>

        <UpgradeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  /* ── FULL EDITOR (Construir / Premium Full) ────────────────────────────── */
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
    <div className="space-y-6">
      {/* Site selector */}
      {sites.length > 1 && (
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
            htmlFor="branding-site"
          >
            Site
          </label>
          <select
            id="branding-site"
            value={effectiveSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.domain}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Palette presets */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(124,92,255,0.08)]">
        <h2 className="text-base font-semibold text-[var(--platform-text)]">
          Paleta de cores
        </h2>
        <p className="mt-1 text-sm text-[var(--platform-text)]/55">
          Escolha um preset ou ajuste as cores manualmente abaixo.
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
          {palettePresets.map((palette) => {
            const isActive = currentPalette?.id === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                title={palette.name}
                onClick={() => setThemeSettings((c) => applyPalette(c, palette))}
                className={`group flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition ${
                  isActive
                    ? "ring-2 ring-[#22D3EE] ring-offset-2 ring-offset-[#12182B]"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="grid h-9 w-9 grid-cols-2 overflow-hidden rounded-lg">
                  <span style={{ background: palette.primary }} />
                  <span style={{ background: palette.accent }} />
                  <span style={{ background: palette.background }} />
                  <span style={{ background: palette.text }} />
                </div>
                <span className="text-center text-[9px] leading-tight text-[var(--platform-text)]/50 group-hover:text-[var(--platform-text)]/80">
                  {palette.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(
            [
              { key: "primaryColor", label: "Primária" },
              { key: "accentColor", label: "Destaque" },
              { key: "backgroundColor", label: "Fundo" },
              { key: "textColor", label: "Texto" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                {label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={asString(themeSettings[key]) || "#000000"}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-white/15 bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={asString(themeSettings[key])}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="#000000"
                  className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-2 py-1.5 text-xs font-mono text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography & style */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
        <h2 className="text-base font-semibold text-[var(--platform-text)]">
          Tipografia e estilo
        </h2>

        <div className="mt-4">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
            htmlFor="font-family"
          >
            Fonte principal
          </label>
          <select
            id="font-family"
            value={asString(themeSettings.fontFamily)}
            onChange={(e) => set("fontFamily", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Estilo dos botões
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BUTTON_STYLES.map((style) => {
              const isActive = asString(themeSettings.buttonStyle) === style.value;
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => set("buttonStyle", style.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-3 transition ${
                    isActive
                      ? "border-[#22D3EE]/60 bg-[#22D3EE]/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`inline-block border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[var(--platform-text)] ${style.preview}`}
                  >
                    Botão
                  </span>
                  <span
                    className={`text-[11px] ${isActive ? "text-[#22D3EE]" : "text-[var(--platform-text)]/50"}`}
                  >
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Header & divider */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(59,130,246,0.06)]">
        <h2 className="text-base font-semibold text-[var(--platform-text)]">
          Cabeçalho e separadores
        </h2>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Estilo do cabeçalho
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {HEADER_STYLES.map((s) => {
              const isActive = asString(themeSettings.headerStyle) === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("headerStyle", s.value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-[#22D3EE]/60 bg-[#22D3EE]/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${isActive ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}
                  >
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--platform-text)]/45">
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Estilo dos separadores entre seções
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DIVIDER_STYLES.map((s) => {
              const isActive = asString(themeSettings.dividerStyle) === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("dividerStyle", s.value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-[#22D3EE]/60 bg-[#22D3EE]/10 font-semibold text-[#22D3EE]"
                      : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20 hover:text-[var(--platform-text)]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={isSaving || isLoading}
          className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar aparência"}
        </button>
        {status && (
          <p
            className={`text-xs ${
              status.type === "error" ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>

    {/* Live preview column */}
    <AppearancePreview
      siteName={selectedSite?.name ?? "Meu Site"}
      siteDomain={selectedSite?.domain ?? "seunome.bsph.com.br"}
      theme={themeSettings}
    />
    </div>
  );
}
