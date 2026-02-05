"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PlatformSettings = {
  brand_name?: string;
  logo_url?: string;
  hero_image_url?: string;
  dashboard_banner_url?: string;
};

type Status =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function PlatformBrandingEditor() {
  const [settings, setSettings] = useState<PlatformSettings>({});
  const [state, setState] = useState<"idle" | "loading" | "saving" | "uploading">("idle");
  const [status, setStatus] = useState<Status>(null);

  async function loadSettings() {
    setState("loading");
    setStatus(null);
    const response = await fetch("/api/admin/platform-settings", { method: "GET", cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as
      | { settings?: PlatformSettings; error?: string; details?: string }
      | null;
    setState("idle");

    if (!response.ok) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Nao foi possivel carregar branding da plataforma."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    setSettings(payload?.settings ?? {});
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadSettings();
    });
  }, []);

  async function saveSettings() {
    setState("saving");
    setStatus(null);
    const response = await fetch("/api/admin/platform-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; details?: string }
      | null;
    setState("idle");

    if (!response.ok) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Nao foi possivel salvar branding da plataforma."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    setStatus({ type: "success", message: "Branding da plataforma atualizado." });
  }

  async function uploadPlatformAsset(file: File, slot: "logo_url" | "hero_image_url" | "dashboard_banner_url") {
    setState("uploading");
    setStatus(null);

    const formData = new FormData();
    formData.append("slot", slot);
    formData.append("file", file);

    const response = await fetch("/api/admin/platform-upload", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json().catch(() => null)) as
      | { url?: string; error?: string; details?: string }
      | null;
    setState("idle");

    if (!response.ok || !payload?.url) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Falha no upload."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    setSettings((current) => ({ ...current, [slot]: payload.url }));
    setStatus({ type: "success", message: "Upload concluido. Salve para aplicar." });
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#12182B] p-5">
      <h2 className="text-lg font-semibold text-[var(--platform-text)]">Branding da plataforma</h2>
      <p className="mt-2 text-sm text-[var(--platform-text)]/75">
        Ajuste logo e imagens institucionais do SaaS (nao afeta tenants de clientes).
      </p>

      {status ? (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-xs ${
            status.type === "error"
              ? "border border-red-300/40 bg-red-500/10 text-red-200"
              : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(
          [
            ["logo_url", "Logo da plataforma"],
            ["hero_image_url", "Imagem hero da home"],
            ["dashboard_banner_url", "Banner do dashboard"],
          ] as const
        ).map(([key, label]) => (
          <article key={key} className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/65">{label}</p>
            <input
              value={asString(settings[key])}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
              placeholder="https://..."
            />
            <input
              type="file"
              accept="image/*"
              disabled={state === "uploading"}
              onChange={async (event) => {
                const inputElement = event.currentTarget;
                const file = event.target.files?.[0];
                if (file) {
                  await uploadPlatformAsset(file, key);
                }
                inputElement.value = "";
              }}
              className="mt-2 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
            />

            {asString(settings[key]) ? (
              <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-2">
                <Image
                  src={asString(settings[key])}
                  alt={label}
                  width={800}
                  height={400}
                  className="h-24 w-full rounded-md object-cover"
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void saveSettings()}
        disabled={state === "loading" || state === "saving"}
        className="mt-4 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "saving" ? "Salvando..." : "Salvar branding da plataforma"}
      </button>
    </section>
  );
}
