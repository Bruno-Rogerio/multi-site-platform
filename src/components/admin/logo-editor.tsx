"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

import { validateImageForSlot } from "@/components/admin/image-validation";
import { mediaPresets } from "@/lib/media/presets";

type ThemeSettings = Record<string, unknown>;

type Status =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function LogoEditor({ siteId, siteName }: { siteId: string; siteName?: string }) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [lastFile, setLastFile] = useState("");

  useEffect(() => {
    if (!siteId) return;
    const load = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/site-theme?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      const payload = (await res.json().catch(() => null)) as
        | { themeSettings?: ThemeSettings }
        | null;
      setIsLoading(false);
      if (payload?.themeSettings) setThemeSettings(payload.themeSettings);
    };
    void load();
  }, [siteId]);

  async function onUpload(file: File) {
    setIsUploading(true);
    setStatus(null);
    const form = new FormData();
    form.append("siteId", siteId);
    form.append("sectionType", "branding");
    form.append("slot", "logo");
    form.append("file", file);
    const res = await fetch("/api/admin/upload-asset", { method: "POST", body: form });
    const payload = (await res.json().catch(() => null)) as
      | { url?: string; error?: string; details?: string }
      | null;
    setIsUploading(false);
    if (!res.ok || !payload?.url) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Não foi possível enviar logo."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }
    setThemeSettings((c) => ({ ...c, logoUrl: payload.url }));
    setStatus({ type: "success", message: "Logo enviada. Clique em salvar." });
  }

  async function onSave() {
    setIsSaving(true);
    setStatus(null);
    const res = await fetch(`/api/admin/site-theme?siteId=${encodeURIComponent(siteId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeSettings }),
    });
    const payload = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string; details?: string }
      | null;
    setIsSaving(false);
    if (!res.ok) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Não foi possível salvar."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }
    setStatus({ type: "success", message: "Logo salva com sucesso!" });
  }

  const logoUrl = asString(themeSettings.logoUrl);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/10">
          <ImageIcon size={17} className="text-[#3B82F6]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--platform-text)]">Logo do site</h2>
          <p className="text-xs text-[var(--platform-text)]/50">
            Aparece no cabeçalho e na aba do navegador.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Upload */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Fazer upload
          </label>
          <p className="mt-0.5 text-[11px] text-[var(--platform-text)]/45">
            {mediaPresets.logo.recommendedText}
          </p>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading || isLoading}
            onChange={async (e) => {
              const el = e.currentTarget;
              const file = e.target.files?.[0];
              if (file) {
                setLastFile(file.name);
                const err = await validateImageForSlot(file, "logo");
                if (err) {
                  setStatus({ type: "error", message: err });
                  el.value = "";
                  return;
                }
                void onUpload(file);
              }
              el.value = "";
            }}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
          {lastFile && (
            <p className="mt-1 text-[11px] text-[var(--platform-text)]/50">
              Arquivo: {lastFile}
            </p>
          )}
        </div>

        {/* URL */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="logo-url">
            Ou informe a URL
          </label>
          <input
            id="logo-url"
            value={logoUrl}
            onChange={(e) => setThemeSettings((c) => ({ ...c, logoUrl: e.target.value }))}
            placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          />
        </div>
      </div>

      {/* Preview */}
      {logoUrl && (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3">
          <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
            Preview do header
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Image
              src={logoUrl}
              alt="Logo preview"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg border border-white/10 object-contain"
            />
            {siteName && (
              <span className="text-sm font-semibold text-[var(--platform-text)]">
                {siteName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={isSaving || isLoading || isUploading}
          className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar logo"}
        </button>
        {status && (
          <p className={`text-xs ${status.type === "error" ? "text-red-300" : "text-emerald-300"}`}>
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
