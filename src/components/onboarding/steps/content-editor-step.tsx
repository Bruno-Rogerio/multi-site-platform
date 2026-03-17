"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  User,
  Star,
  FileText,
  ImageIcon,
  HelpCircle,
  Calendar,
  MessageSquare,
  Phone,
  Search,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ImageUpload } from "../builders/image-upload";
import { IconPickerInline } from "../builders/icon-picker";
import { LinkDestinationSelect } from "../builders/link-destination-select";

/* ─── Tab metadata ─── */

const TAB_META: Record<string, { label: string; icon: React.ReactNode }> = {
  hero:         { label: "Capa",        icon: <Sparkles size={13} /> },
  services:     { label: "Serviços",    icon: <Layers size={13} /> },
  about:        { label: "Sobre",       icon: <User size={13} /> },
  testimonials: { label: "Depoimentos", icon: <Star size={13} /> },
  blog:         { label: "Blog",        icon: <FileText size={13} /> },
  gallery:      { label: "Galeria",     icon: <ImageIcon size={13} /> },
  faq:          { label: "FAQ",         icon: <HelpCircle size={13} /> },
  events:       { label: "Agenda",      icon: <Calendar size={13} /> },
  cta:          { label: "CTA",         icon: <MessageSquare size={13} /> },
  contact:      { label: "Contato",     icon: <Phone size={13} /> },
  seo:          { label: "SEO",         icon: <Search size={13} /> },
};

const SECTION_TAB_ORDER = [
  "hero", "services", "about", "testimonials",
  "blog", "gallery", "faq", "events",
  "cta", "contact", "seo",
];
const ALWAYS_TABS = ["hero", "cta", "contact", "seo"];

/* ─── Input helper ─── */

function Input({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[var(--platform-text)]/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
      />
      {hint && <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[var(--platform-text)]/60">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
      />
    </div>
  );
}

/* ─── Focal point picker ─── */

function parsePos(val: string): { x: number; y: number } {
  if (!val) return { x: 50, y: 50 };
  const named = (s: string) => {
    if (s === "left" || s === "top") return 0;
    if (s === "right" || s === "bottom") return 100;
    if (s === "center") return 50;
    const n = parseFloat(s);
    return isNaN(n) ? 50 : n;
  };
  const parts = val.trim().split(/\s+/);
  return { x: named(parts[0] ?? "50%"), y: named(parts[1] ?? "50%") };
}

function FocalPointPicker({
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
    <div className="mt-2">
      <p className="mb-1 text-[10px] text-[var(--platform-text)]/40">Posição — arraste para reposicionar</p>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-24 w-full overflow-hidden rounded-lg cursor-crosshair select-none"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <img
          src={imageUrl}
          alt="focal point"
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
          style={{ objectPosition: value || "50% 50%" }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 bottom-0 w-px" style={{ left: `${pos.x}%`, background: "rgba(255,255,255,0.35)" }} />
          <div className="absolute left-0 right-0 h-px" style={{ top: `${pos.y}%`, background: "rgba(255,255,255,0.35)" }} />
        </div>
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: "rgba(34,211,238,0.5)", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.6)" }}
        />
        <div className="pointer-events-none absolute bottom-1 right-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/70">arraste</div>
      </div>
    </div>
  );
}

/* ─── Section editors ─── */

function HeroContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, heroImage } = state;

  function set(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      <ImageUpload
        label="Imagem da capa"
        value={heroImage}
        onChange={url => dispatch({ type: "SET_IMAGE", key: "heroImage", url })}
        slot="heroImage"
        aspectRatio="16/9"
        variant="compact"
        description="1920 × 800 px · máx. 5 MB"
      />
      {heroImage && (
        <FocalPointPicker
          imageUrl={heroImage}
          value={String(content.heroImageObjectPosition ?? "50% 50%")}
          onChange={v => set("heroImageObjectPosition", v)}
        />
      )}
      <div className="border-t border-white/10 pt-4 space-y-4">
        <Input label="Slogan" value={String(content.slogan ?? "")} onChange={v => set("slogan", v)} placeholder="Ex: Cuidando da sua saúde emocional" hint="Aparece no header, abaixo do nome" />
        <Input label="Eyebrow (pequeno texto acima)" value={String(content.heroEyebrow ?? "")} onChange={v => set("heroEyebrow", v)} placeholder="Ex: Psicologia online" />
        <Input label="Título principal" value={String(content.heroTitle ?? "")} onChange={v => set("heroTitle", v)} placeholder="Ex: Cuidado emocional para viver com mais clareza" />
        <Textarea label="Subtítulo" value={String(content.heroSubtitle ?? "")} onChange={v => set("heroSubtitle", v)} placeholder="Uma breve descrição do que você faz..." />
        <Input label="Texto do botão" value={String(content.heroCtaLabel ?? "")} onChange={v => set("heroCtaLabel", v)} placeholder="Ex: Agendar sessão" />
        <div>
          <label className="text-xs font-medium text-[var(--platform-text)]/60">Link do botão</label>
          <LinkDestinationSelect
            value={String(content.heroCtaUrl ?? "")}
            onChange={v => set("heroCtaUrl", v)}
            content={content as Record<string, string>}
            placeholder="#contato ou canal de contato"
          />
        </div>
      </div>
    </div>
  );
}

function ServicesContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, serviceCards } = state;

  function setTitle(v: string) {
    dispatch({ type: "UPDATE_CONTENT", key: "servicesTitle", value: v });
  }

  function handleServiceChange(index: number, field: string, value: string) {
    dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { [field]: value } });
  }

  return (
    <div className="space-y-4">
      <Input label="Título da seção" value={String(content.servicesTitle ?? "Serviços")} onChange={setTitle} placeholder="Ex: O que ofereço" />

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">Cards de serviço</p>
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_SERVICE_CARD" })}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]"
          >
            <Plus size={12} />
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {serviceCards.map((card, index) => (
            <div key={index} className="relative rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2.5">
              {serviceCards.length > 1 && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "REMOVE_SERVICE_CARD", index })}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 size={11} />
                </button>
              )}

              <div className="flex items-center gap-2 pr-8">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#22D3EE]/20 text-xs font-bold text-[#22D3EE]">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={card.title}
                  onChange={e => handleServiceChange(index, "title", e.target.value)}
                  placeholder="Título do serviço"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>

              <div>
                <p className="mb-1 text-[10px] text-[var(--platform-text)]/40">Ícone</p>
                <IconPickerInline
                  selectedIcon={card.iconName || card.icon || ""}
                  onSelect={iconName => handleServiceChange(index, "iconName", iconName)}
                />
              </div>

              <textarea
                value={card.description}
                onChange={e => handleServiceChange(index, "description", e.target.value)}
                placeholder="Descrição breve..."
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
              />

              <ImageUpload
                label="Imagem do card (opcional)"
                value={card.imageUrl ?? ""}
                onChange={url => handleServiceChange(index, "imageUrl", url)}
                slot={`serviceCard-${index}`}
                variant="thumbnail"
              />
              {card.imageUrl && (
                <FocalPointPicker
                  imageUrl={card.imageUrl}
                  value={(card as unknown as Record<string, string>).objectPosition ?? "50% 50%"}
                  onChange={v => handleServiceChange(index, "objectPosition", v)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;

  function set(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      <ImageUpload
        label="Sua foto / imagem da seção"
        value={String(content.aboutImage ?? "")}
        onChange={url => set("aboutImage", url)}
        slot="aboutImage"
        variant="compact"
        description="400 × 400 px recomendado"
      />
      {content.aboutImage && (
        <FocalPointPicker
          imageUrl={String(content.aboutImage)}
          value={String(content.aboutImageObjectPosition ?? "50% 50%")}
          onChange={v => set("aboutImageObjectPosition", v)}
        />
      )}
      <div className="border-t border-white/10 pt-4 space-y-4">
        <Input label="Título da seção" value={String(content.aboutTitle ?? "Sobre mim")} onChange={v => set("aboutTitle", v)} placeholder="Ex: Quem sou eu" />
        <Textarea label="Seu texto" value={String(content.aboutBody ?? "")} onChange={v => set("aboutBody", v)} placeholder="Conte um pouco sobre você, sua história, diferenciais e como pode ajudar seus clientes..." rows={6} />
      </div>
    </div>
  );
}

function TestimonialsContentEditor() {
  const { state, dispatch } = useWizard();
  const testimonials = (state.content.testimonials as Array<{ name: string; role: string; text: string; stars: number }>) ?? [];

  function update(index: number, field: string, value: unknown) {
    const updated = testimonials.map((t, i) => i === index ? { ...t, [field]: value } : t);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "testimonials", value: updated });
  }

  function add() {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "testimonials", value: [...testimonials, { name: "", role: "", text: "", stars: 5 }] });
  }

  function remove(index: number) {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "testimonials", value: testimonials.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--platform-text)]/60">
          {testimonials.length} depoimento{testimonials.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]"
        >
          <Plus size={12} />
          Adicionar
        </button>
      </div>

      {testimonials.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
          <p className="text-sm text-[var(--platform-text)]/40">Nenhum depoimento ainda</p>
          <button type="button" onClick={add} className="mt-2 text-xs text-[#22D3EE] hover:underline">
            Adicionar o primeiro
          </button>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            >
              <Trash2 size={11} />
            </button>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => update(i, "stars", star)}
                  className={`text-lg leading-none transition ${star <= (t.stars ?? 5) ? "text-[#F59E0B]" : "text-white/20"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <Textarea label="Depoimento" value={t.text} onChange={v => update(i, "text", v)} placeholder="O que o cliente disse..." rows={3} />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome" value={t.name} onChange={v => update(i, "name", v)} placeholder="Maria Silva" />
              <Input label="Cargo / empresa" value={t.role} onChange={v => update(i, "role", v)} placeholder="Designer · Studio X" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;
  const posts = (content.blogPosts as Array<{ title: string; excerpt: string; imageUrl: string; link: string }>) ?? [];

  function setTitle(v: string) { dispatch({ type: "UPDATE_CONTENT", key: "blogTitle", value: v }); }

  function update(index: number, field: string, value: string) {
    const updated = posts.map((p, i) => i === index ? { ...p, [field]: value } : p);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "blogPosts", value: updated });
  }

  function add() {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "blogPosts", value: [...posts, { title: "", excerpt: "", imageUrl: "", link: "" }] });
  }

  function remove(index: number) {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "blogPosts", value: posts.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <Input label="Título da seção" value={String(content.blogTitle ?? "Blog")} onChange={setTitle} placeholder="Ex: Artigos e novidades" />

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
          <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]">
            <Plus size={12} />
            Adicionar post
          </button>
        </div>

        {posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-[var(--platform-text)]/40">Nenhum post ainda</p>
            <button type="button" onClick={add} className="mt-2 text-xs text-[#22D3EE] hover:underline">Adicionar o primeiro</button>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((p, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
                <Trash2 size={11} />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <ImageUpload label="" value={p.imageUrl} onChange={url => update(i, "imageUrl", url)} slot={`blog-${i}`} variant="thumbnail" />
                <div className="flex-1 space-y-2">
                  <input type="text" value={p.title} onChange={e => update(i, "title", e.target.value)} placeholder="Título do post" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none" />
                  <input type="text" value={p.link} onChange={e => update(i, "link", e.target.value)} placeholder="Link (URL)" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none" />
                </div>
              </div>
              <textarea value={p.excerpt} onChange={e => update(i, "excerpt", e.target.value)} placeholder="Resumo do post..." rows={2} className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;
  const images = (content.galleryImages as Array<{ url: string; alt: string; caption: string }>) ?? [];

  function setTitle(v: string) { dispatch({ type: "UPDATE_CONTENT", key: "galleryTitle", value: v }); }

  function update(index: number, field: string, value: string) {
    const updated = images.map((img, i) => i === index ? { ...img, [field]: value } : img);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "galleryImages", value: updated });
  }

  function add() {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "galleryImages", value: [...images, { url: "", alt: "", caption: "" }] });
  }

  function remove(index: number) {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "galleryImages", value: images.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <Input label="Título da seção" value={String(content.galleryTitle ?? "Galeria")} onChange={setTitle} placeholder="Ex: Meu portfólio" />

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">{images.length} image{images.length !== 1 ? "ns" : "m"}</p>
          <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]">
            <Plus size={12} />
            Adicionar
          </button>
        </div>

        {images.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-[var(--platform-text)]/40">Nenhuma imagem ainda</p>
            <button type="button" onClick={add} className="mt-2 text-xs text-[#22D3EE] hover:underline">Adicionar a primeira</button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((img, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <button type="button" onClick={() => remove(i)} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
                <Trash2 size={11} />
              </button>
              <ImageUpload label="Foto" value={img.url} onChange={url => update(i, "url", url)} slot={`gallery-${i}`} variant="thumbnail" />
              <input type="text" value={img.caption} onChange={e => update(i, "caption", e.target.value)} placeholder="Legenda (opcional)" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;
  const items = (content.faqItems as Array<{ question: string; answer: string }>) ?? [];

  function setTitle(v: string) { dispatch({ type: "UPDATE_CONTENT", key: "faqTitle", value: v }); }

  function update(index: number, field: string, value: string) {
    const updated = items.map((item, i) => i === index ? { ...item, [field]: value } : item);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "faqItems", value: updated });
  }

  function add() {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "faqItems", value: [...items, { question: "", answer: "" }] });
  }

  function remove(index: number) {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "faqItems", value: items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <Input label="Título da seção" value={String(content.faqTitle ?? "Perguntas frequentes")} onChange={setTitle} placeholder="Ex: Dúvidas comuns" />

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">{items.length} pergunta{items.length !== 1 ? "s" : ""}</p>
          <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]">
            <Plus size={12} />
            Adicionar
          </button>
        </div>

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-[var(--platform-text)]/40">Nenhuma pergunta ainda</p>
            <button type="button" onClick={add} className="mt-2 text-xs text-[#22D3EE] hover:underline">Adicionar a primeira</button>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
              <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
                <Trash2 size={11} />
              </button>
              <input type="text" value={item.question} onChange={e => update(i, "question", e.target.value)} placeholder="Pergunta..." className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none pr-8" />
              <textarea value={item.answer} onChange={e => update(i, "answer", e.target.value)} placeholder="Resposta..." rows={2} className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;
  const events = (content.events as Array<{ title: string; date: string; time: string; location: string; description: string }>) ?? [];

  function setTitle(v: string) { dispatch({ type: "UPDATE_CONTENT", key: "eventsTitle", value: v }); }

  function update(index: number, field: string, value: string) {
    const updated = events.map((ev, i) => i === index ? { ...ev, [field]: value } : ev);
    dispatch({ type: "SET_CONTENT_ARRAY", key: "events", value: updated });
  }

  function add() {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "events", value: [...events, { title: "", date: "", time: "", location: "", description: "" }] });
  }

  function remove(index: number) {
    dispatch({ type: "SET_CONTENT_ARRAY", key: "events", value: events.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <Input label="Título da seção" value={String(content.eventsTitle ?? "Agenda")} onChange={setTitle} placeholder="Ex: Próximos eventos" />

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">{events.length} evento{events.length !== 1 ? "s" : ""}</p>
          <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:bg-white/[0.08]">
            <Plus size={12} />
            Adicionar
          </button>
        </div>

        {events.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-[var(--platform-text)]/40">Nenhum evento ainda</p>
            <button type="button" onClick={add} className="mt-2 text-xs text-[#22D3EE] hover:underline">Adicionar o primeiro</button>
          </div>
        )}

        <div className="space-y-3">
          {events.map((ev, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
              <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
                <Trash2 size={11} />
              </button>
              <input type="text" value={ev.title} onChange={e => update(i, "title", e.target.value)} placeholder="Nome do evento" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none pr-8" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={ev.date} onChange={e => update(i, "date", e.target.value)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] focus:border-[#22D3EE] focus:outline-none" />
                <input type="time" value={ev.time} onChange={e => update(i, "time", e.target.value)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] focus:border-[#22D3EE] focus:outline-none" />
              </div>
              <input type="text" value={ev.location} onChange={e => update(i, "location", e.target.value)} placeholder="Local (endereço ou online)" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none" />
              <textarea value={ev.description} onChange={e => update(i, "description", e.target.value)} placeholder="Descrição do evento..." rows={2} className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, ctaVariant } = state;

  function set(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      <Input label="Título" value={String(content.ctaTitle ?? "")} onChange={v => set("ctaTitle", v)} placeholder="Ex: Vamos conversar?" />
      <Textarea label="Descrição" value={String(content.ctaDescription ?? "")} onChange={v => set("ctaDescription", v)} placeholder="Uma frase convidativa para seus visitantes entrarem em contato..." />
      <Input label="Texto do botão principal" value={String(content.ctaButtonLabel ?? "")} onChange={v => set("ctaButtonLabel", v)} placeholder="Ex: Falar no WhatsApp" />
      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">Link do botão</label>
        <LinkDestinationSelect
          value={String(content.ctaButtonUrl ?? "")}
          onChange={v => set("ctaButtonUrl", v)}
          content={content as Record<string, string>}
          placeholder="Escolha o destino do botão"
        />
      </div>

      {ctaVariant === "double" && (
        <div className="border-t border-white/10 pt-4 space-y-4">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">Segundo botão (outline)</p>
          <Input label="Texto do segundo botão" value={String(content.ctaSecondaryLabel ?? "")} onChange={v => set("ctaSecondaryLabel", v)} placeholder="Ex: Saiba mais" />
          <div>
            <label className="text-xs font-medium text-[var(--platform-text)]/60">Link do segundo botão</label>
            <LinkDestinationSelect
              value={String(content.ctaSecondaryUrl ?? "")}
              onChange={v => set("ctaSecondaryUrl", v)}
              content={content as Record<string, string>}
              placeholder="Escolha o destino"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const CTA_LABEL_MAP: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  email: "E-mail",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  phone: "Telefone",
};

function ContactContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, logoUrl, selectedCtaTypes, ctaConfig, floatingCtaEnabled, floatingCtaChannels } = state;

  function set(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  // Pre-fill social fields from ctaConfig when this tab first opens
  useEffect(() => {
    const mappings = [
      { ctaId: "whatsapp",  contentKey: "social_whatsapp",  clean: (v: string) => v.replace(/\D/g, "") },
      { ctaId: "instagram", contentKey: "social_instagram",  clean: (v: string) => v.replace(/^@/, "") },
      { ctaId: "email",     contentKey: "social_email",      clean: (v: string) => v },
      { ctaId: "linkedin",  contentKey: "social_linkedin",   clean: (v: string) => v },
      { ctaId: "facebook",  contentKey: "social_facebook",   clean: (v: string) => v },
    ];
    for (const { ctaId, contentKey, clean } of mappings) {
      const existingVal = (content as Record<string, unknown>)[contentKey];
      const ctaVal = (ctaConfig as Record<string, { label: string; url: string } | undefined>)[ctaId]?.url;
      if (!existingVal && ctaVal) {
        set(contentKey, clean(ctaVal));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <ImageUpload
        label="Logo do seu negócio"
        value={logoUrl}
        onChange={url => dispatch({ type: "SET_IMAGE", key: "logoUrl", url })}
        slot="logoUrl"
        variant="avatar"
        description="PNG transparente · 200 × 200 px"
      />
      <div className="border-t border-white/10 pt-4 space-y-4">
        <Input label="Título da seção" value={String(content.contactTitle ?? "")} onChange={v => set("contactTitle", v)} placeholder="Ex: Entre em contato" />
        <Input label="Subtítulo" value={String(content.contactSubtitle ?? "")} onChange={v => set("contactSubtitle", v)} placeholder="Ex: Estou aqui para ajudar" />
      </div>
      <div className="border-t border-white/10 pt-4 space-y-3">
        <p className="text-xs font-medium text-[var(--platform-text)]/60">Informações de contato (preencha os que você usa)</p>
        <Input label="WhatsApp" value={String((content as Record<string, unknown>).social_whatsapp ?? "")} onChange={v => set("social_whatsapp", v)} placeholder="Ex: 11999999999" />
        <Input label="Email" value={String((content as Record<string, unknown>).social_email ?? "")} onChange={v => set("social_email", v)} placeholder="contato@exemplo.com" type="email" />
        <Input label="Instagram" value={String((content as Record<string, unknown>).social_instagram ?? "")} onChange={v => set("social_instagram", v)} placeholder="@seuperfil" />
        <Input label="LinkedIn" value={String((content as Record<string, unknown>).social_linkedin ?? "")} onChange={v => set("social_linkedin", v)} placeholder="linkedin.com/in/seuperfil" />
        <Input label="Facebook" value={String((content as Record<string, unknown>).social_facebook ?? "")} onChange={v => set("social_facebook", v)} placeholder="facebook.com/suapagina" />
      </div>

      {/* Floating CTA toggles */}
      {selectedCtaTypes.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-[var(--platform-text)]/60">Botão flutuante de contato</p>
              <p className="text-[10px] text-[var(--platform-text)]/35">Aparece fixo no canto do site</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_FLOATING_CTA", enabled: !floatingCtaEnabled })}
              className={`relative h-5 w-9 rounded-full transition ${floatingCtaEnabled ? "bg-[#22D3EE]" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${floatingCtaEnabled ? "left-4" : "left-0.5"}`} />
            </button>
          </div>
          {floatingCtaEnabled && (
            <div>
              <p className="mb-2 text-[10px] text-[var(--platform-text)]/40">Canais exibidos no botão ({floatingCtaChannels.length}/2)</p>
              <div className="flex flex-wrap gap-2">
                {selectedCtaTypes.map(ctaId => {
                  const isInFloating = floatingCtaChannels.includes(ctaId);
                  const canAdd = isInFloating || floatingCtaChannels.length < 2;
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
                      {CTA_LABEL_MAP[ctaId] ?? ctaId}
                      {isInFloating && <Check size={10} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <Input label="Texto do rodapé" value={String(content.footerText ?? "")} onChange={v => set("footerText", v)} placeholder="© 2025 Seu Nome. Todos os direitos reservados." />
      </div>
    </div>
  );
}

function SeoContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;

  function set(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  const metaTitleLen = String(content.seoTitle ?? "").length;
  const metaDescLen = String(content.seoDescription ?? "").length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-3">
        <p className="text-xs text-[#22D3EE]/80">SEO ajuda seu site a aparecer no Google. Preencha para melhorar seu posicionamento.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--platform-text)]/60">Título SEO</label>
          <span className={`text-[10px] ${metaTitleLen > 60 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>{metaTitleLen}/60</span>
        </div>
        <input type="text" value={String(content.seoTitle ?? "")} onChange={e => set("seoTitle", e.target.value)} placeholder="Ex: Psicologia Online | Dra. Maria Silva" className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--platform-text)]/60">Descrição SEO</label>
          <span className={`text-[10px] ${metaDescLen > 160 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>{metaDescLen}/160</span>
        </div>
        <textarea value={String(content.seoDescription ?? "")} onChange={e => set("seoDescription", e.target.value)} placeholder="Breve descrição do seu negócio..." rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none" />
      </div>

      <Input label="Palavras-chave (separadas por vírgula)" value={String(content.seoKeywords ?? "")} onChange={v => set("seoKeywords", v)} placeholder="Ex: psicologia online, terapia, saúde mental" />

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-[var(--platform-text)]/60 mb-3">Preview no Google</p>
        <div className="rounded-lg border border-white/10 bg-white p-3">
          <p className="text-[11px] text-green-700 font-mono truncate">
            {state.preferredSubdomain || "seusite"}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
          </p>
          <p className="text-sm text-blue-700 font-medium truncate mt-0.5">
            {String(content.seoTitle || content.heroTitle || "Título do seu site")}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {String(content.seoDescription || content.heroSubtitle || "Descrição do seu site aparece aqui...")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main step ─── */

export function ContentEditorStep() {
  const { state } = useWizard();
  const { content, enabledSections } = state;

  // Build active tabs dynamically from enabledSections
  const activeTabs = SECTION_TAB_ORDER.filter(id =>
    ALWAYS_TABS.includes(id) || enabledSections.includes(id)
  );

  const [activeTab, setActiveTab] = useState(activeTabs[0] ?? "hero");

  const canProceed = !!(content.heroTitle && String(content.heroTitle).length > 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">Conteúdo</p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">Escreva os textos do seu site</h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Personalize cada seção. O preview ao lado mostra as mudanças em tempo real.
        </p>
      </div>

      {/* Scrollable tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
          {activeTabs.map(tabId => {
            const meta = TAB_META[tabId];
            if (!meta) return null;
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                    : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)] hover:bg-white/[0.04]"
                }`}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "hero"         && <HeroContentEditor />}
            {activeTab === "services"     && <ServicesContentEditor />}
            {activeTab === "about"        && <AboutContentEditor />}
            {activeTab === "testimonials" && <TestimonialsContentEditor />}
            {activeTab === "blog"         && <BlogContentEditor />}
            {activeTab === "gallery"      && <GalleryContentEditor />}
            {activeTab === "faq"          && <FaqContentEditor />}
            {activeTab === "events"       && <EventsContentEditor />}
            {activeTab === "cta"          && <CtaContentEditor />}
            {activeTab === "contact"      && <ContactContentEditor />}
            {activeTab === "seo"          && <SeoContentEditor />}
          </motion.div>
        </AnimatePresence>
      </div>

      <StepNavigation canProceed={canProceed} />
    </div>
  );
}
