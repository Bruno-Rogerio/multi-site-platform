"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { validateImageForSlot } from "@/components/admin/image-validation";
import { mediaPresets } from "@/lib/media/presets";
import {
  palettePresets,
  spacingMap,
  shadowMap,
  type PalettePreset,
} from "@/lib/onboarding/palettes";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
};

type ThemeSettings = Record<string, unknown>;

type SiteBrandingEditorProps = {
  sites: SiteOption[];
  defaultSiteId: string | null;
  /** "basico" = logo only. "construir" | "premium-full" = full editor. */
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

export function SiteBrandingEditor({
  sites,
  defaultSiteId,
  plan = "basico",
}: SiteBrandingEditorProps) {
  const isFullEditor = plan === "construir" || plan === "premium-full";

  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSelectedFileName, setLastSelectedFileName] = useState("");
  const [status, setStatus] = useState<Status>(null);

  const effectiveSiteId = selectedSiteId || defaultSiteId || sites[0]?.id || "";

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === effectiveSiteId) ?? null,
    [sites, effectiveSiteId],
  );

  useEffect(() => {
    if (!effectiveSiteId) return;

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
  }, [effectiveSiteId]);

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

  async function onUploadLogo(file: File) {
    if (!effectiveSiteId) return;
    setIsUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("siteId", effectiveSiteId);
    formData.append("sectionType", "branding");
    formData.append("slot", "logo");
    formData.append("file", file);
    const res = await fetch("/api/admin/upload-asset", {
      method: "POST",
      body: formData,
    });
    const payload = (await res.json().catch(() => null)) as
      | { url?: string; error?: string; details?: string }
      | null;
    setIsUploading(false);
    if (!res.ok || !payload?.url) {
      setStatus({
        type: "error",
        message:
          `${payload?.error ?? "Não foi possível enviar logo."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }
    setThemeSettings((c) => ({ ...c, logoUrl: payload.url }));
    setStatus({ type: "success", message: "Logo enviada. Clique em salvar." });
  }

  function set(key: string, value: unknown) {
    setThemeSettings((c) => ({ ...c, [key]: value }));
  }

  const currentPalette = palettePresets.find(
    (p) =>
      p.primary === asString(themeSettings.primaryColor) &&
      p.accent === asString(themeSettings.accentColor),
  );

  return (
    <div className="space-y-6">
      {/* ── Logo ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
        <h2 className="text-base font-semibold text-[var(--platform-text)]">
          Logo
        </h2>
        <p className="mt-1 text-sm text-[var(--platform-text)]/55">
          Identidade visual exibida no cabeçalho do seu site.
        </p>

        {/* Site selector (only shown when there are multiple sites — platform admin view) */}
        {sites.length > 1 && (
          <div className="mt-4">
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

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
              Upload de logo
            </label>
            <p className="mt-1 text-[11px] text-[var(--platform-text)]/50">
              {mediaPresets.logo.recommendedText}
            </p>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading || isLoading || !effectiveSiteId}
              onChange={async (e) => {
                const el = e.currentTarget;
                const file = e.target.files?.[0];
                if (file) {
                  setLastSelectedFileName(file.name);
                  const err = await validateImageForSlot(file, "logo");
                  if (err) {
                    setStatus({ type: "error", message: err });
                    el.value = "";
                    return;
                  }
                  void onUploadLogo(file);
                }
                el.value = "";
              }}
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
            />
            {lastSelectedFileName && (
              <p className="mt-1 text-[11px] text-[var(--platform-text)]/55">
                Arquivo: {lastSelectedFileName}
              </p>
            )}
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
              htmlFor="logo-url"
            >
              URL do logo
            </label>
            <input
              id="logo-url"
              value={asString(themeSettings.logoUrl)}
              onChange={(e) => set("logoUrl", e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>
        </div>

        {asString(themeSettings.logoUrl) && selectedSite && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3">
            <p className="text-xs text-[var(--platform-text)]/50">
              Preview do header
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Image
                src={asString(themeSettings.logoUrl)}
                alt={`Logo de ${selectedSite.name}`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg border border-white/10 object-cover"
              />
              <span className="text-sm font-semibold text-[var(--platform-text)]">
                {selectedSite.name}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ── Full editor (Construir / Premium Full only) ── */}
      {isFullEditor && (
        <>
          {/* Palette presets */}
          <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(124,92,255,0.08)]">
            <h2 className="text-base font-semibold text-[var(--platform-text)]">
              Paleta de cores
            </h2>
            <p className="mt-1 text-sm text-[var(--platform-text)]/55">
              Escolha um preset ou ajuste as cores manualmente abaixo.
            </p>

            {/* Preset swatches */}
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
              {palettePresets.map((palette) => {
                const isActive = currentPalette?.id === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    title={palette.name}
                    onClick={() =>
                      setThemeSettings((c) => applyPalette(c, palette))
                    }
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

            {/* Manual color pickers */}
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

            {/* Font family */}
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

            {/* Button style */}
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

            {/* Header style */}
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

            {/* Divider style */}
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
        </>
      )}

      {/* ── Plan upgrade hint for Básico ── */}
      {!isFullEditor && (
        <div className="rounded-xl border border-violet-400/20 bg-violet-500/5 p-4">
          <p className="text-sm font-semibold text-violet-300">
            Quer controle total sobre cores, fontes e estilo?
          </p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/50">
            Faça upgrade para o plano Construir ou Premium Full e desbloqueie o
            editor completo de aparência.
          </p>
        </div>
      )}

      {/* ── Save button ── */}
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
  );
}
