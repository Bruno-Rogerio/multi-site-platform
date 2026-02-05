"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { validateImageForSlot } from "@/components/admin/image-validation";
import { mediaPresets } from "@/lib/media/presets";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
};

type ThemeSettings = Record<string, unknown>;

type SiteBrandingEditorProps = {
  sites: SiteOption[];
  defaultSiteId: string | null;
};

type Status =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function SiteBrandingEditor({ sites, defaultSiteId }: SiteBrandingEditorProps) {
  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSelectedFileName, setLastSelectedFileName] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const effectiveSiteId = selectedSiteId || defaultSiteId || sites[0]?.id || "";

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === effectiveSiteId) ?? null,
    [sites, effectiveSiteId],
  );

  useEffect(() => {
    if (!effectiveSiteId) {
      return;
    }

    const loadTheme = async () => {
      setIsLoading(true);
      setStatus(null);

      const response = await fetch(`/api/admin/site-theme?siteId=${encodeURIComponent(effectiveSiteId)}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as
        | { themeSettings?: ThemeSettings; error?: string; details?: string }
        | null;

      setIsLoading(false);

      if (!response.ok) {
        setStatus({
          type: "error",
          message: `${payload?.error ?? "Nao foi possivel carregar branding."} ${payload?.details ?? ""}`.trim(),
        });
        return;
      }

      setThemeSettings(payload?.themeSettings ?? {});
    };

    void loadTheme();
  }, [effectiveSiteId]);

  async function onSave() {
    if (!effectiveSiteId) {
      return;
    }

    setIsSaving(true);
    setStatus(null);

    const response = await fetch(`/api/admin/site-theme?siteId=${encodeURIComponent(effectiveSiteId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeSettings }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; details?: string }
      | null;

    setIsSaving(false);

    if (!response.ok) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Nao foi possivel salvar branding."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    setStatus({ type: "success", message: "Branding salvo com sucesso." });
  }

  async function onUploadLogo(file: File) {
    if (!effectiveSiteId) {
      return;
    }

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("siteId", effectiveSiteId);
    formData.append("sectionType", "branding");
    formData.append("slot", "logo");
    formData.append("file", file);

    const response = await fetch("/api/admin/upload-asset", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | { url?: string; error?: string; details?: string }
      | null;

    setIsUploading(false);

    if (!response.ok || !payload?.url) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Nao foi possivel enviar logo."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    setThemeSettings((current) => ({ ...current, logoUrl: payload.url }));
    setStatus({ type: "success", message: "Logo enviada. Clique em salvar branding." });
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      <h2 className="text-lg font-semibold text-[var(--platform-text)]">Branding do header</h2>
      <p className="mt-1 text-sm text-[var(--platform-text)]/70">
        Gerencie o logo e elementos basicos de identidade visual por site.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="branding-site">
            Site
          </label>
          <select
            id="branding-site"
            value={effectiveSiteId}
            onChange={(event) => setSelectedSiteId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} - {site.domain}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Upload de logo
          </label>
          <p className="mt-1 text-[11px] text-[var(--platform-text)]/55">
            {mediaPresets.logo.recommendedText}
          </p>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading || isLoading || !effectiveSiteId}
            onChange={async (event) => {
              const inputElement = event.currentTarget;
              const file = event.target.files?.[0];
              if (file) {
                setLastSelectedFileName(file.name);
                const validationError = await validateImageForSlot(file, "logo");
                if (validationError) {
                  setStatus({ type: "error", message: validationError });
                  inputElement.value = "";
                  return;
                }
                void onUploadLogo(file);
              }
              inputElement.value = "";
            }}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
          {!effectiveSiteId ? (
            <p className="mt-1 text-[11px] text-amber-200">Selecione um site para enviar o logo.</p>
          ) : null}
          {lastSelectedFileName ? (
            <p className="mt-1 text-[11px] text-[var(--platform-text)]/65">Arquivo selecionado: {lastSelectedFileName}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="logo-url">
          Logo URL
        </label>
        <input
          id="logo-url"
          value={asString(themeSettings.logoUrl)}
          onChange={(event) =>
            setThemeSettings((current) => ({
              ...current,
              logoUrl: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        />
      </div>

      {asString(themeSettings.logoUrl) && selectedSite ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3">
          <p className="text-xs text-[var(--platform-text)]/60">Preview do header ({selectedSite.name})</p>
          <div className="mt-2 flex items-center gap-3">
            <Image
              src={asString(themeSettings.logoUrl)}
              alt={`Logo de ${selectedSite.name}`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg border border-white/10 object-cover"
            />
            <span className="text-sm font-semibold text-[var(--platform-text)]">{selectedSite.name}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={isSaving || isLoading}
          className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar branding"}
        </button>
        {status ? (
          <p
            className={`text-xs ${
              status.type === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
