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
  { key: "logo_url", label: "Logo da plataforma", hint: "PNG/SVG recomendado, fundo transparente" },
  { key: "favicon_url", label: "Favicon", hint: "32×32 px — ícone da aba do navegador" },
  { key: "hero_image_url", label: "Imagem hero da home", hint: "Aparece no banner principal" },
  { key: "dashboard_banner_url", label: "Banner do painel do cliente", hint: "Exibido no dashboard do cliente" },
] as const;

function s(settings: PlatformSettings, key: string): string {
  return settings[key] ?? "";
}

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B82F6/15,#7C5CFF/15)] border border-white/10 text-lg">
        {emoji}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#EAF0FF]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#EAF0FF]/45">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  textarea,
  hint,
  prefix,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
  prefix?: string;
}) {
  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-[#EAF0FF] outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 placeholder:text-white/20";
  return (
    <div>
      <label className="block text-xs font-semibold text-[#EAF0FF]/55 mb-1">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
        />
      ) : prefix ? (
        <div className="flex items-center rounded-lg border border-white/10 bg-[#0B1020] transition focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6]/30 overflow-hidden">
          <span className="shrink-0 border-r border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#EAF0FF]/35 font-mono whitespace-nowrap">
            {prefix}
          </span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent px-3 py-2 text-sm text-[#EAF0FF] outline-none placeholder:text-white/20"
          />
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {hint && <p className="mt-1 text-[11px] text-[#EAF0FF]/30">{hint}</p>}
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

  useEffect(() => { void load(); }, []);

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
    if (res.ok && data?.ok) setStatus({ type: "success", message: "Configurações salvas com sucesso!" });
    else setStatus({ type: "error", message: data?.error ?? "Erro ao salvar." });
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
      setStatus({ type: "success", message: "Upload concluído. Clique em salvar para aplicar." });
    } else {
      setStatus({ type: "error", message: data?.error ?? "Falha no upload." });
    }
    if (fileRefs.current[slot]) fileRefs.current[slot]!.value = "";
  }

  // Floating button options: whatsapp/email from contact fields, rest from social fields
  const floatOptions: { key: string; label: string }[] = [{ key: "", label: "— Nenhum —" }];
  if (s(settings, "contact_whatsapp")) floatOptions.push({ key: "whatsapp", label: "💬 WhatsApp" });
  if (s(settings, "contact_email")) floatOptions.push({ key: "email", label: "✉️ E-mail" });
  SOCIAL_KEYS.forEach((k) => {
    if (s(settings, `social_${k}`).trim()) {
      floatOptions.push({ key: k, label: `${SOCIAL_META[k].emoji} ${SOCIAL_META[k].label}` });
    }
  });

  const btn1 = s(settings, "floating_button_1");
  const btn2 = s(settings, "floating_button_2");

  if (state === "loading") {
    return (
      <div className="mt-8 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[1, 2].map((j) => <div key={j} className="h-10 animate-pulse rounded-lg bg-white/5" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {status && (
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            status.type === "error"
              ? "border-red-400/30 bg-red-500/10 text-red-200"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          <span>{status.type === "error" ? "⚠️" : "✅"}</span>
          {status.message}
        </div>
      )}

      {/* ── Identidade ── */}
      <section className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
        <SectionHeader emoji="🏷️" title="Identidade da marca" subtitle="Nome, slogan e descrição da plataforma" />
        <div className="space-y-4">
          <FieldRow>
            <Field label="Nome da plataforma" value={s(settings, "brand_name")} placeholder="BuildSphere" onChange={(v) => set("brand_name", v)} />
            <Field label="Tagline" value={s(settings, "tagline")} placeholder="Seu site profissional em minutos" onChange={(v) => set("tagline", v)} />
          </FieldRow>
          <Field
            label="Descrição (rodapé e SEO)"
            value={s(settings, "platform_description")}
            placeholder="Plataforma para criação de sites profissionais..."
            onChange={(v) => set("platform_description", v)}
            textarea
          />
        </div>
      </section>

      {/* ── Imagens ── */}
      <section className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
        <SectionHeader emoji="🖼️" title="Imagens e mídias" subtitle="Logo, favicon e imagens de destaque" />
        <div className="grid gap-4 md:grid-cols-2">
          {UPLOADABLE_SLOTS.map(({ key, label, hint }) => (
            <div key={key} className="rounded-xl border border-white/8 bg-[#080F20] p-4">
              <p className="text-xs font-bold text-[#EAF0FF]/60">{label}</p>
              <p className="mt-0.5 mb-3 text-[11px] text-[#EAF0FF]/30">{hint}</p>
              <input
                value={s(settings, key)}
                onChange={(e) => set(key, e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2 text-xs text-[#EAF0FF] outline-none focus:border-[#3B82F6] placeholder:text-white/20"
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
                className="mt-2 w-full text-xs text-[#EAF0FF]/50 file:mr-2 file:rounded-lg file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white file:cursor-pointer"
              />
              {s(settings, key) && (
                <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                  <Image src={s(settings, key)} alt={label} width={800} height={400} className="h-16 w-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contato ── */}
      <section className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
        <SectionHeader emoji="📞" title="Contato" subtitle="Informações de contato exibidas no rodapé e botões flutuantes" />
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="E-mail de contato"
            value={s(settings, "contact_email")}
            placeholder="contato@bsph.com.br"
            onChange={(v) => set("contact_email", v)}
            prefix="mailto:"
            hint="Aparece no rodapé e pode ser botão flutuante"
          />
          <Field
            label="Telefone"
            value={s(settings, "contact_phone")}
            placeholder="(11) 91519-4173"
            onChange={(v) => set("contact_phone", v)}
            hint="Exibido apenas como informação"
          />
          <Field
            label="WhatsApp"
            value={s(settings, "contact_whatsapp")}
            placeholder="5511915194173"
            onChange={(v) => set("contact_whatsapp", v)}
            prefix="wa.me/"
            hint="Número com DDI (ex: 5511...) — pode ser botão flutuante"
          />
        </div>
      </section>

      {/* ── Redes Sociais ── */}
      <section className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
        <SectionHeader emoji="🌐" title="Redes sociais" subtitle="Links exibidos no rodapé da landing page. Deixe em branco para não exibir." />
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_KEYS.map((k) => {
            const meta = SOCIAL_META[k];
            return (
              <Field
                key={k}
                label={`${meta.emoji} ${meta.label}`}
                value={s(settings, `social_${k}`)}
                placeholder={meta.placeholder}
                onChange={(v) => set(`social_${k}`, v)}
                prefix={meta.prefix || undefined}
              />
            );
          })}
        </div>
      </section>

      {/* ── Botões Flutuantes ── */}
      <section className="rounded-2xl border border-white/8 bg-[#0D1526] p-6">
        <SectionHeader
          emoji="🔘"
          title="Botões flutuantes"
          subtitle="Até 2 botões fixos no canto da landing page. Configure WhatsApp/e-mail na seção Contato ou redes sociais acima."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {([
            ["floating_button_1", "Botão 1 (inferior)"],
            ["floating_button_2", "Botão 2 (acima do 1)"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#EAF0FF]/55 mb-1">{label}</label>
              <select
                value={s(settings, key)}
                onChange={(e) => set(key, e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-[#EAF0FF] outline-none focus:border-[#3B82F6]"
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

        {/* Preview */}
        {(btn1 || btn2) && (
          <div className="mt-5 rounded-xl border border-white/8 bg-[#080F20] p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">Prévia</p>
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-2">
                {[btn2, btn1].filter(Boolean).map((type) => {
                  const meta = type === "email"
                    ? { emoji: "✉️", label: "E-mail" }
                    : type === "whatsapp"
                    ? { emoji: "💬", label: "WhatsApp" }
                    : SOCIAL_META[type] ?? { emoji: "💬", label: type };
                  return (
                    <div
                      key={type}
                      title={meta.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#12182B] text-lg shadow"
                    >
                      {meta.emoji}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[#EAF0FF]/35">
                Assim os botões aparecerão no canto inferior direito da landing page.
              </p>
            </div>
          </div>
        )}

        {floatOptions.length <= 1 && (
          <p className="mt-3 rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300/80">
            Configure ao menos um contato (WhatsApp, e-mail) ou rede social acima para habilitar os botões flutuantes.
          </p>
        )}
      </section>

      {/* Save */}
      <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0D1526] px-6 py-4">
        <p className="text-xs text-[#EAF0FF]/35">Alterações só são aplicadas após salvar</p>
        <button
          type="button"
          onClick={() => void save()}
          disabled={state === "saving" || state === "uploading"}
          className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-7 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "saving" ? "Salvando…" : state === "uploading" ? "Enviando imagem…" : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}
