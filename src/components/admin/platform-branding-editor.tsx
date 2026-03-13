"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SOCIAL_META } from "@/lib/platform/branding-utils";

type PlatformSettings = Record<string, string>;

type Status =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

const SOCIAL_KEYS = Object.keys(SOCIAL_META) as (keyof typeof SOCIAL_META)[];

const UPLOADABLE_SLOTS = [
  { key: "logo_url", label: "Logo da plataforma" },
  { key: "favicon_url", label: "Favicon (32×32 px recomendado)" },
  { key: "hero_image_url", label: "Imagem hero da home" },
  { key: "dashboard_banner_url", label: "Banner do painel do cliente" },
] as const;

function s(settings: PlatformSettings, key: string): string {
  return settings[key] ?? "";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b border-white/10 pb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#22D3EE]">
      {children}
    </h3>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const base =
    "mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE] placeholder:text-white/20";
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--platform-text)]/60">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

export function PlatformBrandingEditor() {
  const [settings, setSettings] = useState<PlatformSettings>({});
  const [state, setState] = useState<"idle" | "loading" | "saving" | "uploading">("loading");
  const [status, setStatus] = useState<Status>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function load() {
    setState("loading");
    const res = await fetch("/api/admin/platform-settings", { cache: "no-store" });
    const data = (await res.json().catch(() => null)) as { settings?: PlatformSettings } | null;
    setState("idle");
    if (res.ok) setSettings((data?.settings as PlatformSettings) ?? {});
    else setStatus({ type: "error", message: "Erro ao carregar configurações." });
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    setState("saving");
    setStatus(null);
    const res = await fetch("/api/admin/platform-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    setState("idle");
    if (res.ok && data?.ok) {
      setStatus({ type: "success", message: "Configurações salvas com sucesso." });
    } else {
      setStatus({ type: "error", message: data?.error ?? "Erro ao salvar." });
    }
  }

  async function upload(file: File, slot: string) {
    setState("uploading");
    setStatus(null);
    const form = new FormData();
    form.append("slot", slot);
    form.append("file", file);
    const res = await fetch("/api/admin/platform-upload", { method: "POST", body: form });
    const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
    setState("idle");
    if (res.ok && data?.url) {
      set(slot, data.url);
      setStatus({ type: "success", message: "Upload concluído. Salve para aplicar." });
    } else {
      setStatus({ type: "error", message: data?.error ?? "Falha no upload." });
    }
    if (fileRefs.current[slot]) fileRefs.current[slot]!.value = "";
  }

  const configuredSocials = SOCIAL_KEYS.filter((k) => s(settings, `social_${k}`).trim());
  const floatOptions = [{ key: "", label: "— Nenhum —" }, ...configuredSocials.map((k) => ({
    key: k,
    label: `${SOCIAL_META[k].emoji} ${SOCIAL_META[k].label}`,
  }))];

  if (state === "loading") {
    return (
      <section className="mt-8 rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {status && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            status.type === "error"
              ? "border border-red-300/40 bg-red-500/10 text-red-200"
              : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {status.message}
        </p>
      )}

      {/* ── Identidade ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <SectionTitle>Identidade da marca</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome da plataforma" value={s(settings, "brand_name")} placeholder="BuildSphere" onChange={(v) => set("brand_name", v)} />
          <Field label="Tagline (frase curta)" value={s(settings, "tagline")} placeholder="Seu site profissional em minutos" onChange={(v) => set("tagline", v)} />
          <div className="md:col-span-2">
            <Field label="Descrição (aparece no rodapé e SEO)" value={s(settings, "platform_description")} placeholder="Plataforma para criação de sites profissionais..." onChange={(v) => set("platform_description", v)} textarea />
          </div>
        </div>
      </section>

      {/* ── Mídias ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <SectionTitle>Imagens e mídias</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {UPLOADABLE_SLOTS.map(({ key, label }) => (
            <article key={key} className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/65">{label}</p>
              <input
                value={s(settings, key)}
                onChange={(e) => set(key, e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
              />
              <input
                type="file"
                accept="image/*"
                ref={(el) => { fileRefs.current[key] = el; }}
                disabled={state === "uploading"}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await upload(file, key);
                }}
                className="mt-2 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
              />
              {s(settings, key) && (
                <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-2">
                  <Image src={s(settings, key)} alt={label} width={800} height={400} className="h-20 w-full rounded-md object-cover" />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ── Contato ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <SectionTitle>Informações de contato</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="E-mail de contato" value={s(settings, "contact_email")} placeholder="contato@buildsphere.com.br" onChange={(v) => set("contact_email", v)} />
          <Field label="Telefone" value={s(settings, "contact_phone")} placeholder="+55 (11) 99999-9999" onChange={(v) => set("contact_phone", v)} />
          <Field label="WhatsApp (número)" value={s(settings, "contact_whatsapp")} placeholder="5511999999999" onChange={(v) => set("contact_whatsapp", v)} />
        </div>
      </section>

      {/* ── Redes Sociais ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <SectionTitle>Redes sociais</SectionTitle>
        <p className="mb-4 text-xs text-[var(--platform-text)]/50">Links que aparecerão no rodapé da landing page. Deixe em branco para não exibir.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_KEYS.map((k) => {
            const meta = SOCIAL_META[k];
            return (
              <div key={k}>
                <label className="block text-xs font-semibold text-[var(--platform-text)]/60">
                  {meta.emoji} {meta.label}
                </label>
                <input
                  value={s(settings, `social_${k}`)}
                  onChange={(e) => set(`social_${k}`, e.target.value)}
                  placeholder={meta.placeholder}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE] placeholder:text-white/20"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Botões Flutuantes ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <SectionTitle>Botões flutuantes</SectionTitle>
        <p className="mb-4 text-xs text-[var(--platform-text)]/50">
          Selecione até 2 redes sociais para exibir como botões fixos no canto da landing page. Apenas redes configuradas acima aparecem aqui.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {([
            ["floating_button_1", "Botão flutuante 1"],
            ["floating_button_2", "Botão flutuante 2"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[var(--platform-text)]/60">{label}</label>
              <select
                value={s(settings, key)}
                onChange={(e) => set(key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
              >
                {floatOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {configuredSocials.length === 0 && (
          <p className="mt-3 text-xs text-amber-400/70">
            Configure ao menos uma rede social acima para habilitar os botões flutuantes.
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={state === "saving" || state === "uploading"}
          className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "saving" ? "Salvando..." : "Salvar todas as configurações"}
        </button>
      </div>
    </div>
  );
}
