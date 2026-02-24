"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, MessageCircle, Instagram, Mail, Linkedin, Facebook,
  Link2, Hash, ExternalLink,
} from "lucide-react";

type OptionItem = {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  group: "social" | "anchor" | "custom";
};

const ANCHOR_OPTIONS: OptionItem[] = [
  { label: "Serviços", value: "#services", Icon: Hash, group: "anchor" },
  { label: "Sobre", value: "#about", Icon: Hash, group: "anchor" },
  { label: "Contato", value: "#contact", Icon: Hash, group: "anchor" },
];

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  email: Mail,
  linkedin: Linkedin,
  facebook: Facebook,
};

const SOCIAL_LABEL_MAP: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  email: "E-mail",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

const SOCIAL_PREFIX_MAP: Record<string, string> = {
  whatsapp: "https://wa.me/",
  instagram: "https://instagram.com/",
  email: "mailto:",
  linkedin: "https://linkedin.com/",
  facebook: "https://facebook.com/",
};

interface LinkDestinationSelectProps {
  value: string;
  onChange: (url: string) => void;
  content: Record<string, string>;
  placeholder?: string;
}

export function LinkDestinationSelect({
  value,
  onChange,
  content,
  placeholder = "Escolha o destino",
}: LinkDestinationSelectProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build social options from content.social_* fields
  const socialOptions = useMemo(() => {
    const opts: OptionItem[] = [];
    const types = ["whatsapp", "instagram", "email", "linkedin", "facebook"] as const;
    for (const type of types) {
      const raw = content[`social_${type}`]?.trim();
      if (!raw) continue;
      const prefix = SOCIAL_PREFIX_MAP[type];
      const cleanVal = type === "whatsapp" ? raw.replace(/\D/g, "") : raw;
      opts.push({
        label: SOCIAL_LABEL_MAP[type],
        value: `${prefix}${cleanVal}`,
        Icon: SOCIAL_ICON_MAP[type],
        group: "social",
      });
    }
    return opts;
  }, [content]);

  const allOptions = [...socialOptions, ...ANCHOR_OPTIONS];

  // Derive display label from current value
  const currentOption = allOptions.find((o) => o.value === value);
  const isCustom = value && !currentOption;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCustomMode(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleSelect(opt: OptionItem) {
    onChange(opt.value);
    setOpen(false);
    setCustomMode(false);
  }

  function handleCustom() {
    setCustomMode(true);
  }

  return (
    <div ref={containerRef} className="relative mt-1">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setCustomMode(false); }}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm text-[var(--platform-text)] transition hover:border-white/20"
      >
        <span className="flex items-center gap-2 truncate">
          {currentOption ? (
            <>
              <currentOption.Icon size={14} className="shrink-0 opacity-60" />
              <span>{currentOption.label}</span>
            </>
          ) : isCustom ? (
            <>
              <ExternalLink size={14} className="shrink-0 opacity-60" />
              <span className="truncate">{value}</span>
            </>
          ) : (
            <span className="opacity-40">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={14} className={`shrink-0 opacity-40 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-30 mt-1 w-full rounded-xl border border-white/10 bg-[#1A2035] p-1.5 shadow-xl"
          >
            {/* Social links */}
            {socialOptions.length > 0 && (
              <>
                <p className="px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">
                  Seus canais
                </p>
                {socialOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                      value === opt.value ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-[var(--platform-text)] hover:bg-white/[0.06]"
                    }`}
                  >
                    <opt.Icon size={14} className="shrink-0" />
                    {opt.label}
                  </button>
                ))}
              </>
            )}

            {/* Anchors */}
            <p className="mt-1 px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">
              Seções do site
            </p>
            {ANCHOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                  value === opt.value ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-[var(--platform-text)] hover:bg-white/[0.06]"
                }`}
              >
                <opt.Icon size={14} className="shrink-0" />
                {opt.label}
              </button>
            ))}

            {/* Custom URL */}
            <div className="mt-1 border-t border-white/10 pt-1">
              {customMode ? (
                <input
                  type="text"
                  autoFocus
                  value={isCustom ? value : ""}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setOpen(false); setCustomMode(false); } }}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleCustom}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                    isCustom ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-[var(--platform-text)] hover:bg-white/[0.06]"
                  }`}
                >
                  <Link2 size={14} className="shrink-0" />
                  Link personalizado
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
