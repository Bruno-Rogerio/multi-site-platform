"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ImageUpload } from "../builders/image-upload";
import { IconPickerInline } from "../builders/icon-picker";
import { LinkDestinationSelect } from "../builders/link-destination-select";
import { getTemplateBySlug } from "@/lib/onboarding/templates";
import {
  MessageCircle,
  Instagram,
  Mail,
  Linkedin,
  Facebook,
  Plus,
  Trash2,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { moveInArray } from "@/lib/onboarding/helpers";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { getServiceCardsLimit } from "@/lib/onboarding/premium-gate";

function str(v: unknown): string { return String(v ?? ""); }

type Testimonial = { quote: string; author: string };

/* ─── Helpers de layout ─── */

const inputClass = "mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none";
const labelClass = "text-xs font-medium text-[var(--platform-text)]/60";

/* ─── Accordion section wrapper ─── */

function AccordionSection({
  id,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <div>
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--platform-text)]/50">{subtitle}</p>}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--platform-text)]/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="border-t border-white/10 px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

/* ─── Upload de imagem inline (sem preview grande) ─── */

function ImageWithFocalControl({
  uploadSlot,
  imageUrl,
  objectPosition,
  onChangeUrl,
  onChangePosition,
  uploadLabel = "Adicionar imagem (opcional)",
}: {
  uploadSlot: string;
  imageUrl: string;
  objectPosition: string;
  onChangeUrl: (url: string) => void;
  onChangePosition: (pos: string) => void;
  uploadLabel?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setUploadError("Apenas imagens"); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("Máximo 5 MB"); return; }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slot", uploadSlot);
      const res = await fetch("/api/onboarding/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload");
      onChangeUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); if (e.target) e.target.value = ""; }}
    />
  );

  if (!imageUrl) {
    return (
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-white/15 px-3 py-2.5 text-xs text-[var(--platform-text)]/40 transition hover:border-[#22D3EE]/30 hover:text-[#22D3EE]/60"
        >
          {uploading ? (
            <span className="animate-pulse">Enviando…</span>
          ) : (
            <><span className="text-sm">🖼</span> Adicionar imagem ao card (opcional)</>
          )}
        </button>
        {uploadError && <p className="mt-1 text-[10px] text-red-400">{uploadError}</p>}
        {hiddenInput}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <ImageFocalPointPicker
        imageUrl={imageUrl}
        value={objectPosition || "50% 50%"}
        onChange={onChangePosition}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[10px] text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]/70"
        >
          {uploading ? "Enviando…" : "Trocar imagem"}
        </button>
        <button
          type="button"
          onClick={() => onChangeUrl("")}
          className="text-[10px] text-red-400/50 transition hover:text-red-400"
        >
          Remover
        </button>
      </div>
      {uploadError && <p className="text-[10px] text-red-400">{uploadError}</p>}
      {hiddenInput}
    </div>
  );
}

/* ─── Image focal point picker (drag livre) ─── */

function parsePos(val: string): { x: number; y: number } {
  if (!val) return { x: 50, y: 50 };
  const named = (s: string, axis: "x" | "y") => {
    if (s === "left" || s === "top") return 0;
    if (s === "right" || s === "bottom") return 100;
    if (s === "center") return 50;
    const n = parseFloat(s);
    return isNaN(n) ? 50 : n;
  };
  const parts = val.trim().split(/\s+/);
  return { x: named(parts[0] ?? "50%", "x"), y: named(parts[1] ?? "50%", "y") };
}

function ImageFocalPointPicker({
  imageUrl,
  value,
  onChange,
}: {
  imageUrl: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pos = parsePos(value);

  function updateFromClient(clientX: number, clientY: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)));
    onChange(`${x}% ${y}%`);
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    updateFromClient(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => { if (dragging.current) updateFromClient(ev.clientX, ev.clientY); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    updateFromClient(t.clientX, t.clientY);
    const onMove = (ev: TouchEvent) => { const t2 = ev.touches[0]; if (t2) updateFromClient(t2.clientX, t2.clientY); };
    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
  }

  return (
    <div>
      <p className={`${labelClass} mb-1.5`}>Posição da imagem — arraste para reposicionar</p>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-28 w-full overflow-hidden rounded-lg cursor-crosshair select-none"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <img
          src={imageUrl}
          alt="focal point"
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
          style={{ objectPosition: value || "50% 50%" }}
        />
        {/* Linhas de mira */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${pos.x}%`, background: "rgba(255,255,255,0.35)" }}
          />
          <div
            className="absolute left-0 right-0 h-px"
            style={{ top: `${pos.y}%`, background: "rgba(255,255,255,0.35)" }}
          />
        </div>
        {/* Ponto focal */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            background: "rgba(34,211,238,0.5)",
            boxShadow: "0 0 0 1.5px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)",
          }}
        />
        {/* Hint */}
        <div className="pointer-events-none absolute bottom-1.5 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/70">
          arraste
        </div>
      </div>
      <p className="mt-1 text-[10px] text-[var(--platform-text)]/30">{value || "50% 50%"}</p>
    </div>
  );
}

/* ─── Section reorder list ─── */

const SECTION_META_BASIC: Record<string, { label: string; emoji: string; accent: string; fixed?: boolean }> = {
  hero:         { label: "Capa",           emoji: "🎯", accent: "#22D3EE", fixed: true },
  services:     { label: "Serviços",       emoji: "🧩", accent: "#7C5CFF" },
  stats:        { label: "Números",        emoji: "📊", accent: "#22D3EE" },
  about:        { label: "Sobre você",     emoji: "👤", accent: "#3B82F6" },
  cta:          { label: "Call to Action", emoji: "📣", accent: "#10B981" },
  testimonials: { label: "Depoimentos",    emoji: "⭐", accent: "#F59E0B" },
  contact:      { label: "Contato",        emoji: "📞", accent: "#22D3EE", fixed: true },
};

const STARTER_SECTION_TYPES = ["hero", "services", "cta", "contact"] as const;

function SectionOrderCard() {
  const { state, dispatch } = useWizard();
  const isStarterPlan = state.selectedPlan === "starter";
  const sections = isStarterPlan
    ? state.enabledSections.filter((s) => (STARTER_SECTION_TYPES as readonly string[]).includes(s))
    : state.enabledSections;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<number | null>(null);

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
    const reordered = moveInArray(sections, dragNodeRef.current, index);
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

  return (
    <div className="space-y-1.5">
      {sections.map((id, index) => {
        const meta = SECTION_META_BASIC[id] ?? { label: id, emoji: "📄", accent: "#666" };
        const isFixed = meta.fixed === true;
        const isDragging = draggedIndex === index;
        const isDropTarget = dropTargetIndex === index;

        return (
          <div
            key={id}
            draggable={!isFixed}
            onDragStart={!isFixed ? () => handleDragStart(index) : undefined}
            onDragOver={!isFixed ? (e) => handleDragOver(e, index) : undefined}
            onDrop={!isFixed ? () => handleDrop(index) : undefined}
            onDragEnd={!isFixed ? handleDragEnd : undefined}
            className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-all select-none ${
              isDropTarget
                ? "border-[#22D3EE]/50 shadow-[0_0_10px_rgba(34,211,238,0.12)] bg-[#22D3EE]/5"
                : isFixed
                ? "border-white/5 bg-white/[0.01]"
                : "border-white/8 bg-white/[0.02] hover:border-white/15"
            } ${isDragging ? "opacity-40" : ""}`}
          >
            <div className="h-7 w-1 shrink-0 rounded-full" style={{ backgroundColor: meta.accent, opacity: 0.7 }} />
            {isFixed ? (
              <div className="w-4 shrink-0" />
            ) : (
              <div className="cursor-grab text-[var(--platform-text)]/25 hover:text-[var(--platform-text)]/50 active:cursor-grabbing">
                <GripVertical size={15} />
              </div>
            )}
            <span className="text-sm">{meta.emoji}</span>
            <span className="flex-1 text-sm text-[var(--platform-text)]">{meta.label}</span>
            {isFixed && <span className="text-[10px] text-[var(--platform-text)]/25">fixo</span>}
          </div>
        );
      })}
      <p className="text-[10px] text-[var(--platform-text)]/30">
        Arraste para reordenar • Alterações refletem em tempo real no preview
      </p>
    </div>
  );
}

/* ─── Main component ─── */

export function TemplateContentEditor() {
  const { state, dispatch } = useWizard();
  const { selectedTemplateSlug, content, serviceCards, selectedPlan } = state;
  const isStarterPlan = selectedPlan === "starter";
  const serviceCardsLimit = getServiceCardsLimit(selectedPlan ?? null);

  // Accordion state — default: first section open
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["order", "contacts"]));
  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Local testimonials state — synced to content.testimonialsJson
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const parsed = JSON.parse(str(content.testimonialsJson) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [testimonialPage, setTestimonialPage] = useState(0);
  const TESTIMONIALS_PER_PAGE = 3;

  function updateTestimonials(newList: Testimonial[]) {
    setTestimonials(newList);
    dispatch({ type: "UPDATE_CONTENT", key: "testimonialsJson", value: JSON.stringify(newList) });
  }

  function addTestimonial() {
    if (testimonials.length >= 10) return;
    const newIndex = testimonials.length;
    updateTestimonials([...testimonials, { quote: "", author: "" }]);
    setTestimonialPage(Math.floor(newIndex / TESTIMONIALS_PER_PAGE));
  }

  function removeTestimonial(index: number) {
    const next = testimonials.filter((_, i) => i !== index);
    updateTestimonials(next);
    const newPageCount = Math.max(1, Math.ceil(next.length / TESTIMONIALS_PER_PAGE));
    if (testimonialPage >= newPageCount) setTestimonialPage(newPageCount - 1);
  }

  function updateTestimonialField(index: number, field: keyof Testimonial, value: string) {
    const next = testimonials.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    updateTestimonials(next);
  }

  const template = selectedTemplateSlug ? getTemplateBySlug(selectedTemplateSlug) : null;

  useEffect(() => {
    if (template && !state.businessSegment) {
      dispatch({ type: "UPDATE_CONTENT", key: "heroEyebrow", value: template.defaultContent.heroEyebrow });
      dispatch({ type: "UPDATE_CONTENT", key: "heroTitle", value: template.defaultContent.heroTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "heroSubtitle", value: template.defaultContent.heroSubtitle });
      dispatch({ type: "UPDATE_CONTENT", key: "heroCtaLabel", value: template.defaultContent.heroCtaLabel });
      dispatch({ type: "UPDATE_CONTENT", key: "servicesTitle", value: template.defaultContent.servicesTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaTitle", value: template.defaultContent.ctaTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaDescription", value: template.defaultContent.ctaDescription });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaButtonLabel", value: template.defaultContent.ctaButtonLabel });

      if (template.defaultContent.statsItems && template.defaultContent.statsItems.length > 0) {
        dispatch({ type: "SET_CONTENT_ARRAY", key: "statsItems", value: template.defaultContent.statsItems });
      }

      const items = template.defaultContent.serviceItems;
      items.forEach((item, i) => {
        if (i < serviceCards.length) {
          dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { title: item } });
        }
      });
    }
  }, [template?.slug]);

  function handleContentChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  // Stats helpers
  const statsItems = (state.content.statsItems as Array<{ value: string; label: string }>) ?? [];

  function updateStatsItem(index: number, field: "value" | "label", value: string) {
    const updated = statsItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "statsItems", value: updated });
  }

  const paletteColors = [
    state.customColors?.primary,
    state.customColors?.accent,
    state.customColors?.text,
  ].filter((c): c is string => Boolean(c));

  // Extra lines helpers
  function addExtraLine(cardIndex: number) {
    const card = serviceCards[cardIndex];
    const current = card.extraLines ?? [];
    dispatch({ type: "UPDATE_SERVICE_CARD", index: cardIndex, data: { extraLines: [...current, ""] } });
  }

  function updateExtraLine(cardIndex: number, lineIndex: number, value: string) {
    const card = serviceCards[cardIndex];
    const current = [...(card.extraLines ?? [])];
    current[lineIndex] = value;
    dispatch({ type: "UPDATE_SERVICE_CARD", index: cardIndex, data: { extraLines: current } });
  }

  function removeExtraLine(cardIndex: number, lineIndex: number) {
    const card = serviceCards[cardIndex];
    const current = (card.extraLines ?? []).filter((_, i) => i !== lineIndex);
    dispatch({ type: "UPDATE_SERVICE_CARD", index: cardIndex, data: { extraLines: current } });
  }

  // Registered social links for contact section
  const registeredLinks = useMemo(() => {
    const links: { type: string; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [];
    if (str(content.social_whatsapp).trim()) links.push({ type: "whatsapp", label: "WhatsApp", Icon: MessageCircle });
    if (str(content.social_instagram).trim()) links.push({ type: "instagram", label: "Instagram", Icon: Instagram });
    if (str(content.social_email).trim()) links.push({ type: "email", label: "E-mail", Icon: Mail });
    if (str(content.social_linkedin).trim()) links.push({ type: "linkedin", label: "LinkedIn", Icon: Linkedin });
    if (str(content.social_facebook).trim()) links.push({ type: "facebook", label: "Facebook", Icon: Facebook });
    return links;
  }, [content.social_whatsapp, content.social_instagram, content.social_email, content.social_linkedin, content.social_facebook]);

  // Auto-sync: all registered channels are always shown in the contact section
  useEffect(() => {
    const allTypes = registeredLinks.map((l) => l.type);
    const current = state.contactSelectedLinks;
    const same = allTypes.length === current.length && allTypes.every((t) => current.includes(t));
    if (!same) {
      dispatch({ type: "SET_CONTACT_SELECTED_LINKS", links: allTypes });
    }
    // Also prune floating channels that no longer have a registered link
    const validFloating = state.floatingCtaChannels.filter((c) => allTypes.includes(c));
    if (validFloating.length !== state.floatingCtaChannels.length) {
      dispatch({ type: "SET_FLOATING_CTA_CHANNELS", channels: validFloating });
      dispatch({ type: "SET_FLOATING_CTA", enabled: validFloating.length > 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredLinks.map((l) => l.type).join(",")]);

  function toggleFloatingChannel(type: string) {
    const ctaType = type as import("@/lib/onboarding/types").CtaTypeId;
    const isFloating = state.floatingCtaChannels.includes(ctaType);
    const newChannels = isFloating
      ? state.floatingCtaChannels.filter((c) => c !== ctaType)
      : [...state.floatingCtaChannels, ctaType];
    dispatch({ type: "SET_FLOATING_CTA_CHANNELS", channels: newChannels });
    dispatch({ type: "SET_FLOATING_CTA", enabled: newChannels.length > 0 });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Personalize o conteúdo
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Seu site, seus textos
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Edite os textos para deixar com a sua cara. O visual do template será mantido.
        </p>
      </div>

      <div className="space-y-3">

        {/* ─── 0. Ordem das seções ─── */}
        <AccordionSection
          id="order"
          title="Ordem das seções"
          subtitle="Defina a sequência do conteúdo no seu site"
          isOpen={openSections.has("order")}
          onToggle={toggleSection}
        >
          <SectionOrderCard />
        </AccordionSection>

        {/* ─── 1. Canais de contato ─── */}
        <AccordionSection
          id="contacts"
          title="Seus canais de contato"
          subtitle="WhatsApp, Instagram, e-mail…"
          isOpen={openSections.has("contacts")}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            {/* WhatsApp */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <MessageCircle size={12} /> WhatsApp
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  wa.me/
                </span>
                <input
                  type="text"
                  value={str(content.social_whatsapp)}
                  onChange={(e) => handleContentChange("social_whatsapp", e.target.value)}
                  placeholder="5511999999999"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <Instagram size={12} /> Instagram
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  instagram.com/
                </span>
                <input
                  type="text"
                  value={str(content.social_instagram)}
                  onChange={(e) => handleContentChange("social_instagram", e.target.value)}
                  placeholder="seuperfil"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <Mail size={12} /> E-mail
              </label>
              <input
                type="email"
                value={str(content.social_email)}
                onChange={(e) => handleContentChange("social_email", e.target.value)}
                placeholder="contato@exemplo.com"
                className={inputClass}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <Linkedin size={12} /> LinkedIn
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  linkedin.com/
                </span>
                <input
                  type="text"
                  value={str(content.social_linkedin)}
                  onChange={(e) => handleContentChange("social_linkedin", e.target.value)}
                  placeholder="in/seuperfil"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <Facebook size={12} /> Facebook
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  facebook.com/
                </span>
                <input
                  type="text"
                  value={str(content.social_facebook)}
                  onChange={(e) => handleContentChange("social_facebook", e.target.value)}
                  placeholder="suapagina"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* ─── 2. Identidade ─── */}
        <AccordionSection
          id="identity"
          title="Identidade"
          subtitle="Logo e rodapé do seu site"
          isOpen={openSections.has("identity")}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <ImageUpload
              label="Logo do seu negócio"
              value={state.logoUrl}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "logoUrl", url })}
              slot="logoUrl"
              variant="avatar"
              description="200 × 200 px · quadrado · PNG transparente"
            />
            {state.logoUrl && (
              <ImageFocalPointPicker
                imageUrl={state.logoUrl}
                value={str(content.logoObjectPosition) || "50% 50%"}
                onChange={(pos) => handleContentChange("logoObjectPosition", pos)}
              />
            )}

            <div>
              <label className={labelClass}>Texto do rodapé</label>
              <input
                type="text"
                value={str(content.footerText)}
                onChange={(e) => handleContentChange("footerText", e.target.value)}
                placeholder="Ex: © 2025 Seu Nome. Todos os direitos reservados."
                className={inputClass}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ─── 3. Capa (Hero) ─── */}
        <AccordionSection
          id="hero"
          title="Capa"
          subtitle="A primeira coisa que seus visitantes vão ver"
          isOpen={openSections.has("hero")}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <ImageUpload
              label="Imagem da capa"
              value={state.heroImage}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "heroImage", url })}
              slot="heroImage"
              variant="compact"
              description="Recomendado: 1920 × 800 px · máx. 5 MB"
            />
            {state.heroImage && (
              <ImageFocalPointPicker
                imageUrl={state.heroImage}
                value={str(content.heroImageObjectPosition) || "50% 50%"}
                onChange={(pos) => handleContentChange("heroImageObjectPosition", pos)}
              />
            )}

            <div>
              <label className={labelClass}>Eyebrow (pequeno texto acima)</label>
              <input
                type="text"
                value={str(content.heroEyebrow)}
                onChange={(e) => handleContentChange("heroEyebrow", e.target.value)}
                placeholder="Ex: Psicologia online"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Título principal</label>
              <RichTextEditor
                value={str(content.heroTitle)}
                onChange={(html) => handleContentChange("heroTitle", html)}
                placeholder="Ex: Cuidado emocional para viver com mais clareza"
                paletteColors={paletteColors}
                singleLine
              />
            </div>

            <div>
              <label className={labelClass}>Subtítulo</label>
              <RichTextEditor
                value={str(content.heroSubtitle)}
                onChange={(html) => handleContentChange("heroSubtitle", html)}
                placeholder="Uma breve descrição do que você faz..."
                paletteColors={paletteColors}
                minHeight="4rem"
              />
            </div>

            <div>
              <label className={labelClass}>Texto do botão</label>
              <input
                type="text"
                value={str(content.heroCtaLabel)}
                onChange={(e) => handleContentChange("heroCtaLabel", e.target.value)}
                placeholder="Ex: Agendar sessão"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Destino do botão</label>
              <LinkDestinationSelect
                value={str(content.heroCtaUrl)}
                onChange={(url) => handleContentChange("heroCtaUrl", url)}
                content={content as Record<string, string>}
                placeholder="Escolha o destino do botão"
              />
            </div>
          </div>
        </AccordionSection>

        {/* ─── 4. Serviços ─── */}
        <AccordionSection
          id="services"
          title="Serviços"
          subtitle="O que você oferece aos seus clientes"
          isOpen={openSections.has("services")}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Título da seção</label>
              <input
                type="text"
                value={str(content.servicesTitle)}
                onChange={(e) => handleContentChange("servicesTitle", e.target.value)}
                placeholder="Ex: Serviços"
                className={inputClass}
              />
            </div>

            <ImageUpload
              label="Imagem da seção (opcional)"
              value={state.servicesImage}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "servicesImage", url })}
              slot="servicesImage"
              variant="compact"
              description="Aparece acima dos cards de serviço · 4:3 · máx. 5 MB"
            />

            {isStarterPlan && (
              <p className="text-[10px] text-[#22D3EE]/70 rounded-lg border border-[#22D3EE]/15 bg-[#22D3EE]/5 px-3 py-2">
                ⚡ Plano Starter: até {serviceCardsLimit} serviços ({serviceCards.length}/{serviceCardsLimit} usados)
              </p>
            )}
            <div className="space-y-3">
              {serviceCards.slice(0, serviceCardsLimit).map((card, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-[var(--platform-text)]/50">
                      Ícone do serviço — clique para selecionar
                    </p>
                    {serviceCards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "REMOVE_SERVICE_CARD", index: i })}
                        className="text-[var(--platform-text)]/30 transition hover:text-red-400"
                        title="Remover serviço"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <IconPickerInline
                    selectedIcon={card.iconName || card.icon || ""}
                    onSelect={(icon) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { iconName: icon, icon } })}
                  />
                  <RichTextEditor
                    value={card.title}
                    onChange={(html) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { title: html } })}
                    placeholder={`Serviço ${i + 1}`}
                    paletteColors={paletteColors}
                    singleLine
                  />
                  <RichTextEditor
                    value={card.description || ""}
                    onChange={(html) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { description: html } })}
                    placeholder="Descrição breve (opcional)"
                    paletteColors={paletteColors}
                    minHeight="3rem"
                  />

                  {/* Extra lines */}
                  {(card.extraLines ?? []).map((line, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => updateExtraLine(i, li, e.target.value)}
                        placeholder={`Linha extra ${li + 1}`}
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraLine(i, li)}
                        className="text-[var(--platform-text)]/30 transition hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addExtraLine(i)}
                    className="flex items-center gap-1 text-[10px] text-[var(--platform-text)]/40 transition hover:text-[#22D3EE]"
                  >
                    <Plus size={10} /> Adicionar linha de texto
                  </button>

                  {/* Imagem + posição */}
                  <ImageWithFocalControl
                    uploadSlot={`service-${i}`}
                    imageUrl={card.imageUrl || ""}
                    objectPosition={card.imageObjectPosition || "50% 50%"}
                    onChangeUrl={(url) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { imageUrl: url } })}
                    onChangePosition={(pos) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { imageObjectPosition: pos } })}
                  />
                </div>
              ))}
              {serviceCards.length < serviceCardsLimit && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "ADD_SERVICE_CARD" })}
                  className="w-full rounded-lg border border-dashed border-white/10 py-2.5 text-xs text-[var(--platform-text)]/30 transition hover:border-[#22D3EE]/20 hover:text-[#22D3EE]/50"
                >
                  + Adicionar serviço
                </button>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* ─── 5. CTA ─── */}
        <AccordionSection
          id="cta"
          title="Call to Action"
          subtitle="Convide seus visitantes a entrar em contato"
          isOpen={openSections.has("cta")}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Título</label>
              <RichTextEditor
                value={str(content.ctaTitle)}
                onChange={(html) => handleContentChange("ctaTitle", html)}
                placeholder="Ex: Vamos conversar?"
                paletteColors={paletteColors}
                singleLine
              />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <RichTextEditor
                value={str(content.ctaDescription)}
                onChange={(html) => handleContentChange("ctaDescription", html)}
                placeholder="Uma frase convidativa..."
                paletteColors={paletteColors}
                minHeight="4rem"
              />
            </div>

            <div>
              <label className={labelClass}>Texto do botão principal</label>
              <input
                type="text"
                value={str(content.ctaButtonLabel)}
                onChange={(e) => handleContentChange("ctaButtonLabel", e.target.value)}
                placeholder="Ex: Falar no WhatsApp"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Destino do botão principal</label>
              <LinkDestinationSelect
                value={str(content.ctaButtonUrl)}
                onChange={(url) => handleContentChange("ctaButtonUrl", url)}
                content={content as Record<string, string>}
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-[var(--platform-text)]/50 mb-3">Botão secundário (opcional)</p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Texto</label>
                  <input
                    type="text"
                    value={str(content.ctaSecondaryLabel)}
                    onChange={(e) => handleContentChange("ctaSecondaryLabel", e.target.value)}
                    placeholder="Ex: Saiba mais"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Destino</label>
                  <LinkDestinationSelect
                    value={str(content.ctaSecondaryUrl)}
                    onChange={(url) => handleContentChange("ctaSecondaryUrl", url)}
                    content={content as Record<string, string>}
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* ─── 6. Stats ─── */}
        {!isStarterPlan && statsItems.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#22D3EE]">
                📊 Números em destaque
              </h3>
            </div>
            <p className="mb-3 text-[11px] text-[var(--platform-text)]/50">
              Estatísticas que aparecem no seu site para transmitir credibilidade.
            </p>
            <div className="space-y-2">
              {statsItems.map((item, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input
                    value={item.value}
                    onChange={e => updateStatsItem(i, "value", e.target.value)}
                    placeholder="Ex: 500+"
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                  />
                  <input
                    value={item.label}
                    onChange={e => updateStatsItem(i, "label", e.target.value)}
                    placeholder="Ex: Clientes atendidos"
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 7. Sobre ─── */}
        {isStarterPlan ? (
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 opacity-50">
            <div>
              <p className="text-sm font-semibold text-[var(--platform-text)]">Sobre você</p>
              <p className="text-xs text-[var(--platform-text)]/50">Disponível no Plano Básico e Premium</p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold text-[var(--platform-text)]/40">🔒 Bloqueado</span>
          </div>
        ) : (
        <AccordionSection
          id="about"
          title="Sobre você"
          subtitle="Conte um pouco sobre você e seu negócio"
          isOpen={openSections.has("about")}
          onToggle={toggleSection}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass}>Sua foto ou imagem</label>
              <ImageWithFocalControl
                uploadSlot="aboutImage"
                imageUrl={str(content.aboutImage)}
                objectPosition={str(content.aboutImageObjectPosition) || "50% 50%"}
                onChangeUrl={(url) => handleContentChange("aboutImage", url)}
                onChangePosition={(pos) => handleContentChange("aboutImageObjectPosition", pos)}
                uploadLabel="Adicionar foto ou imagem"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Título da seção</label>
                <RichTextEditor
                  value={str(content.aboutTitle)}
                  onChange={(html) => handleContentChange("aboutTitle", html)}
                  placeholder={`Sobre ${state.businessName || "você"}`}
                  paletteColors={paletteColors}
                  singleLine
                />
              </div>

              <div>
                <label className={labelClass}>Texto sobre você</label>
                <RichTextEditor
                  value={str(content.aboutBody)}
                  onChange={(html) => handleContentChange("aboutBody", html)}
                  placeholder="Conte sua história, sua experiência e o que te motiva..."
                  paletteColors={paletteColors}
                  minHeight="8rem"
                />
              </div>
            </div>
          </div>
        </AccordionSection>
        )}

        {/* ─── 8. Seção de contato ─── */}
        <AccordionSection
          id="contact"
          title="Seção de Contato"
          subtitle={isStarterPlan ? "Botão flutuante não disponível no Starter" : "Ative o botão flutuante para até 2 canais"}
          isOpen={openSections.has("contact")}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {registeredLinks.length === 0 ? (
              <p className="text-xs text-[var(--platform-text)]/40 italic">
                Preencha seus canais acima para exibi-los na seção de contato
              </p>
            ) : (
              <>
                <p className="mb-3 text-[10px] text-[var(--platform-text)]/40">
                  {isStarterPlan
                    ? "Todos os canais cadastrados aparecem na seção de contato."
                    : "Todos os canais cadastrados aparecem na seção de contato. Ative o flutuante para fixar até 2 no canto da tela."}
                </p>
                {isStarterPlan && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-400/80">
                    🔒 Botão flutuante disponível a partir do Plano Básico
                  </div>
                )}
                {registeredLinks.map((link) => {
                  const isFloating = state.floatingCtaChannels.includes(
                    link.type as import("@/lib/onboarding/types").CtaTypeId
                  );
                  const atLimit = state.floatingCtaChannels.length >= 2 && !isFloating;
                  return (
                    <div
                      key={link.type}
                      className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5"
                    >
                      <link.Icon size={14} className="text-[var(--platform-text)]/60 shrink-0" />
                      <span className="flex-1 text-sm text-[var(--platform-text)]">{link.label}</span>
                      {/* Mini floating toggle — hidden for Starter */}
                      {!isStarterPlan && <button
                        type="button"
                        disabled={atLimit}
                        onClick={() => toggleFloatingChannel(link.type)}
                        className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium transition ${
                          isFloating
                            ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                            : atLimit
                            ? "opacity-30 cursor-not-allowed bg-white/5 text-[var(--platform-text)]/40"
                            : "bg-white/5 text-[var(--platform-text)]/40 hover:bg-white/10 hover:text-[var(--platform-text)]/70"
                        }`}
                        title={atLimit ? "Máximo de 2 botões flutuantes atingido" : isFloating ? "Desativar flutuante" : "Ativar flutuante"}
                      >
                        <div
                          className={`relative h-3.5 w-6 rounded-full transition ${
                            isFloating ? "bg-[#22D3EE]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow transition-transform ${
                              isFloating ? "translate-x-2.5" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                        Flutuante
                      </button>}
                    </div>
                  );
                })}
                {!isStarterPlan && state.floatingCtaChannels.length >= 2 && (
                  <p className="mt-1 text-[10px] text-[#22D3EE]/70">Máximo de 2 botões flutuantes ativados</p>
                )}
              </>
            )}
          </div>
        </AccordionSection>

        {/* ─── 9. Depoimentos ─── */}
        {isStarterPlan ? (
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 opacity-50">
            <div>
              <p className="text-sm font-semibold text-[var(--platform-text)]">Depoimentos</p>
              <p className="text-xs text-[var(--platform-text)]/50">Disponível no Plano Básico e Premium</p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold text-[var(--platform-text)]/40">🔒 Bloqueado</span>
          </div>
        ) : (
        <AccordionSection
          id="testimonials"
          title="Depoimentos"
          subtitle="Adicione até 10 depoimentos de clientes"
          isOpen={openSections.has("testimonials")}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--platform-text)]/50">{testimonials.length}/10 depoimentos</span>
              {testimonials.length < 10 && (
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
                >
                  <Plus size={12} /> Adicionar
                </button>
              )}
            </div>

            {/* Variant selector */}
            <div>
              <label className={labelClass}>Estilo de exibição</label>
              <select
                value={str(content.testimonialsVariant) || "grid"}
                onChange={(e) => handleContentChange("testimonialsVariant", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] focus:border-[#22D3EE] focus:outline-none cursor-pointer"
              >
                <option value="grid">Grade (2 colunas)</option>
                <option value="carousel">Carrossel (um por vez)</option>
                <option value="split">Split (nome + citação)</option>
              </select>
            </div>

            {testimonials.length === 0 ? (
              <button
                type="button"
                onClick={addTestimonial}
                className="w-full rounded-lg border border-dashed border-white/10 py-4 text-xs text-[var(--platform-text)]/30 transition hover:border-[#22D3EE]/20 hover:text-[#22D3EE]/50"
              >
                + Adicionar primeiro depoimento
              </button>
            ) : (
              <>
                {Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE) > 1 && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setTestimonialPage((p) => Math.max(0, p - 1))}
                      disabled={testimonialPage === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-base text-[var(--platform-text)]/50 transition hover:border-[#22D3EE]/30 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ‹
                    </button>
                    <span className="text-[10px] text-[var(--platform-text)]/40">
                      Página {testimonialPage + 1} de {Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTestimonialPage((p) =>
                          Math.min(Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE) - 1, p + 1),
                        )
                      }
                      disabled={testimonialPage >= Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE) - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-base text-[var(--platform-text)]/50 transition hover:border-[#22D3EE]/30 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ›
                    </button>
                  </div>
                )}
                <div className="space-y-3">
                  {testimonials
                    .slice(testimonialPage * TESTIMONIALS_PER_PAGE, (testimonialPage + 1) * TESTIMONIALS_PER_PAGE)
                    .map((t, localIdx) => {
                      const globalIdx = testimonialPage * TESTIMONIALS_PER_PAGE + localIdx;
                      return (
                        <div key={globalIdx} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-[var(--platform-text)]/50">
                              Depoimento {globalIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTestimonial(globalIdx)}
                              className="text-[var(--platform-text)]/30 transition hover:text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <textarea
                            value={t.quote}
                            onChange={(e) => updateTestimonialField(globalIdx, "quote", e.target.value)}
                            placeholder="O que o cliente disse sobre você..."
                            rows={2}
                            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
                          />
                          <input
                            type="text"
                            value={t.author}
                            onChange={(e) => updateTestimonialField(globalIdx, "author", e.target.value)}
                            placeholder="Nome do cliente"
                            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                          />
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </AccordionSection>
        )}

        {/* ─── 10. SEO ─── */}
        <AccordionSection
          id="seo"
          title="SEO"
          subtitle="Ajude seu site a aparecer no Google"
          isOpen={openSections.has("seo")}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-3">
              <p className="text-xs text-[#22D3EE]/80">
                SEO ajuda seu site a aparecer no Google. Preencha para melhorar seu posicionamento.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Título SEO</label>
                <span className={`text-[10px] ${str(content.seoTitle).length > 60 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {str(content.seoTitle).length}/60
                </span>
              </div>
              <input
                type="text"
                value={str(content.seoTitle)}
                onChange={(e) => handleContentChange("seoTitle", e.target.value)}
                placeholder="Ex: Psicologia Online | Dra. Maria Silva"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Descrição SEO</label>
                <span className={`text-[10px] ${str(content.seoDescription).length > 160 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {str(content.seoDescription).length}/160
                </span>
              </div>
              <textarea
                value={str(content.seoDescription)}
                onChange={(e) => handleContentChange("seoDescription", e.target.value)}
                placeholder="Breve descrição do seu negócio que aparece nos resultados do Google..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </AccordionSection>

      </div>

      {/* Navigation */}
      <StepNavigation canProceed={str(content.heroTitle).length > 0} />
    </div>
  );
}
