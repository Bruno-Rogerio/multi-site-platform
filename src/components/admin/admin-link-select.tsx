"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, Hash, MessageCircle, Instagram, Mail,
  Linkedin, Facebook, ExternalLink, Link2,
} from "lucide-react";

type OptionItem = {
  label: string;
  value: string;
  prefix?: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  group: "anchor" | "social" | "custom";
};

const ANCHOR_OPTIONS: OptionItem[] = [
  { label: "Destaque (Hero)", value: "#hero", Icon: Hash, group: "anchor" },
  { label: "Serviços", value: "#services", Icon: Hash, group: "anchor" },
  { label: "Sobre", value: "#about", Icon: Hash, group: "anchor" },
  { label: "Contato", value: "#contact", Icon: Hash, group: "anchor" },
];

const SOCIAL_OPTIONS: OptionItem[] = [
  { label: "WhatsApp", value: "whatsapp", prefix: "https://wa.me/", Icon: MessageCircle, group: "social" },
  { label: "Instagram", value: "instagram", prefix: "https://instagram.com/", Icon: Instagram, group: "social" },
  { label: "E-mail", value: "email", prefix: "mailto:", Icon: Mail, group: "social" },
  { label: "LinkedIn", value: "linkedin", prefix: "https://linkedin.com/", Icon: Linkedin, group: "social" },
  { label: "Facebook", value: "facebook", prefix: "https://facebook.com/", Icon: Facebook, group: "social" },
];

interface AdminLinkSelectProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function AdminLinkSelect({
  value,
  onChange,
  placeholder = "Escolha o destino do link",
}: AdminLinkSelectProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "social-input" | "custom">("select");
  const [socialType, setSocialType] = useState<string | null>(null);
  const [socialInput, setSocialInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMode("select");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Derive display label
  const anchorMatch = ANCHOR_OPTIONS.find((o) => o.value === value);
  const socialMatch = SOCIAL_OPTIONS.find((o) => o.prefix && value?.startsWith(o.prefix));
  let displayLabel = placeholder;
  let DisplayIcon: React.ComponentType<{ size?: number; className?: string }> = Link2;
  if (anchorMatch) {
    displayLabel = anchorMatch.label;
    DisplayIcon = anchorMatch.Icon;
  } else if (socialMatch) {
    displayLabel = `${socialMatch.label}: ${value.replace(socialMatch.prefix!, "")}`;
    DisplayIcon = socialMatch.Icon;
  } else if (value) {
    displayLabel = value;
    DisplayIcon = ExternalLink;
  }

  function handleAnchorSelect(opt: OptionItem) {
    onChange(opt.value);
    setOpen(false);
    setMode("select");
  }

  function handleSocialSelect(opt: OptionItem) {
    setSocialType(opt.value);
    // Pre-fill from current value if it matches
    const existing = opt.prefix && value?.startsWith(opt.prefix)
      ? value.replace(opt.prefix, "")
      : "";
    setSocialInput(existing);
    setMode("social-input");
  }

  function confirmSocial() {
    const opt = SOCIAL_OPTIONS.find((o) => o.value === socialType);
    if (opt?.prefix && socialInput.trim()) {
      const clean = socialType === "whatsapp" ? socialInput.replace(/\D/g, "") : socialInput.trim();
      onChange(`${opt.prefix}${clean}`);
    }
    setOpen(false);
    setMode("select");
  }

  function handleCustom() {
    setMode("custom");
  }

  function confirmCustom(url: string) {
    onChange(url);
    setOpen(false);
    setMode("select");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-left text-sm text-[var(--platform-text)] transition hover:border-white/25 focus:border-[#22D3EE] outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          <DisplayIcon size={14} className="shrink-0 text-[var(--platform-text)]/40" />
          <span className={value ? "" : "text-[var(--platform-text)]/25"}>{displayLabel}</span>
        </span>
        <ChevronDown size={14} className={`shrink-0 text-[var(--platform-text)]/40 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-white/15 bg-[#12182B] py-1 shadow-xl">
          {mode === "select" && (
            <>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">
                Seções da página
              </p>
              {ANCHOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnchorSelect(opt)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition hover:bg-white/[0.06] ${
                    value === opt.value ? "text-[#22D3EE]" : "text-[var(--platform-text)]/80"
                  }`}
                >
                  <opt.Icon size={13} />
                  {opt.label}
                </button>
              ))}

              <div className="my-1 border-t border-white/10" />
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">
                Redes sociais
              </p>
              {SOCIAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSocialSelect(opt)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition hover:bg-white/[0.06] ${
                    socialMatch?.value === opt.value ? "text-[#22D3EE]" : "text-[var(--platform-text)]/80"
                  }`}
                >
                  <opt.Icon size={13} />
                  {opt.label}
                </button>
              ))}

              <div className="my-1 border-t border-white/10" />
              <button
                type="button"
                onClick={handleCustom}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[var(--platform-text)]/80 transition hover:bg-white/[0.06]"
              >
                <ExternalLink size={13} />
                Link personalizado
              </button>
            </>
          )}

          {mode === "social-input" && (
            <div className="p-3">
              <p className="mb-2 text-xs font-medium text-[var(--platform-text)]/70">
                {SOCIAL_OPTIONS.find((o) => o.value === socialType)?.label}
              </p>
              <input
                autoFocus
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmSocial()}
                placeholder={
                  socialType === "whatsapp" ? "5511999999999"
                  : socialType === "email" ? "nome@email.com"
                  : "Seu perfil"
                }
                className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none focus:border-[#22D3EE]"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={confirmSocial}
                  className="rounded-lg bg-[#22D3EE]/20 px-3 py-1 text-xs font-semibold text-[#22D3EE] transition hover:bg-[#22D3EE]/30"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="rounded-lg px-3 py-1 text-xs text-[var(--platform-text)]/50 transition hover:text-[var(--platform-text)]/80"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {mode === "custom" && (
            <div className="p-3">
              <p className="mb-2 text-xs font-medium text-[var(--platform-text)]/70">
                Link personalizado
              </p>
              <input
                autoFocus
                defaultValue={!anchorMatch && !socialMatch ? value : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmCustom((e.target as HTMLInputElement).value);
                  }
                }}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none focus:border-[#22D3EE]"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement);
                    confirmCustom(input?.value || "");
                  }}
                  className="rounded-lg bg-[#22D3EE]/20 px-3 py-1 text-xs font-semibold text-[#22D3EE] transition hover:bg-[#22D3EE]/30"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="rounded-lg px-3 py-1 text-xs text-[var(--platform-text)]/50 transition hover:text-[var(--platform-text)]/80"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
