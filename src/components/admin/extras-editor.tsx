"use client";

import { useState } from "react";
import { BookOpen, CalendarDays, ImageIcon, Plus, Trash2, Loader2, ChevronDown } from "lucide-react";

import { useToast } from "@/components/admin/toast-provider";
import { BlogSection } from "@/components/site/blog-section";
import { EventsSection } from "@/components/site/events-section";
import { GallerySection } from "@/components/site/gallery-section";
import type { Section } from "@/lib/tenant/types";

/* ─── Types ──────────────────────────────────────────────── */

type BlogPost = { title: string; excerpt: string; imageUrl?: string; link?: string };
type EventItem = { title: string; date: string; time?: string; location?: string; description?: string };
type GalleryImage = { url: string; alt: string; caption?: string };

type Props = {
  siteId: string;
  blogSection: Section | null;
  eventsSection: Section | null;
  gallerySection: Section | null;
};

/* ─── Constants ──────────────────────────────────────────── */

const INPUT_CLS = "mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]";
const LABEL_CLS = "text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60";

// Neutral preview wrapper so --site-* CSS vars work correctly
const PREVIEW_STYLE: React.CSSProperties = {
  "--site-text": "#101426",
  "--site-primary": "#3B82F6",
  "--site-accent": "#22D3EE",
  "--site-surface": "rgba(255,255,255,0.85)",
  "--site-border": "rgba(11,16,32,0.12)",
  "--site-radius": "12px",
  "--site-shadow": "0 2px 8px rgba(0,0,0,0.08)",
  backgroundColor: "#eef2ff",
  borderRadius: "12px",
  overflow: "hidden",
  maxHeight: "520px",
  overflowY: "auto",
} as React.CSSProperties;

/* ─── Helpers ─────────────────────────────────────────────── */

function asString(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

/* ─── Sub-editors ─────────────────────────────────────────── */

function BlogEditor({ section, siteId }: { section: Section; siteId: string }) {
  const { toast } = useToast();
  const [title, setTitle] = useState(asString(section.content.title, "Blog"));
  const [subtitle, setSubtitle] = useState(asString(section.content.subtitle));
  const [posts, setPosts] = useState<BlogPost[]>(
    Array.isArray(section.content.posts)
      ? (section.content.posts as BlogPost[])
      : [],
  );
  const [saving, setSaving] = useState(false);

  function updatePost(i: number, patch: Partial<BlogPost>) {
    setPosts((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          order: section.order,
          variant: section.variant ?? "default",
          content: { ...section.content, title, subtitle, posts },
        }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) toast("Blog salvo!", "success");
      else toast(data?.error ?? "Erro ao salvar.", "error");
    } catch { toast("Erro ao salvar.", "error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="mt-5 grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Opcional" className={INPUT_CLS} />
          </div>
        </div>
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">Artigo {i + 1}</span>
                {posts.length > 0 && (
                  <button type="button" onClick={() => setPosts((p) => p.filter((_, idx) => idx !== i))} className="rounded p-1 text-red-400/60 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <input value={post.title} placeholder="Título do artigo" onChange={(e) => updatePost(i, { title: e.target.value })} className={INPUT_CLS} />
              <textarea value={post.excerpt} placeholder="Resumo..." rows={2} onChange={(e) => updatePost(i, { excerpt: e.target.value })} className={INPUT_CLS + " resize-none"} />
              <input value={post.imageUrl ?? ""} placeholder="URL da imagem (opcional)" onChange={(e) => updatePost(i, { imageUrl: e.target.value })} className={INPUT_CLS} />
              <input value={post.link ?? ""} placeholder="Link do artigo (opcional)" onChange={(e) => updatePost(i, { link: e.target.value })} className={INPUT_CLS} />
            </div>
          ))}
          <button type="button" onClick={() => setPosts((p) => [...p, { title: "", excerpt: "", imageUrl: "", link: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar artigo
          </button>
        </div>
        <button type="button" onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Salvar blog
        </button>
      </div>

      {/* Preview */}
      <div className="xl:sticky xl:top-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview</p>
        <div style={PREVIEW_STYLE}>
          {posts.length > 0 ? (
            <BlogSection title={title} subtitle={subtitle} posts={posts} />
          ) : (
            <div className="py-16 text-center text-sm" style={{ color: "#101426", opacity: 0.4 }}>
              Nenhum artigo adicionado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgendaEditor({ section, siteId }: { section: Section; siteId: string }) {
  const { toast } = useToast();
  const [title, setTitle] = useState(asString(section.content.title, "Agenda"));
  const [subtitle, setSubtitle] = useState(asString(section.content.subtitle));
  const [events, setEvents] = useState<EventItem[]>(
    Array.isArray(section.content.events)
      ? (section.content.events as EventItem[])
      : [],
  );
  const [saving, setSaving] = useState(false);

  function updateEvent(i: number, patch: Partial<EventItem>) {
    setEvents((prev) => prev.map((ev, idx) => (idx === i ? { ...ev, ...patch } : ev)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          order: section.order,
          variant: section.variant ?? "default",
          content: { ...section.content, title, subtitle, events },
        }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) toast("Agenda salva!", "success");
      else toast(data?.error ?? "Erro ao salvar.", "error");
    } catch { toast("Erro ao salvar.", "error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="mt-5 grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Opcional" className={INPUT_CLS} />
          </div>
        </div>
        <div className="space-y-3">
          {events.map((ev, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">Evento {i + 1}</span>
                {events.length > 0 && (
                  <button type="button" onClick={() => setEvents((ev) => ev.filter((_, idx) => idx !== i))} className="rounded p-1 text-red-400/60 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <input value={ev.title} placeholder="Nome do evento" onChange={(e) => updateEvent(i, { title: e.target.value })} className={INPUT_CLS} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={LABEL_CLS}>Data</label>
                  <input type="date" value={ev.date} onChange={(e) => updateEvent(i, { date: e.target.value })} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Horário</label>
                  <input type="time" value={ev.time ?? ""} onChange={(e) => updateEvent(i, { time: e.target.value })} className={INPUT_CLS} />
                </div>
              </div>
              <input value={ev.location ?? ""} placeholder="Local (opcional)" onChange={(e) => updateEvent(i, { location: e.target.value })} className={INPUT_CLS} />
              <textarea value={ev.description ?? ""} placeholder="Descrição (opcional)" rows={2} onChange={(e) => updateEvent(i, { description: e.target.value })} className={INPUT_CLS + " resize-none"} />
            </div>
          ))}
          <button type="button" onClick={() => setEvents((ev) => [...ev, { title: "", date: "", time: "", location: "", description: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar evento
          </button>
        </div>
        <button type="button" onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Salvar agenda
        </button>
      </div>

      {/* Preview */}
      <div className="xl:sticky xl:top-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview</p>
        <div style={PREVIEW_STYLE}>
          {events.length > 0 ? (
            <EventsSection title={title} subtitle={subtitle} events={events} />
          ) : (
            <div className="py-16 text-center text-sm" style={{ color: "#101426", opacity: 0.4 }}>
              Nenhum evento adicionado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GaleriaEditor({ section, siteId }: { section: Section; siteId: string }) {
  const { toast } = useToast();
  const [title, setTitle] = useState(asString(section.content.title, "Galeria"));
  const [subtitle, setSubtitle] = useState(asString(section.content.subtitle));
  const [variant, setVariant] = useState(section.variant ?? "grid");
  const [images, setImages] = useState<GalleryImage[]>(
    Array.isArray(section.content.images)
      ? (section.content.images as GalleryImage[])
      : [],
  );
  const [saving, setSaving] = useState(false);

  function updateImage(i: number, patch: Partial<GalleryImage>) {
    setImages((prev) => prev.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          order: section.order,
          variant,
          content: { ...section.content, title, subtitle, images },
        }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) toast("Galeria salva!", "success");
      else toast(data?.error ?? "Erro ao salvar.", "error");
    } catch { toast("Erro ao salvar.", "error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="mt-5 grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Opcional" className={INPUT_CLS} />
          </div>
        </div>
        <div>
          <label className={LABEL_CLS}>Layout</label>
          <div className="mt-1.5 flex gap-2">
            {[{ id: "grid", label: "Grade" }, { id: "masonry", label: "Masonry" }, { id: "carousel", label: "Carrossel" }].map(({ id, label }) => (
              <button key={id} type="button" onClick={() => setVariant(id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${variant === id ? "border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]" : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">Imagem {i + 1}</span>
                {images.length > 0 && (
                  <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))} className="rounded p-1 text-red-400/60 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input value={img.url} placeholder="URL da imagem" onChange={(e) => updateImage(i, { url: e.target.value })} className={INPUT_CLS} />
              <input value={img.alt} placeholder="Texto alternativo (descrição)" onChange={(e) => updateImage(i, { alt: e.target.value })} className={INPUT_CLS} />
              <input value={img.caption ?? ""} placeholder="Legenda (opcional)" onChange={(e) => updateImage(i, { caption: e.target.value })} className={INPUT_CLS} />
            </div>
          ))}
          <button type="button" onClick={() => setImages((imgs) => [...imgs, { url: "", alt: "", caption: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar imagem
          </button>
        </div>
        <button type="button" onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Salvar galeria
        </button>
      </div>

      {/* Preview */}
      <div className="xl:sticky xl:top-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview</p>
        <div style={PREVIEW_STYLE}>
          {images.filter((img) => img.url).length > 0 ? (
            <GallerySection title={title} subtitle={subtitle} images={images.filter((img) => img.url)} variant={variant} />
          ) : (
            <div className="py-16 text-center text-sm" style={{ color: "#101426", opacity: 0.4 }}>
              Nenhuma imagem adicionada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

type PanelKey = "blog" | "agenda" | "galeria";

const PANELS: Array<{ key: PanelKey; label: string; Icon: typeof BookOpen; section: keyof Props }> = [
  { key: "blog",    label: "Blog / Artigos", Icon: BookOpen,     section: "blogSection" },
  { key: "agenda",  label: "Agenda",         Icon: CalendarDays, section: "eventsSection" },
  { key: "galeria", label: "Galeria",         Icon: ImageIcon,    section: "gallerySection" },
];

export function ExtrasEditor({ siteId, blogSection, eventsSection, gallerySection }: Props) {
  const [open, setOpen] = useState<PanelKey | null>("blog");
  const sections: Record<PanelKey, Section | null> = { blog: blogSection, agenda: eventsSection, galeria: gallerySection };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--platform-text)]/50">
        Edite o conteúdo das páginas extras do seu site. O preview atualiza em tempo real antes de salvar.
      </p>

      {PANELS.map(({ key, label, Icon }) => {
        const section = sections[key];
        const isOpen = open === key;

        return (
          <div key={key} className={`rounded-xl border transition ${isOpen ? "border-[#22D3EE]/30 bg-white/[0.02]" : "border-white/10"}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : key)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section ? "bg-[#22D3EE]/10" : "bg-white/5"}`}>
                  <Icon size={15} className={section ? "text-[#22D3EE]" : "text-[var(--platform-text)]/30"} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--platform-text)]">{label}</p>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${section ? "text-emerald-300" : "text-[var(--platform-text)]/30"}`}>
                    {section ? "Ativo" : "Não configurado"}
                  </p>
                </div>
              </div>
              <ChevronDown size={16} className={`text-[var(--platform-text)]/40 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                {section ? (
                  key === "blog" ? <BlogEditor section={section} siteId={siteId} /> :
                  key === "agenda" ? <AgendaEditor section={section} siteId={siteId} /> :
                  <GaleriaEditor section={section} siteId={siteId} />
                ) : (
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] py-8 text-center">
                    <p className="text-sm text-[var(--platform-text)]/40">
                      Esta seção não está ativa no seu site.
                    </p>
                    <p className="mt-1 text-xs text-[var(--platform-text)]/25">
                      Para ativar, fale com o suporte ou ative durante o onboarding.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
