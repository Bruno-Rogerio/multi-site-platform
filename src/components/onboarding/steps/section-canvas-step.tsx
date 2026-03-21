"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  Trash2,
  Plus,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { heroVariants, servicesVariants, ctaVariants, testimonialsVariants, galleryVariants, faqVariants, blogVariants, eventsVariants, statsVariants } from "@/lib/onboarding/section-styles";
import { ctaTypes } from "@/lib/onboarding/cta-types";
import type { CtaTypeId } from "@/lib/onboarding/types";
import * as LucideIcons from "lucide-react";
import { moveInArray } from "@/lib/onboarding/helpers";

/* ─── Section metadata ─── */

type SectionMeta = {
  id: string;
  label: string;
  emoji: string;
  accent: string;
  removable: boolean;
  variants?: { id: string; name: string; description: string; premium: boolean }[];
  variantKey?: keyof { heroVariant: string; servicesVariant: string; ctaVariant: string; testimonialsVariant: string; galleryVariant: string; faqVariant: string; blogVariant: string; eventsVariant: string; statsVariant: string };
  variantAction?: "SET_HERO_VARIANT" | "SET_SERVICES_VARIANT" | "SET_CTA_VARIANT" | "SET_TESTIMONIALS_VARIANT" | "SET_GALLERY_VARIANT" | "SET_FAQ_VARIANT" | "SET_BLOG_VARIANT" | "SET_EVENTS_VARIANT" | "SET_STATS_VARIANT";
};

const SECTION_META: Record<string, SectionMeta> = {
  hero:         { id: "hero",         label: "Hero",        emoji: "🎯", accent: "#22D3EE", removable: false, variants: heroVariants,     variantKey: "heroVariant",     variantAction: "SET_HERO_VARIANT" },
  services:     { id: "services",     label: "Serviços",    emoji: "🧩", accent: "#7C5CFF", removable: true,  variants: servicesVariants, variantKey: "servicesVariant", variantAction: "SET_SERVICES_VARIANT" },
  about:        { id: "about",        label: "Sobre mim",   emoji: "👤", accent: "#3B82F6", removable: true },
  testimonials: { id: "testimonials", label: "Depoimentos", emoji: "⭐", accent: "#F59E0B", removable: true, variants: testimonialsVariants, variantKey: "testimonialsVariant", variantAction: "SET_TESTIMONIALS_VARIANT" },
  cta:          { id: "cta",          label: "CTA",         emoji: "📣", accent: "#10B981", removable: true,  variants: ctaVariants,      variantKey: "ctaVariant",      variantAction: "SET_CTA_VARIANT" },
  contact:      { id: "contact",      label: "Contato",     emoji: "📞", accent: "#22D3EE", removable: false },
  blog:         { id: "blog",         label: "Blog",        emoji: "📝", accent: "#EC4899", removable: true, variants: blogVariants, variantKey: "blogVariant", variantAction: "SET_BLOG_VARIANT" },
  gallery:      { id: "gallery",      label: "Galeria",     emoji: "🖼️", accent: "#6366F1", removable: true, variants: galleryVariants, variantKey: "galleryVariant", variantAction: "SET_GALLERY_VARIANT" },
  faq:          { id: "faq",          label: "FAQ",         emoji: "❓", accent: "#F59E0B", removable: true, variants: faqVariants, variantKey: "faqVariant", variantAction: "SET_FAQ_VARIANT" },
  events:       { id: "events",       label: "Agenda",      emoji: "📅", accent: "#10B981", removable: true, variants: eventsVariants, variantKey: "eventsVariant", variantAction: "SET_EVENTS_VARIANT" },
  stats:        { id: "stats",        label: "Números",     emoji: "📊", accent: "#22D3EE", removable: true, variants: statsVariants,  variantKey: "statsVariant",  variantAction: "SET_STATS_VARIANT"  },
};

const ALL_ADDABLE = ["services", "about", "stats", "testimonials", "cta", "blog", "gallery", "faq", "events"];

/* ─── Header style options ─── */

const HEADER_STYLE_OPTIONS = [
  { id: "blur",     label: "Vidro",     desc: "Blur + transparência" },
  { id: "solid",    label: "Sólido",    desc: "Cor de destaque" },
  { id: "minimal",  label: "Minimal",   desc: "Sem fundo" },
  { id: "gradient", label: "Gradiente", desc: "Primary → Accent" },
  { id: "dark",     label: "Escuro",    desc: "Sempre escuro" },
] as const;

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(59,130,246,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── Variant dropdown ─── */

function VariantDropdown({
  variants,
  selectedId,
  onSelect,
}: {
  variants: { id: string; name: string; description: string; premium: boolean }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = variants.find(v => v.id === selectedId) ?? variants[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/70 transition hover:border-white/20 hover:text-[var(--platform-text)]"
      >
        <span>{selected?.name ?? "Layout"}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-[#151E35] shadow-xl"
            >
              {variants.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { onSelect(v.id); setOpen(false); }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs transition hover:bg-white/[0.06] ${
                    v.id === selectedId ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-[var(--platform-text)]"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{v.name}</p>
                    <p className="text-[10px] text-[var(--platform-text)]/40 leading-tight">{v.description}</p>
                  </div>
                  {v.id === selectedId && <Check size={12} className="shrink-0 text-[#22D3EE]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section block ─── */

function SectionBlock({
  sectionId,
  index,
  total,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  sectionId: string;
  index: number;
  total: number;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const { state, dispatch } = useWizard();
  const meta = SECTION_META[sectionId];
  if (!meta) return null;

  const currentVariant = meta.variantKey ? (state[meta.variantKey] as string) : "";

  function handleVariantSelect(id: string) {
    if (meta.variantAction === "SET_HERO_VARIANT") dispatch({ type: "SET_HERO_VARIANT", variant: id });
    if (meta.variantAction === "SET_SERVICES_VARIANT") dispatch({ type: "SET_SERVICES_VARIANT", variant: id });
    if (meta.variantAction === "SET_CTA_VARIANT") dispatch({ type: "SET_CTA_VARIANT", variant: id });
    if (meta.variantAction === "SET_TESTIMONIALS_VARIANT") dispatch({ type: "SET_TESTIMONIALS_VARIANT", variant: id });
    if (meta.variantAction === "SET_GALLERY_VARIANT") dispatch({ type: "SET_GALLERY_VARIANT", variant: id });
    if (meta.variantAction === "SET_FAQ_VARIANT") dispatch({ type: "SET_FAQ_VARIANT", variant: id });
    if (meta.variantAction === "SET_BLOG_VARIANT") dispatch({ type: "SET_BLOG_VARIANT", variant: id });
    if (meta.variantAction === "SET_EVENTS_VARIANT") dispatch({ type: "SET_EVENTS_VARIANT", variant: id });
    if (meta.variantAction === "SET_STATS_VARIANT") dispatch({ type: "SET_STATS_VARIANT", variant: id });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group rounded-xl border bg-[#0F1628] p-3 transition-all ${
        isDropTarget
          ? "border-[#22D3EE]/50 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
          : "border-white/8 hover:border-white/15"
      }`}
    >
      {/* Top row: accent + handle + label + delete */}
      <div className="flex items-center gap-3">
        {/* Colored accent bar */}
        <div
          className="h-8 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: meta.accent, opacity: 0.7 }}
        />

        {/* Drag handle */}
        <div className="cursor-grab text-[var(--platform-text)]/20 transition group-hover:text-[var(--platform-text)]/40 active:cursor-grabbing">
          <GripVertical size={16} />
        </div>

        {/* Emoji + label */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-base leading-none">{meta.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-[var(--platform-text)] leading-tight">{meta.label}</p>
            {!meta.removable && (
              <p className="text-[10px] text-[var(--platform-text)]/30 leading-tight">Obrigatório</p>
            )}
          </div>
        </div>

        {/* Delete button */}
        {meta.removable ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "REMOVE_SECTION", sectionType: sectionId })}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--platform-text)]/20 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <div className="h-7 w-7 shrink-0" />
        )}
      </div>

      {/* Variant dropdown — second row */}
      {meta.variants && meta.variantAction && (
        <div className="mt-2 ml-9">
          <VariantDropdown
            variants={meta.variants}
            selectedId={currentVariant}
            onSelect={handleVariantSelect}
          />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Add section popup ─── */

function AddSectionPopup({
  enabledSections,
  onAdd,
  onClose,
}: {
  enabledSections: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}) {
  const available = ALL_ADDABLE.filter(id => !enabledSections.includes(id));

  if (available.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="absolute bottom-full left-0 right-0 mb-2 z-30 rounded-xl border border-white/10 bg-[#151E35] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[var(--platform-text)]">Todas as seções ativas!</p>
          <button type="button" onClick={onClose} className="text-[var(--platform-text)]/40 hover:text-[var(--platform-text)]">
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-[var(--platform-text)]/50">Você já tem todas as seções disponíveis no seu site.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 z-30 mb-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#151E35] shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-[var(--platform-text)]">Adicionar seção</p>
        <button type="button" onClick={onClose} className="text-[var(--platform-text)]/40 hover:text-[var(--platform-text)]">
          <X size={14} />
        </button>
      </div>
      <div className="p-2">
        {available.map(id => {
          const meta = SECTION_META[id];
          if (!meta) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => { onAdd(id); onClose(); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
            >
              <span className="text-xl leading-none">{meta.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--platform-text)]">{meta.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Contact channels card ─── */

function ContactChannelsCard() {
  const { state, dispatch } = useWizard();
  const { selectedCtaTypes, ctaConfig, floatingCtaEnabled, floatingCtaChannels } = state;

  function handleToggle(id: CtaTypeId) {
    dispatch({ type: "TOGGLE_CTA_TYPE", ctaTypeId: id });
  }

  function handleUrlChange(id: CtaTypeId, url: string) {
    const ctaType = ctaTypes.find(c => c.id === id);
    dispatch({
      type: "SET_CTA_CONFIG",
      ctaTypeId: id,
      config: { label: ctaType?.label ?? id, url },
    });
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Canais de contato</h3>
          <p className="text-xs text-[var(--platform-text)]/50">
            Como seus visitantes entram em contato com você
          </p>
        </div>
        {/* Floating toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--platform-text)]/50">Flutuante</span>
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_FLOATING_CTA", enabled: !floatingCtaEnabled })}
            className={`relative h-5 w-9 rounded-full transition ${floatingCtaEnabled ? "bg-[#22D3EE]" : "bg-white/10"}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${floatingCtaEnabled ? "left-4" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Channel toggle buttons */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {ctaTypes.map(cta => {
          const isSelected = selectedCtaTypes.includes(cta.id);
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cta.icon];

          return (
            <button
              key={cta.id}
              type="button"
              onClick={() => handleToggle(cta.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
                isSelected
                  ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {Icon && <Icon size={16} className={isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]/50"} />}
              <span className={`text-[10px] font-medium ${isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]/50"}`}>
                {cta.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* URL inputs for selected channels */}
      {selectedCtaTypes.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {selectedCtaTypes.map(ctaId => {
            const ctaType = ctaTypes.find(c => c.id === ctaId);
            if (!ctaType) return null;
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[ctaType.icon];
            const currentValue = ctaConfig[ctaId]?.url ?? "";

            return (
              <div key={ctaId} className="flex items-center gap-2">
                {Icon && <Icon size={14} className="shrink-0 text-[#22D3EE]" />}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--platform-text)]/40 pointer-events-none select-none">
                    {ctaType.urlPrefix}
                  </span>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={e => handleUrlChange(ctaId, e.target.value)}
                    placeholder={ctaType.placeholder}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pr-3 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                    style={{ paddingLeft: `${ctaType.urlPrefix.length * 7 + 16}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating channel selector */}
      {floatingCtaEnabled && selectedCtaTypes.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="mb-2 text-xs text-[var(--platform-text)]/50">
            Canais no botão flutuante ({floatingCtaChannels.length}/2)
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCtaTypes.map(ctaId => {
              const def = ctaTypes.find(c => c.id === ctaId);
              if (!def) return null;
              const isInFloating = floatingCtaChannels.includes(ctaId);
              const canAdd = isInFloating || floatingCtaChannels.length < 2;
              const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[def.icon];
              return (
                <button
                  key={ctaId}
                  type="button"
                  onClick={() => {
                    if (isInFloating) {
                      dispatch({ type: "SET_FLOATING_CTA_CHANNELS", channels: floatingCtaChannels.filter(id => id !== ctaId) });
                    } else if (canAdd) {
                      dispatch({ type: "SET_FLOATING_CTA_CHANNELS", channels: [...floatingCtaChannels, ctaId] });
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                    isInFloating
                      ? "border-[#22D3EE]/50 bg-[#22D3EE]/10 text-[#22D3EE]"
                      : canAdd
                      ? "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"
                      : "border-white/5 text-[var(--platform-text)]/30 cursor-not-allowed"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {def.label}
                  {isInFloating && <Check size={10} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Header style picker ─── */

function HeaderStylePicker() {
  const { state, dispatch } = useWizard();
  const { headerStyle, paletteId, customColors } = state;

  // Get colors from state for the mini-preview
  const primaryColor = paletteId === "custom" ? customColors.primary : (() => {
    const p = { buildsphere: "#3B82F6", "midnight-violet": "#7C5CFF", "aurora-soft": "#2563EB", "solar-pop": "#F59E0B", "mint-cloud": "#0D9488", "dark-tech": "#00E5FF", "editorial-dark": "#F0E6D3", "corporate-navy": "#1B2A4A", "rose-luxe": "#E11D48", "forest-trust": "#15803D", "mono-pro": "#111827", "ocean-deep": "#0EA5E9", "warm-premium": "#C2410C" } as Record<string, string>;
    return p[paletteId] ?? "#3B82F6";
  })();
  const accentColor = paletteId === "custom" ? customColors.accent : (() => {
    const a = { buildsphere: "#22D3EE", "midnight-violet": "#38BDF8", "aurora-soft": "#A78BFA", "solar-pop": "#F97316", "mint-cloud": "#14B8A6", "dark-tech": "#7C3AED", "editorial-dark": "#FF4444", "corporate-navy": "#B8962E", "rose-luxe": "#FB7185", "forest-trust": "#22C55E", "mono-pro": "#52525B", "ocean-deep": "#06B6D4", "warm-premium": "#FB7185" } as Record<string, string>;
    return a[paletteId] ?? "#22D3EE";
  })();
  const bgColor = paletteId === "custom" ? customColors.background : (() => {
    const b = { buildsphere: "#0B1020", "midnight-violet": "#111827", "aurora-soft": "#F8FAFC", "solar-pop": "#111827", "mint-cloud": "#F0FDFA", "dark-tech": "#0D1117", "editorial-dark": "#0C0C0C", "corporate-navy": "#FAFAFA", "rose-luxe": "#1F1022", "forest-trust": "#0F172A", "mono-pro": "#FAFAFA", "ocean-deep": "#082F49", "warm-premium": "#1C1917" } as Record<string, string>;
    return b[paletteId] ?? "#0B1020";
  })();

  const isDark = bgColor.startsWith("#0") || bgColor.startsWith("#1") || bgColor === "#FAFAFA" ? bgColor === "#FAFAFA" ? false : true : false;

  function getHeaderBg(styleId: string): string {
    switch (styleId) {
      case "blur":     return hexToRgba(primaryColor, 0.15);
      case "solid":    return primaryColor;
      case "minimal":  return "transparent";
      case "gradient": return `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
      case "dark":     return "#0B1020";
      default:         return primaryColor;
    }
  }

  function getLogoColor(styleId: string): string {
    return styleId === "solid" || styleId === "gradient" || styleId === "dark"
      ? "rgba(255,255,255,0.85)"
      : primaryColor;
  }

  function getNavColor(styleId: string): string {
    return styleId === "solid" || styleId === "gradient" || styleId === "dark"
      ? "rgba(255,255,255,0.4)"
      : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  }

  function getCtaBtnColor(styleId: string): string {
    return styleId === "solid" || styleId === "gradient" || styleId === "dark"
      ? "rgba(255,255,255,0.2)"
      : hexToRgba(primaryColor, 0.25);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-[var(--platform-text)]">Estilo do cabeçalho</h3>
      <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">Como o menu aparece sobre o conteúdo do site</p>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {HEADER_STYLE_OPTIONS.map((s) => {
          const isActive = (headerStyle || "blur") === s.id;
          const headerBg = getHeaderBg(s.id);
          const logoColor = getLogoColor(s.id);
          const navColor = getNavColor(s.id);
          const ctaColor = getCtaBtnColor(s.id);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => dispatch({ type: "SET_HEADER_STYLE", style: s.id as "blur" | "solid" | "minimal" | "gradient" | "dark" })}
              className={`group overflow-hidden rounded-xl border text-left transition ${
                isActive
                  ? "border-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* Mini page preview */}
              <div
                className="relative h-16 w-full overflow-hidden"
                style={{ background: bgColor }}
              >
                {/* Simulated page content (hero text lines) */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 pb-2">
                  <div className="h-1.5 w-14 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }} />
                  <div className="h-1 w-10 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                  <div
                    className="mt-0.5 h-4 w-12 rounded-md"
                    style={{ background: hexToRgba(primaryColor, 0.4) }}
                  />
                </div>

                {/* Header bar */}
                <div
                  className="absolute inset-x-0 top-0 flex h-7 items-center justify-between px-2"
                  style={{
                    background: headerBg,
                    borderBottom: s.id === "minimal" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: logoColor }}
                    />
                    <div
                      className="h-1.5 w-7 rounded-full"
                      style={{ background: logoColor, opacity: 0.75 }}
                    />
                  </div>
                  {/* Nav + CTA */}
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-4 rounded-full" style={{ background: navColor }} />
                    <div className="h-1 w-4 rounded-full" style={{ background: navColor }} />
                    <div
                      className="h-3.5 w-8 rounded"
                      style={{ background: ctaColor }}
                    />
                  </div>
                </div>

                {/* Active ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-t-xl ring-1 ring-inset ring-[#22D3EE]/40 pointer-events-none" />
                )}
              </div>

              {/* Label */}
              <div className="px-2 py-2 bg-[#0F1628]">
                <p className={`text-[11px] font-semibold leading-tight ${isActive ? "text-[#22D3EE]" : "text-[var(--platform-text)]/70"}`}>
                  {s.label}
                </p>
                <p className="text-[10px] text-[var(--platform-text)]/35 leading-tight">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main step ─── */

export function SectionCanvasStep() {
  const { state, dispatch } = useWizard();
  const { enabledSections, selectedCtaTypes } = state;

  // DnD state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<number | null>(null);

  // Add section popup
  const [addOpen, setAddOpen] = useState(false);

  function handleDragStart(index: number) {
    dragNodeRef.current = index;
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragNodeRef.current === null || dragNodeRef.current === index) return;
    setDropTargetIndex(index);
  }

  function handleDrop(index: number) {
    if (dragNodeRef.current === null || dragNodeRef.current === index) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }
    const reordered = moveInArray(enabledSections, dragNodeRef.current, index);
    dispatch({ type: "REORDER_SECTIONS", sections: reordered });
    setDraggedIndex(null);
    setDropTargetIndex(null);
    dragNodeRef.current = null;
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDropTargetIndex(null);
    dragNodeRef.current = null;
  }

  function handleAddSection(id: string) {
    dispatch({ type: "ADD_SECTION", sectionType: id });
  }

  const canProceed = selectedCtaTypes.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Estrutura do site
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Monte seu site
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Configure seus canais de contato e arraste as seções para definir a ordem do site.
        </p>
      </div>

      <div className="space-y-5">
        {/* Contact channels */}
        <ContactChannelsCard />

        {/* Canvas */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">Seções do site</h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                Arraste para reordenar · Clique em Layout para trocar o estilo
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-[var(--platform-text)]/50">
              {enabledSections.length} seções
            </span>
          </div>

          {/* Section blocks */}
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {enabledSections.map((sectionId, index) => (
                <SectionBlock
                  key={sectionId}
                  sectionId={sectionId}
                  index={index}
                  total={enabledSections.length}
                  isDragging={draggedIndex === index}
                  isDropTarget={dropTargetIndex === index && draggedIndex !== index}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Add section button */}
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setAddOpen(o => !o)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-3 text-sm font-medium text-[var(--platform-text)]/40 transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
            >
              <Plus size={16} />
              Adicionar seção
            </button>

            <AnimatePresence>
              {addOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setAddOpen(false)}
                  />
                  <AddSectionPopup
                    enabledSections={enabledSections}
                    onAdd={handleAddSection}
                    onClose={() => setAddOpen(false)}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Header style */}
        <HeaderStylePicker />

        {/* Tip */}
        {!canProceed && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400"
          >
            Selecione pelo menos um canal de contato para continuar.
          </motion.div>
        )}
      </div>

      <StepNavigation canProceed={canProceed} />
    </div>
  );
}
