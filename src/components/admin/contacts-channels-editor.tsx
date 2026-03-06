"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Instagram, Mail, Linkedin, Facebook } from "lucide-react";
import { useToast } from "@/components/admin/toast-provider";
import type { Section } from "@/lib/tenant/types";

type SocialLink = { type: string; url: string; label: string; icon: string };

type ChannelDef = {
  type: string;
  label: string;
  placeholder: string;
  prefix: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  iconName: string;
};

const CHANNEL_DEFS: ChannelDef[] = [
  { type: "whatsapp",  label: "WhatsApp",  placeholder: "5511999999999", prefix: "wa.me/",          Icon: MessageCircle, iconName: "MessageCircle" },
  { type: "instagram", label: "Instagram", placeholder: "seu_perfil",    prefix: "instagram.com/",  Icon: Instagram,     iconName: "Instagram" },
  { type: "email",     label: "E-mail",    placeholder: "contato@seu.site", prefix: "",             Icon: Mail,          iconName: "Mail" },
  { type: "linkedin",  label: "LinkedIn",  placeholder: "seu-perfil",    prefix: "linkedin.com/in/", Icon: Linkedin,     iconName: "Linkedin" },
  { type: "facebook",  label: "Facebook",  placeholder: "suapagina",     prefix: "facebook.com/",   Icon: Facebook,     iconName: "Facebook" },
];

function parseSocialLinks(content: Record<string, unknown>): SocialLink[] {
  if (Array.isArray(content.socialLinks) && (content.socialLinks as unknown[]).length > 0) {
    return content.socialLinks as SocialLink[];
  }
  const links: SocialLink[] = [];
  const wa = typeof content.whatsappUrl === "string" ? content.whatsappUrl : "";
  if (wa) links.push({ type: "whatsapp", url: wa, label: "WhatsApp", icon: "MessageCircle" });
  return links;
}

function getDisplayValue(links: SocialLink[], type: string): string {
  const link = links.find((l) => l.type === type);
  if (!link) return "";
  if (type === "whatsapp") return link.url.replace("https://wa.me/", "");
  if (type === "email") return link.url.replace("mailto:", "");
  // Strip common prefixes for display
  for (const def of CHANNEL_DEFS) {
    if (def.type === type && def.prefix) {
      const withHttps = `https://${def.prefix}`;
      if (link.url.startsWith(withHttps)) return link.url.slice(withHttps.length);
    }
  }
  return link.url;
}

function buildUrl(type: string, raw: string): string {
  const v = raw.trim();
  if (type === "whatsapp") return `https://wa.me/${v.replace(/\D/g, "")}`;
  if (type === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  return v.startsWith("http") ? v : `https://${v}`;
}

function WhatsappSvgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#25D366",
  instagram: "#E1306C",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  email: "#7C5CFF",
};

type Props = {
  siteId: string;
  contactSection: Section | null;
};

export function ContactChannelsEditor({ siteId, contactSection }: Props) {
  const initialLinks = contactSection ? parseSocialLinks(contactSection.content) : [];

  // Local state: map of type -> display value (raw input)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(CHANNEL_DEFS.map((def) => [def.type, getDisplayValue(initialLinks, def.type)])),
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function updateValue(type: string, raw: string) {
    setValues((prev) => ({ ...prev, [type]: raw }));
  }

  async function handleSave() {
    if (!contactSection) return;
    setSaving(true);

    const socialLinks: SocialLink[] = CHANNEL_DEFS
      .filter((def) => values[def.type]?.trim())
      .map((def) => ({
        type: def.type,
        url: buildUrl(def.type, values[def.type]),
        label: def.label,
        icon: def.iconName,
      }));

    const waUrl = socialLinks.find((l) => l.type === "whatsapp")?.url ?? "";

    try {
      const res = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: contactSection.id,
          order: contactSection.order,
          variant: contactSection.variant ?? "default",
          content: {
            ...contactSection.content,
            socialLinks,
            whatsappUrl: waUrl,
          },
        }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        toast("Canais de contato salvos!", "success");
      } else {
        toast(data?.error ?? "Erro ao salvar.", "error");
      }
    } catch {
      toast("Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!contactSection) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-[var(--platform-text)]/50">
          Nenhuma seção de contato ativa neste site.
        </p>
        <p className="mt-1 text-xs text-[var(--platform-text)]/30">
          Adicione uma seção de contato no editor para configurar os canais.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[var(--platform-text)]">Canais de contato</h3>
        <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
          Preencha os canais que deseja exibir. Deixe em branco para ocultar.
        </p>
      </div>

      <div className="space-y-3">
        {CHANNEL_DEFS.map((def) => {
          const color = CHANNEL_COLORS[def.type] ?? "#22D3EE";
          const hasValue = Boolean(values[def.type]?.trim());

          return (
            <div
              key={def.type}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                hasValue ? "border-white/15 bg-white/[0.03]" : "border-white/8 bg-transparent"
              }`}
            >
              {/* Channel icon */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: hasValue ? color : "rgba(255,255,255,0.06)" }}
              >
                {def.type === "whatsapp" ? (
                  <WhatsappSvgIcon />
                ) : (
                  <def.Icon
                    size={16}
                    className={hasValue ? "text-white" : "text-[var(--platform-text)]/40"}
                  />
                )}
              </div>

              {/* Input */}
              <div className="flex-1">
                <p className="mb-1 text-xs font-medium text-[var(--platform-text)]/60">{def.label}</p>
                <div className="relative flex items-center">
                  {def.prefix && (
                    <span className="pointer-events-none absolute left-3 select-none text-xs text-[var(--platform-text)]/40">
                      {def.prefix}
                    </span>
                  )}
                  <input
                    value={values[def.type]}
                    onChange={(e) => updateValue(def.type, e.target.value)}
                    placeholder={def.placeholder}
                    className="w-full rounded-lg border border-white/10 bg-[#0B1020] py-2 pr-3 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]"
                    style={{ paddingLeft: def.prefix ? `${def.prefix.length * 7 + 12}px` : "12px" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        Salvar canais
      </button>
    </div>
  );
}
