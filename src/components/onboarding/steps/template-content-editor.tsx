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
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { moveInArray } from "@/lib/onboarding/helpers";

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

/* ─── Efeito de destaque em texto (word accent) ─── */

const ACCENT_EFFECTS = [
  { id: "gradient",   label: "Gradiente" },
  { id: "neon",       label: "Neon" },
  { id: "underline",  label: "Sublinhado" },
  { id: "highlight",  label: "Destaque" },
  { id: "bold-accent",label: "Negrito" },
] as const;

function AccentWordControl({
  toggleLabel,
  wordKey,
  effectKey,
  content,
  onChange,
}: {
  toggleLabel: string;
  wordKey: string;
  effectKey: string;
  content: Record<string, unknown>;
  onChange: (key: string, value: string) => void;
}) {
  const word = str(content[wordKey]);
  const effect = str(content[effectKey]) || "gradient";
  const [open, setOpen] = useState(!!word);

  function handleToggle() {
    if (open && word) {
      // fechar e limpar
      onChange(wordKey, "");
      onChange(effectKey, "");
    }
    setOpen((o) => !o);
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-[11px] text-[var(--platform-text)]/40 transition hover:text-[#22D3EE]"
      >
        <Sparkles size={11} />
        {open ? "Remover efeito visual" : toggleLabel}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-3">
          <div>
            <label className={labelClass}>Trecho a destacar</label>
            <input
              type="text"
              value={word}
              onChange={(e) => {
                onChange(wordKey, e.target.value);
                if (!effect) onChange(effectKey, "gradient");
              }}
              placeholder="Ex: resultados, transformação…"
              className={inputClass}
            />
            <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/30">
              Pode ser uma palavra, uma frase ou o texto inteiro
            </p>
          </div>
          <div>
            <label className={labelClass}>Efeito visual</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {ACCENT_EFFECTS.map((ef) => (
                <button
                  key={ef.id}
                  type="button"
                  onClick={() => onChange(effectKey, ef.id)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    effect === ef.id
                      ? "border-[#22D3EE]/50 bg-[#22D3EE]/10 text-[#22D3EE]"
                      : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"
                  }`}
                >
                  {ef.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Section reorder list ─── */

const SECTION_LABELS: Record<string, { label: string; fixed?: boolean }> = {
  hero:         { label: "Capa",            fixed: true },
  services:     { label: "Serviços" },
  about:        { label: "Sobre você" },
  cta:          { label: "Call to Action" },
  testimonials: { label: "Depoimentos" },
  contact:      { label: "Contato",         fixed: true },
};

function SectionOrderCard() {
  const { state, dispatch } = useWizard();
  const sections = state.enabledSections;

  function move(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = moveInArray(sections, index, targetIndex);
    dispatch({ type: "REORDER_SECTIONS", sections: reordered });
  }

  return (
    <div className="space-y-1.5">
      {sections.map((id, index) => {
        const meta = SECTION_LABELS[id];
        const label = meta?.label ?? id;
        const isFixed = meta?.fixed === true;
        const canMoveUp = !isFixed && index > 1; // hero always at 0
        const canMoveDown = !isFixed && index < sections.length - 2; // contact always last

        return (
          <div
            key={id}
            className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
          >
            <span className="flex-1 text-sm text-[var(--platform-text)]">{label}</span>
            {isFixed ? (
              <span className="text-[10px] text-[var(--platform-text)]/30">fixo</span>
            ) : (
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={!canMoveUp}
                  onClick={() => move(index, "up")}
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--platform-text)]/40 transition hover:bg-white/10 hover:text-[var(--platform-text)] disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  disabled={!canMoveDown}
                  onClick={() => move(index, "down")}
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--platform-text)]/40 transition hover:bg-white/10 hover:text-[var(--platform-text)] disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-[10px] text-[var(--platform-text)]/30">
        As alterações refletem em tempo real no preview
      </p>
    </div>
  );
}

/* ─── Main component ─── */

export function TemplateContentEditor() {
  const { state, dispatch } = useWizard();
  const { selectedTemplateSlug, content, serviceCards } = state;

  // Accordion state — default: first section open
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["contacts"]));
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

  // Registered social links for contact checkboxes
  const registeredLinks = useMemo(() => {
    const links: { type: string; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [];
    if (str(content.social_whatsapp).trim()) links.push({ type: "whatsapp", label: "WhatsApp", Icon: MessageCircle });
    if (str(content.social_instagram).trim()) links.push({ type: "instagram", label: "Instagram", Icon: Instagram });
    if (str(content.social_email).trim()) links.push({ type: "email", label: "E-mail", Icon: Mail });
    if (str(content.social_linkedin).trim()) links.push({ type: "linkedin", label: "LinkedIn", Icon: Linkedin });
    if (str(content.social_facebook).trim()) links.push({ type: "facebook", label: "Facebook", Icon: Facebook });
    return links;
  }, [content.social_whatsapp, content.social_instagram, content.social_email, content.social_linkedin, content.social_facebook]);

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
              <input
                type="text"
                value={str(content.heroTitle)}
                onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                placeholder="Ex: Cuidado emocional para viver com mais clareza"
                className={inputClass}
              />
              <AccentWordControl
                toggleLabel="Adicionar efeito visual em trecho do título"
                wordKey="heroTitleAccentWord"
                effectKey="heroTitleAccentEffect"
                content={content}
                onChange={handleContentChange}
              />
            </div>

            <div>
              <label className={labelClass}>Subtítulo</label>
              <textarea
                value={str(content.heroSubtitle)}
                onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                placeholder="Uma breve descrição do que você faz..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
              <AccentWordControl
                toggleLabel="Adicionar efeito visual em trecho do subtítulo"
                wordKey="heroSubtitleAccentWord"
                effectKey="heroSubtitleAccentEffect"
                content={content}
                onChange={handleContentChange}
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

            <div className="space-y-3">
              {serviceCards.slice(0, 4).map((card, i) => (
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
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { title: e.target.value } })}
                    placeholder={`Serviço ${i + 1}`}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                  />
                  <textarea
                    value={card.description || ""}
                    onChange={(e) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { description: e.target.value } })}
                    placeholder="Descrição breve (opcional)"
                    rows={1}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
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
              {serviceCards.length < 4 && (
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
              <input
                type="text"
                value={str(content.ctaTitle)}
                onChange={(e) => handleContentChange("ctaTitle", e.target.value)}
                placeholder="Ex: Vamos conversar?"
                className={inputClass}
              />
              <AccentWordControl
                toggleLabel="Adicionar efeito visual em trecho do título"
                wordKey="ctaTitleAccentWord"
                effectKey="ctaTitleAccentEffect"
                content={content}
                onChange={handleContentChange}
              />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                value={str(content.ctaDescription)}
                onChange={(e) => handleContentChange("ctaDescription", e.target.value)}
                placeholder="Uma frase convidativa..."
                rows={2}
                className={`${inputClass} resize-none`}
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

        {/* ─── 6. Sobre ─── */}
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
                <input
                  type="text"
                  value={str(content.aboutTitle)}
                  onChange={(e) => handleContentChange("aboutTitle", e.target.value)}
                  placeholder={`Sobre ${state.businessName || "você"}`}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Texto sobre você</label>
                <textarea
                  value={str(content.aboutBody)}
                  onChange={(e) => handleContentChange("aboutBody", e.target.value)}
                  placeholder="Conte sua história, sua experiência e o que te motiva..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* ─── 7. Seção de contato ─── */}
        <AccordionSection
          id="contact"
          title="Seção de Contato"
          subtitle="Escolha até 2 canais para exibir no site"
          isOpen={openSections.has("contact")}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {registeredLinks.length === 0 ? (
              <p className="text-xs text-[var(--platform-text)]/40 italic">
                Preencha seus canais acima para exibi-los na seção de contato
              </p>
            ) : (
              registeredLinks.map((link) => {
                const isChecked = state.contactSelectedLinks.includes(link.type);
                const atLimit = state.contactSelectedLinks.length >= 2 && !isChecked;
                return (
                  <label
                    key={link.type}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                      isChecked
                        ? "border-[#22D3EE]/30 bg-[#22D3EE]/10"
                        : atLimit
                        ? "border-white/10 opacity-40 cursor-not-allowed"
                        : "border-white/10 cursor-pointer hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={atLimit}
                      onChange={() => {
                        const newLinks = isChecked
                          ? state.contactSelectedLinks.filter((t) => t !== link.type)
                          : [...state.contactSelectedLinks, link.type];
                        dispatch({ type: "SET_CONTACT_SELECTED_LINKS", links: newLinks });
                      }}
                      className="hidden"
                    />
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                        isChecked ? "border-[#22D3EE] bg-[#22D3EE]" : "border-white/20"
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-[#0B1020]" />}
                    </div>
                    <link.Icon size={14} className="text-[var(--platform-text)]/60" />
                    <span className="text-sm text-[var(--platform-text)]">{link.label}</span>
                  </label>
                );
              })
            )}
          </div>
          {state.contactSelectedLinks.length >= 2 && (
            <p className="mt-2 text-[10px] text-[#22D3EE]/70">Máximo de 2 canais selecionados</p>
          )}

          {/* Floating buttons toggle */}
          {registeredLinks.length > 0 && (
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 transition hover:bg-white/[0.03]">
              <div
                className={`relative h-5 w-9 rounded-full transition ${
                  str(content.floatingButtonsEnabled) !== "false" ? "bg-[#22D3EE]" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    str(content.floatingButtonsEnabled) !== "false" ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={str(content.floatingButtonsEnabled) !== "false"}
                onChange={(e) =>
                  handleContentChange("floatingButtonsEnabled", e.target.checked ? "true" : "false")
                }
              />
              <div>
                <p className="text-xs font-medium text-[var(--platform-text)]">Botões flutuantes de contato</p>
                <p className="text-[10px] text-[var(--platform-text)]/40">
                  Aparecem fixos no canto da tela em todos os dispositivos
                </p>
              </div>
            </label>
          )}
        </AccordionSection>

        {/* ─── 8. Depoimentos ─── */}
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

        {/* ─── 9. SEO ─── */}
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
