"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layout, Grid3X3, Megaphone, User, Mail, Plus, Trash2, Save, Quote, HelpCircle, Monitor, X,
  BookOpen, ImageIcon, CalendarDays, ChevronUp, ChevronDown, ChevronRight, AlertTriangle,
} from "lucide-react";

import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { AdminLinkSelect } from "@/components/admin/admin-link-select";
import { validateImageForSlot } from "@/components/admin/image-validation";
import { MiniSitePreview } from "@/components/admin/minisite-preview";
import { IconPickerInline } from "@/components/onboarding/builders/icon-picker";
import { mediaPresets } from "@/lib/media/presets";
import type { Section } from "@/lib/tenant/types";

/* ─── Types ─────────────────────────────────────────────── */

type SiteOption = { id: string; name: string; domain: string };
type SectionsEditorProps = { sites: SiteOption[]; defaultSiteId: string | null; role?: "platform" | "client" };
type LoadState = "idle" | "loading" | "saving";
type StatusMessage = { type: "error" | "success"; message: string } | null;
type SectionSnapshots = Record<string, string>;
type ServiceCard = { title: string; description: string; iconName: string; imageUrl?: string; imageObjectPosition?: string; extraLines?: string[] };

/* ─── Helpers ────────────────────────────────────────────── */

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asCards(content: Record<string, unknown>): ServiceCard[] {
  const raw = content.cards;
  if (Array.isArray(raw)) {
    return raw.map((item: Record<string, unknown>) => ({
      title: typeof item?.title === "string" ? item.title : "",
      description: typeof item?.description === "string" ? item.description : "",
      iconName: typeof item?.iconName === "string" ? item.iconName : "",
      imageUrl: typeof item?.imageUrl === "string" ? item.imageUrl : "",
      imageObjectPosition: typeof item?.imageObjectPosition === "string" ? item.imageObjectPosition : "center center",
      extraLines: Array.isArray(item?.extraLines) ? (item.extraLines as unknown[]).filter((l): l is string => typeof l === "string") : [],
    }));
  }
  // Migrate from legacy "items" format
  const items = content.items;
  if (Array.isArray(items)) {
    return items
      .filter((i): i is string => typeof i === "string")
      .map((t) => ({ title: t, description: "", iconName: "", imageUrl: "" }));
  }
  return [];
}

function sortSections(sections: Section[]): Section[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function serializeSection(section: Section): string {
  return JSON.stringify({ id: section.id, type: section.type, variant: section.variant ?? "default", order: section.order, content: section.content });
}

function buildSectionSnapshots(sections: Section[]): SectionSnapshots {
  return Object.fromEntries(sections.map((s) => [s.id, serializeSection(s)]));
}

/* ─── Social channel definitions ─────────────────────────── */

type SocialLink = { type: string; url: string; label: string; icon: string };

const CHANNEL_DEFS = [
  { type: "whatsapp",  label: "WhatsApp",  placeholder: "Somente números (ex: 5511999999999)" },
  { type: "instagram", label: "Instagram", placeholder: "Ex: https://instagram.com/seu_perfil" },
  { type: "email",     label: "E-mail",    placeholder: "Ex: contato@seusite.com" },
  { type: "linkedin",  label: "LinkedIn",  placeholder: "Ex: https://linkedin.com/in/seu-perfil" },
  { type: "facebook",  label: "Facebook",  placeholder: "Ex: https://facebook.com/suapagina" },
] as const;

const CHANNEL_ICON: Record<string, string> = {
  whatsapp: "MessageCircle", instagram: "Instagram", email: "Mail", linkedin: "Linkedin", facebook: "Facebook",
};

const CHANNEL_PREFIX: Record<string, string> = {
  whatsapp: "wa.me/",
  instagram: "instagram.com/",
  facebook: "facebook.com/",
  linkedin: "linkedin.com/in/",
  email: "",
};

function parseSocialLinks(content: Record<string, unknown>): SocialLink[] {
  if (Array.isArray(content.socialLinks) && (content.socialLinks as unknown[]).length > 0) {
    return content.socialLinks as SocialLink[];
  }
  const links: SocialLink[] = [];
  const wa = typeof content.whatsappUrl === "string" ? content.whatsappUrl : "";
  if (wa) links.push({ type: "whatsapp", url: wa, label: "WhatsApp", icon: "MessageCircle" });
  const sec = typeof content.secondaryUrl === "string" ? content.secondaryUrl : "";
  if (sec.includes("instagram.com")) links.push({ type: "instagram", url: sec, label: "Instagram", icon: "Instagram" });
  else if (sec.startsWith("mailto:")) links.push({ type: "email", url: sec.replace("mailto:", ""), label: "E-mail", icon: "Mail" });
  return links;
}

function getChannelDisplayValue(links: SocialLink[], type: string): string {
  const link = links.find((l) => l.type === type);
  if (!link) return "";
  if (type === "whatsapp") return link.url.replace("https://wa.me/", "");
  if (type === "email") return link.url.replace("mailto:", "");
  return link.url;
}

function buildChannelUrl(type: string, raw: string): string {
  const v = raw.trim();
  if (type === "whatsapp") return `https://wa.me/${v.replace(/\D/g, "")}`;
  if (type === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const prefix = CHANNEL_PREFIX[type];
  return prefix ? `https://${prefix}${v}` : `https://${v}`;
}

/* ─────────────────────────────────────────────────────────── */

const SECTION_META: Record<string, { label: string; description: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  hero:         { label: "Destaque",           description: "Primeira impressão: título, subtítulo e botão de ação.",   Icon: Layout },
  services:     { label: "Serviços",           description: "Lista o que você oferece com cards e ícones.",             Icon: Grid3X3 },
  cta:          { label: "Chamada para ação",  description: "Convite direto para o cliente entrar em contato.",         Icon: Megaphone },
  about:        { label: "Sobre",              description: "Conte a sua história e diferenciais.",                     Icon: User },
  contact:      { label: "Contato",            description: "Canais de contato: WhatsApp, e-mail, redes sociais.",      Icon: Mail },
  testimonials: { label: "Depoimentos",        description: "Avaliações e feedbacks de clientes.",                      Icon: Quote },
  faq:          { label: "Perguntas Frequentes", description: "Respostas às dúvidas mais comuns.",                      Icon: HelpCircle },
  blog:         { label: "Blog / Artigos",     description: "Compartilhe conteúdo e novidades.",                        Icon: BookOpen },
  gallery:      { label: "Galeria de fotos",   description: "Mostre seu trabalho com imagens.",                         Icon: ImageIcon },
  events:       { label: "Agenda / Eventos",   description: "Divulgue eventos, palestras ou consultas.",                Icon: CalendarDays },
};

const INPUT_CLS = "mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]";
const PLATFORM_PALETTE = ["#3B82F6", "#7C5CFF", "#22D3EE", "#EAF0FF"];
const LABEL_CLS = "text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60";

/* ─── Component ──────────────────────────────────────────── */

export function SectionsEditor({ sites, defaultSiteId, role = "platform" }: SectionsEditorProps) {
  const isClient = role === "client";
  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [sections, setSections] = useState<Section[]>([]);
  const [siteTheme, setSiteTheme] = useState<Record<string, string> | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const [deletingSection, setDeletingSection] = useState<string | null>(null);
  const [syncedSectionsSnapshot, setSyncedSectionsSnapshot] = useState<SectionSnapshots>({});
  const [state, setState] = useState<LoadState>("idle");
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const hasSites = sites.length > 0;
  const canLoad = hasSites && Boolean(selectedSiteId);

  const sortedSites = useMemo(() => [...sites].sort((a, b) => a.name.localeCompare(b.name)), [sites]);
  const selectedSite = useMemo(() => sortedSites.find((s) => s.id === selectedSiteId) ?? null, [sortedSites, selectedSiteId]);
  const dirtySectionIds = useMemo(
    () => sections.filter((s) => serializeSection(s) !== syncedSectionsSnapshot[s.id]).map((s) => s.id),
    [sections, syncedSectionsSnapshot],
  );
  const hasUnsavedChanges = dirtySectionIds.length > 0;

  // Derive defaultSocials from loaded theme for AdminLinkSelect pre-fill
  const defaultSocials = useMemo<Record<string, string>>(() => {
    const rawLinks = (siteTheme as Record<string, unknown> | null)?.socialLinks;
    if (!Array.isArray(rawLinks)) return {};
    const links = rawLinks as SocialLink[];
    return Object.fromEntries(links.map((l) => [l.type, getChannelDisplayValue(links, l.type)]));
  }, [siteTheme]);

  /* ─── API functions (unchanged logic) ─── */

  async function loadSections(siteId: string) {
    setState("loading");
    setStatus(null);
    const response = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, { method: "GET", cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as
      | { sections?: Section[]; themeSettings?: Record<string, string>; error?: string; details?: string }
      | null;
    if (!response.ok) {
      setState("idle");
      setStatus({ type: "error", message: `${payload?.error ?? "Não foi possível carregar seções."} ${payload?.details ?? ""}`.trim() });
      return;
    }
    const loadedSections = sortSections(payload?.sections ?? []);
    setSections(loadedSections);
    setSiteTheme(payload?.themeSettings ?? null);
    setSyncedSectionsSnapshot(buildSectionSnapshots(loadedSections));
    // Auto-expand only the first section
    if (loadedSections.length > 0) {
      setExpandedSectionIds(new Set([loadedSections[0].id]));
    }
    setState("idle");
  }

  useEffect(() => {
    if (!canLoad) return;
    setActiveSectionId(null);
    void loadSections(selectedSiteId);
  }, [selectedSiteId, canLoad]);

  function updateSection(sectionId: string, updater: (current: Section) => Section) {
    setSections((cur) => cur.map((s) => (s.id === sectionId ? updater(s) : s)));
  }

  function updateContent(sectionId: string, key: string, value: unknown) {
    updateSection(sectionId, (cur) => ({ ...cur, content: { ...cur.content, [key]: value } }));
  }

  async function uploadImageForSection(section: Section, file: File, contentKey = "imageUrl") {
    if (!selectedSiteId) {
      setStatus({ type: "error", message: "Selecione um site antes do upload." });
      return;
    }
    setUploadingSectionId(section.id);
    setStatus(null);
    const formData = new FormData();
    formData.append("siteId", selectedSiteId);
    formData.append("sectionType", section.type);
    formData.append("slot", section.type);
    formData.append("file", file);
    const response = await fetch("/api/admin/upload-asset", { method: "POST", body: formData });
    const payload = (await response.json().catch(() => null)) as { url?: string; error?: string; details?: string } | null;
    setUploadingSectionId(null);
    if (!response.ok || !payload?.url) {
      setStatus({ type: "error", message: `${payload?.error ?? "Falha no upload."} ${payload?.details ?? ""}`.trim() });
      return;
    }
    updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, [contentKey]: payload.url } }));
    setStatus({ type: "success", message: "Imagem enviada. Clique em salvar para publicar." });
  }

  async function uploadCardImage(section: Section, cardIndex: number, file: File) {
    if (!selectedSiteId) {
      setStatus({ type: "error", message: "Selecione um site antes do upload." });
      return;
    }
    setUploadingSectionId(section.id);
    setStatus(null);
    const formData = new FormData();
    formData.append("siteId", selectedSiteId);
    formData.append("sectionType", "services");
    formData.append("slot", `services-card-${cardIndex}`);
    formData.append("file", file);
    const response = await fetch("/api/admin/upload-asset", { method: "POST", body: formData });
    const payload = (await response.json().catch(() => null)) as { url?: string; error?: string; details?: string } | null;
    setUploadingSectionId(null);
    if (!response.ok || !payload?.url) {
      setStatus({ type: "error", message: `${payload?.error ?? "Falha no upload."} ${payload?.details ?? ""}`.trim() });
      return;
    }
    const cards = asCards(section.content);
    const updated = cards.map((c, i) => (i === cardIndex ? { ...c, imageUrl: payload.url } : c));
    updateContent(section.id, "cards", updated);
    setStatus({ type: "success", message: "Imagem do card enviada." });
  }

  async function persistSection(section: Section) {
    const response = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId: section.id, order: section.order, variant: section.variant ?? "default", content: section.content }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; section?: Section; error?: string; details?: string } | null;
    if (!response.ok || !payload?.section) {
      throw new Error(`${payload?.error ?? "Não foi possível salvar seção."} ${payload?.details ?? ""}`.trim());
    }
    return payload.section;
  }

  async function saveSection(section: Section) {
    setState("saving");
    setStatus(null);
    try {
      const saved = await persistSection(section);
      const updated = sortSections(sections.map((s) => (s.id === saved.id ? saved : s)));
      setSections(updated);
      setSyncedSectionsSnapshot((cur) => ({ ...cur, [saved.id]: serializeSection(saved) }));
      setStatus({ type: "success", message: `Seção "${SECTION_META[saved.type]?.label ?? saved.type}" salva.` });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao salvar." });
    } finally {
      setState("idle");
    }
  }

  async function handleReorder(sectionId: string, direction: "up" | "down") {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === sectionId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setState("saving");
    try {
      await Promise.all([
        fetch(`/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: a.id, order: b.order, variant: a.variant ?? "default", content: a.content }),
        }),
        fetch(`/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: b.id, order: a.order, variant: b.variant ?? "default", content: b.content }),
        }),
      ]);
      setSections((prev) =>
        prev.map((s) => s.id === a.id ? { ...s, order: b.order } : s.id === b.id ? { ...s, order: a.order } : s),
      );
    } catch {
      setStatus({ type: "error", message: "Erro ao reordenar seções." });
    } finally {
      setState("idle");
    }
  }

  function toggleExpanded(sectionId: string) {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) { next.delete(sectionId); } else { next.add(sectionId); }
      return next;
    });
  }

  async function handleAddSection(type: Section["type"]) {
    if (!selectedSiteId) return;
    setState("saving");
    setStatus(null);
    const response = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; section?: Section; error?: string } | null;
    setState("idle");
    if (!response.ok || !payload?.section) {
      setStatus({ type: "error", message: payload?.error ?? "Não foi possível adicionar a seção." });
      return;
    }
    const newSection = payload.section;
    setSections((prev) => sortSections([...prev, newSection]));
    setSyncedSectionsSnapshot((prev) => ({ ...prev, [newSection.id]: serializeSection(newSection) }));
    setExpandedSectionIds((prev) => new Set([...prev, newSection.id]));
    setStatus({ type: "success", message: `Seção "${SECTION_META[type]?.label ?? type}" adicionada.` });
  }

  async function handleDeleteSection(sectionId: string) {
    if (!selectedSiteId) return;
    setState("saving");
    setStatus(null);
    const response = await fetch(
      `/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}&sectionId=${encodeURIComponent(sectionId)}`,
      { method: "DELETE" },
    );
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    setState("idle");
    if (!response.ok || !payload?.ok) {
      setStatus({ type: "error", message: payload?.error ?? "Não foi possível remover a seção." });
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSyncedSectionsSnapshot((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setDeletingSection(null);
    if (activeSectionId === sectionId) setActiveSectionId(null);
  }

  async function saveAllSections() {
    const dirty = sections.filter((s) => dirtySectionIds.includes(s.id));
    if (dirty.length === 0) { setStatus({ type: "success", message: "Sem alterações pendentes." }); return; }
    setState("saving");
    setStatus(null);
    try {
      const map = new Map<string, Section>();
      for (const s of dirty) { const saved = await persistSection(s); map.set(saved.id, saved); }
      setSections(sortSections(sections.map((s) => map.get(s.id) ?? s)));
      setSyncedSectionsSnapshot((cur) => ({ ...cur, ...Object.fromEntries(Array.from(map.entries()).map(([id, s]) => [id, serializeSection(s)])) }));
      setStatus({ type: "success", message: `${map.size} seções salvas.` });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao salvar." });
    } finally {
      setState("idle");
    }
  }

  /* ─── Section field renderers ─── */

  function renderHeroFields(section: Section) {
    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Eyebrow</label>
            <input
              value={asString(section.content.eyebrow)}
              placeholder="Ex: Psicóloga em São Paulo"
              onChange={(e) => updateContent(section.id, "eyebrow", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Texto do botão</label>
            <input
              value={asString(section.content.ctaLabel)}
              placeholder="Ex: Agendar conversa"
              onChange={(e) => updateContent(section.id, "ctaLabel", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
        </div>
        <div>
          <label className={LABEL_CLS}>Título</label>
          <RichTextEditor
            value={asString(section.content.title)}
            onChange={(html) => updateContent(section.id, "title", html)}
            placeholder="Título principal"
            paletteColors={PLATFORM_PALETTE}
            singleLine
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Subtítulo</label>
          <RichTextEditor
            value={asString(section.content.subtitle)}
            onChange={(html) => updateContent(section.id, "subtitle", html)}
            placeholder="Descrição curta do negócio"
            paletteColors={PLATFORM_PALETTE}
            minHeight="3rem"
          />
        </div>

        <div>
          <label className={LABEL_CLS}>Link do botão</label>
          <div className="mt-1">
            <AdminLinkSelect
              value={asString(section.content.ctaHref)}
              onChange={(url) => updateContent(section.id, "ctaHref", url)}
              placeholder="Escolha o destino do botão"
              defaultSocials={defaultSocials}
            />
          </div>
        </div>

        <AdminImageUpload
          label="Imagem do Destaque"
          currentUrl={asString(section.content.imageUrl)}
          onFileSelect={async (file) => {
            const err = await validateImageForSlot(file, "hero");
            if (err) { setStatus({ type: "error", message: err }); return; }
            void uploadImageForSection(section, file);
          }}
          onRemove={() => updateContent(section.id, "imageUrl", "")}
          disabled={uploadingSectionId === section.id}
          recommendedText={mediaPresets.hero.recommendedText}
          aspectRatio="16/9"
          objectPosition={asString(section.content.imageObjectPosition, "center center")}
          onPositionChange={(pos) => updateContent(section.id, "imageObjectPosition", pos)}
        />
      </div>
    );
  }

  function renderServicesFields(section: Section) {
    const cards = asCards(section.content);

    function updateCard(index: number, patch: Partial<ServiceCard>) {
      const updated = cards.map((c, i) => (i === index ? { ...c, ...patch } : c));
      updateContent(section.id, "cards", updated);
    }

    function addCard() {
      updateContent(section.id, "cards", [...cards, { title: "", description: "", iconName: "Star", imageUrl: "", extraLines: [] }]);
    }

    function removeCard(index: number) {
      updateContent(section.id, "cards", cards.filter((_, i) => i !== index));
    }

    return (
      <div className="mt-4 space-y-4">
        <div>
          <label className={LABEL_CLS}>Título da seção</label>
          <input
            value={asString(section.content.title)}
            placeholder="Serviços"
            onChange={(e) => updateContent(section.id, "title", e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <AdminImageUpload
          label="Imagem da seção"
          currentUrl={asString(section.content.imageUrl)}
          onFileSelect={async (file) => {
            const err = await validateImageForSlot(file, "services");
            if (err) { setStatus({ type: "error", message: err }); return; }
            void uploadImageForSection(section, file);
          }}
          onRemove={() => updateContent(section.id, "imageUrl", "")}
          disabled={uploadingSectionId === section.id}
          recommendedText={mediaPresets.services.recommendedText}
          aspectRatio="4/3"
          objectPosition={asString(section.content.imageObjectPosition, "center center")}
          onPositionChange={(pos) => updateContent(section.id, "imageObjectPosition", pos)}
        />

        <div>
          <label className={LABEL_CLS}>Cards de serviço</label>
          <div className="mt-2 space-y-3">
            {cards.map((card, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-[#0B1020]/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">
                    Card {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="rounded p-1 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  <RichTextEditor
                    value={card.title}
                    onChange={(html) => updateCard(index, { title: html })}
                    placeholder="Nome do serviço"
                    paletteColors={PLATFORM_PALETTE}
                    singleLine
                  />
                  <RichTextEditor
                    value={card.description}
                    onChange={(html) => updateCard(index, { description: html })}
                    placeholder="Descrição curta"
                    paletteColors={PLATFORM_PALETTE}
                    minHeight="2.5rem"
                  />
                </div>

                {/* Extra lines */}
                <div className="mt-2 space-y-1.5">
                  {(card.extraLines ?? []).map((line, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      <input
                        value={line}
                        placeholder={`Linha ${li + 1}`}
                        onChange={(e) => {
                          const updated = [...(card.extraLines ?? [])];
                          updated[li] = e.target.value;
                          updateCard(index, { extraLines: updated });
                        }}
                        className={INPUT_CLS}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (card.extraLines ?? []).filter((_, i) => i !== li);
                          updateCard(index, { extraLines: updated });
                        }}
                        className="rounded p-1 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateCard(index, { extraLines: [...(card.extraLines ?? []), ""] })}
                    className="flex items-center gap-1 text-[10px] text-[var(--platform-text)]/40 transition hover:text-[#22D3EE]"
                  >
                    <Plus size={11} />
                    Adicionar linha de texto
                  </button>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] text-[var(--platform-text)]/40">Ícone</span>
                  <IconPickerInline
                    selectedIcon={card.iconName}
                    onSelect={(name) => updateCard(index, { iconName: name })}
                  />
                </div>

                <div className="mt-2">
                  <AdminImageUpload
                    label="Imagem do card"
                    currentUrl={card.imageUrl || ""}
                    onFileSelect={(file) => void uploadCardImage(section, index, file)}
                    onRemove={() => updateCard(index, { imageUrl: "" })}
                    disabled={uploadingSectionId === section.id}
                    aspectRatio="4/3"
                    objectPosition={card.imageObjectPosition ?? "center center"}
                    onPositionChange={(pos) => updateCard(index, { imageObjectPosition: pos })}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCard}
            className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
          >
            <Plus size={13} />
            Adicionar serviço
          </button>
        </div>
      </div>
    );
  }

  function renderCtaFields(section: Section) {
    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Texto do botão</label>
            <input
              value={asString(section.content.buttonLabel)}
              placeholder="Ex: Entrar em contato"
              onChange={(e) => updateContent(section.id, "buttonLabel", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Botão secundário (texto)</label>
            <input
              value={asString(section.content.secondaryLabel)}
              placeholder="Opcional"
              onChange={(e) => updateContent(section.id, "secondaryLabel", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
        </div>
        <div>
          <label className={LABEL_CLS}>Título</label>
          <RichTextEditor
            value={asString(section.content.title)}
            onChange={(html) => updateContent(section.id, "title", html)}
            placeholder="Ex: Vamos conversar?"
            paletteColors={PLATFORM_PALETTE}
            singleLine
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Descrição</label>
          <RichTextEditor
            value={asString(section.content.description)}
            onChange={(html) => updateContent(section.id, "description", html)}
            placeholder="Texto de apoio do CTA"
            paletteColors={PLATFORM_PALETTE}
            minHeight="3rem"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Link do botão</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.buttonHref)}
                onChange={(url) => updateContent(section.id, "buttonHref", url)}
                defaultSocials={defaultSocials}
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}>Link botão secundário</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.secondaryHref)}
                onChange={(url) => updateContent(section.id, "secondaryHref", url)}
                defaultSocials={defaultSocials}
              />
            </div>
          </div>
        </div>

        <AdminImageUpload
          label="Imagem do CTA"
          currentUrl={asString(section.content.imageUrl)}
          onFileSelect={async (file) => {
            const err = await validateImageForSlot(file, "cta");
            if (err) { setStatus({ type: "error", message: err }); return; }
            void uploadImageForSection(section, file);
          }}
          onRemove={() => updateContent(section.id, "imageUrl", "")}
          disabled={uploadingSectionId === section.id}
          recommendedText={mediaPresets.cta.recommendedText}
          aspectRatio="16/9"
          objectPosition={asString(section.content.imageObjectPosition, "center center")}
          onPositionChange={(pos) => updateContent(section.id, "imageObjectPosition", pos)}
        />
      </div>
    );
  }

  function renderAboutFields(section: Section) {
    return (
      <div className="mt-4 space-y-4">
        <div>
          <label className={LABEL_CLS}>Título</label>
          <RichTextEditor
            value={asString(section.content.title)}
            onChange={(html) => updateContent(section.id, "title", html)}
            placeholder="Ex: Sobre mim"
            paletteColors={PLATFORM_PALETTE}
            singleLine
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Texto</label>
          <RichTextEditor
            value={asString(section.content.body)}
            onChange={(html) => updateContent(section.id, "body", html)}
            placeholder="Descreva seu negócio, sua história ou diferenciais..."
            paletteColors={PLATFORM_PALETTE}
            minHeight="8rem"
          />
        </div>
        <AdminImageUpload
          label="Foto / imagem do Sobre"
          currentUrl={asString(section.content.imageUrl)}
          onFileSelect={async (file) => {
            const err = await validateImageForSlot(file, "about");
            if (err) { setStatus({ type: "error", message: err }); return; }
            void uploadImageForSection(section, file);
          }}
          onRemove={() => updateContent(section.id, "imageUrl", "")}
          disabled={uploadingSectionId === section.id}
          aspectRatio="3/4"
          objectPosition={asString(section.content.imageObjectPosition, "center center")}
          onPositionChange={(pos) => updateContent(section.id, "imageObjectPosition", pos)}
        />
      </div>
    );
  }

  function renderContactFields(section: Section) {
    const links = parseSocialLinks(section.content);

    function updateChannel(type: string, rawValue: string) {
      const withoutType = links.filter((l) => l.type !== type);
      const newLinks = rawValue.trim()
        ? [...withoutType, { type, url: buildChannelUrl(type, rawValue), label: CHANNEL_ICON[type] ?? type, icon: CHANNEL_ICON[type] ?? "Link" }]
        : withoutType;
      const waUrl = newLinks.find((l) => l.type === "whatsapp")?.url ?? "";
      updateSection(section.id, (cur) => ({
        ...cur,
        content: { ...cur.content, socialLinks: newLinks, whatsappUrl: waUrl },
      }));
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input
              value={asString(section.content.title, "Contato")}
              placeholder="Ex: Contato"
              onChange={(e) => updateContent(section.id, "title", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input
              value={asString(section.content.subtitle)}
              placeholder="Ex: Entre em contato pelos canais abaixo"
              onChange={(e) => updateContent(section.id, "subtitle", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLS}>Canais de contato</label>
          <p className="mb-2 mt-0.5 text-[11px] text-[var(--platform-text)]/40">
            Preencha os canais que deseja exibir. Deixe em branco para ocultar.
          </p>
          <div className="space-y-2">
            {CHANNEL_DEFS.map(({ type, label, placeholder }) => {
              const prefix = CHANNEL_PREFIX[type] ?? "";
              return (
                <div key={type} className="flex items-center gap-2">
                  <span className="w-[78px] shrink-0 text-xs text-[var(--platform-text)]/60">{label}</span>
                  <div className="relative flex-1">
                    {prefix && (
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-xs text-[var(--platform-text)]/40">
                        {prefix}
                      </span>
                    )}
                    <input
                      value={getChannelDisplayValue(links, type)}
                      placeholder={placeholder}
                      onChange={(e) => updateChannel(type, e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#0B1020] py-2 pr-3 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]"
                      style={{ paddingLeft: prefix ? `${prefix.length * 7 + 12}px` : "12px" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderTestimonialsFields(section: Section) {
    const items: Array<{ quote: string; author: string }> = Array.isArray(section.content.items)
      ? (section.content.items as Array<{ quote: string; author: string }>)
      : [];

    function updateItem(index: number, key: "quote" | "author", value: string) {
      const updated = items.map((item, i) => i === index ? { ...item, [key]: value } : item);
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    function addItem() {
      const updated = [...items, { quote: "", author: "" }];
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    function removeItem(index: number) {
      const updated = items.filter((_, i) => i !== index);
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    return (
      <div className="mt-4 space-y-4">
        {/* Variant picker */}
        <div>
          <label className={LABEL_CLS}>Layout</label>
          <div className="mt-1.5 flex gap-2">
            {[
              { id: "grid", label: "Grade" },
              { id: "carousel", label: "Carrossel" },
              { id: "split", label: "Destaque" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => updateSection(section.id, (cur) => ({ ...cur, variant: id }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  (section.variant ?? "grid") === id
                    ? "border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]"
                    : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={LABEL_CLS}>Título</label>
          <input
            value={asString(section.content.title, "Depoimentos")}
            onChange={(e) => updateContent(section.id, "title", e.target.value)}
            className={INPUT_CLS}
          />
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <textarea
                value={item.quote}
                onChange={(e) => updateItem(i, "quote", e.target.value)}
                placeholder="Depoimento..."
                rows={2}
                className={INPUT_CLS + " resize-none"}
              />
              <input
                value={item.author}
                onChange={(e) => updateItem(i, "author", e.target.value)}
                placeholder="Nome do cliente"
                className={INPUT_CLS}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.08]"
          >
            <Plus size={13} /> Adicionar depoimento
          </button>
        </div>
      </div>
    );
  }

  function renderFaqFields(section: Section) {
    const items: Array<{ question: string; answer: string }> = Array.isArray(section.content.items)
      ? (section.content.items as Array<{ question: string; answer: string }>)
      : [];

    function updateItem(index: number, key: "question" | "answer", value: string) {
      const updated = items.map((item, i) => i === index ? { ...item, [key]: value } : item);
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    function addItem() {
      const updated = [...items, { question: "", answer: "" }];
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    function removeItem(index: number) {
      const updated = items.filter((_, i) => i !== index);
      updateSection(section.id, (cur) => ({ ...cur, content: { ...cur.content, items: updated } }));
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input
              value={asString(section.content.title, "Perguntas frequentes")}
              onChange={(e) => updateContent(section.id, "title", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo (opcional)</label>
            <input
              value={asString(section.content.subtitle)}
              onChange={(e) => updateContent(section.id, "subtitle", e.target.value)}
              className={INPUT_CLS}
            />
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <input
                value={item.question}
                onChange={(e) => updateItem(i, "question", e.target.value)}
                placeholder="Pergunta..."
                className={INPUT_CLS}
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(i, "answer", e.target.value)}
                placeholder="Resposta..."
                rows={2}
                className={INPUT_CLS + " resize-none"}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.08]"
          >
            <Plus size={13} /> Adicionar pergunta
          </button>
        </div>
      </div>
    );
  }

  function renderBlogFields(section: Section) {
    const posts: Array<{ title: string; excerpt: string; imageUrl?: string; link?: string }> =
      Array.isArray(section.content.posts)
        ? (section.content.posts as Array<{ title: string; excerpt: string; imageUrl?: string; link?: string }>)
        : [];

    function updatePost(index: number, patch: Partial<{ title: string; excerpt: string; imageUrl: string; link: string }>) {
      const updated = posts.map((p, i) => (i === index ? { ...p, ...patch } : p));
      updateContent(section.id, "posts", updated);
    }

    function addPost() {
      updateContent(section.id, "posts", [...posts, { title: "", excerpt: "", imageUrl: "", link: "" }]);
    }

    function removePost(index: number) {
      updateContent(section.id, "posts", posts.filter((_, i) => i !== index));
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={asString(section.content.title, "Blog")} onChange={(e) => updateContent(section.id, "title", e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={asString(section.content.subtitle)} placeholder="Opcional" onChange={(e) => updateContent(section.id, "subtitle", e.target.value)} className={INPUT_CLS} />
          </div>
        </div>
        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">Artigo {i + 1}</span>
                {posts.length > 1 && (
                  <button type="button" onClick={() => removePost(i)} className="rounded p-1 text-red-400/60 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <input value={post.title} placeholder="Título do artigo" onChange={(e) => updatePost(i, { title: e.target.value })} className={INPUT_CLS} />
              <textarea value={post.excerpt} placeholder="Resumo do artigo..." rows={2} onChange={(e) => updatePost(i, { excerpt: e.target.value })} className={INPUT_CLS + " resize-none"} />
              <input value={post.link ?? ""} placeholder="Link (opcional)" onChange={(e) => updatePost(i, { link: e.target.value })} className={INPUT_CLS} />
              <AdminImageUpload
                label="Imagem de capa"
                currentUrl={post.imageUrl ?? ""}
                onFileSelect={async (file) => {
                  if (!selectedSiteId) return;
                  setUploadingSectionId(section.id);
                  const fd = new FormData();
                  fd.append("siteId", selectedSiteId);
                  fd.append("sectionType", "blog");
                  fd.append("slot", `blog-post-${i}`);
                  fd.append("file", file);
                  const res = await fetch("/api/admin/upload-asset", { method: "POST", body: fd });
                  const payload = (await res.json().catch(() => null)) as { url?: string } | null;
                  setUploadingSectionId(null);
                  if (payload?.url) updatePost(i, { imageUrl: payload.url });
                }}
                onRemove={() => updatePost(i, { imageUrl: "" })}
                disabled={uploadingSectionId === section.id}
                aspectRatio="16/9"
              />
            </div>
          ))}
          <button type="button" onClick={addPost} className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar artigo
          </button>
        </div>
      </div>
    );
  }

  function renderGalleryFields(section: Section) {
    const images: Array<{ url: string; alt: string; caption?: string }> =
      Array.isArray(section.content.images)
        ? (section.content.images as Array<{ url: string; alt: string; caption?: string }>)
        : [];

    function updateImage(index: number, patch: Partial<{ url: string; alt: string; caption: string }>) {
      const updated = images.map((img, i) => (i === index ? { ...img, ...patch } : img));
      updateContent(section.id, "images", updated);
    }

    function removeImage(index: number) {
      updateContent(section.id, "images", images.filter((_, i) => i !== index));
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={asString(section.content.title, "Galeria")} onChange={(e) => updateContent(section.id, "title", e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={asString(section.content.subtitle)} placeholder="Opcional" onChange={(e) => updateContent(section.id, "subtitle", e.target.value)} className={INPUT_CLS} />
          </div>
        </div>

        <div>
          <label className={LABEL_CLS}>Layout</label>
          <div className="mt-1.5 flex gap-2">
            {[{ id: "grid", label: "Grade" }, { id: "masonry", label: "Masonry" }, { id: "carousel", label: "Carrossel" }].map(({ id, label }) => (
              <button key={id} type="button" onClick={() => updateSection(section.id, (cur) => ({ ...cur, variant: id }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${(section.variant ?? "grid") === id ? "border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]" : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"}`}>
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
                {images.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)} className="rounded p-1 text-red-400/60 hover:text-red-400"><Trash2 size={12} /></button>
                )}
              </div>
              <AdminImageUpload
                label="Imagem"
                currentUrl={img.url}
                onFileSelect={async (file) => {
                  if (!selectedSiteId) return;
                  setUploadingSectionId(section.id);
                  const fd = new FormData();
                  fd.append("siteId", selectedSiteId);
                  fd.append("sectionType", "gallery");
                  fd.append("slot", `gallery-img-${i}`);
                  fd.append("file", file);
                  const res = await fetch("/api/admin/upload-asset", { method: "POST", body: fd });
                  const payload = (await res.json().catch(() => null)) as { url?: string } | null;
                  setUploadingSectionId(null);
                  if (payload?.url) updateImage(i, { url: payload.url });
                }}
                onRemove={() => updateImage(i, { url: "" })}
                disabled={uploadingSectionId === section.id}
                aspectRatio="4/3"
              />
              <input value={img.alt} placeholder="Texto alternativo (descrição)" onChange={(e) => updateImage(i, { alt: e.target.value })} className={INPUT_CLS} />
              <input value={img.caption ?? ""} placeholder="Legenda (opcional)" onChange={(e) => updateImage(i, { caption: e.target.value })} className={INPUT_CLS} />
            </div>
          ))}
          <button type="button"
            onClick={() => updateContent(section.id, "images", [...images, { url: "", alt: "", caption: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar imagem
          </button>
        </div>
      </div>
    );
  }

  function renderEventsFields(section: Section) {
    const events: Array<{ title: string; date: string; time?: string; location?: string; description?: string }> =
      Array.isArray(section.content.events)
        ? (section.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string }>)
        : [];

    function updateEvent(index: number, patch: Partial<{ title: string; date: string; time: string; location: string; description: string }>) {
      const updated = events.map((ev, i) => (i === index ? { ...ev, ...patch } : ev));
      updateContent(section.id, "events", updated);
    }

    function removeEvent(index: number) {
      updateContent(section.id, "events", events.filter((_, i) => i !== index));
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Título</label>
            <input value={asString(section.content.title, "Eventos")} onChange={(e) => updateContent(section.id, "title", e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Subtítulo</label>
            <input value={asString(section.content.subtitle)} placeholder="Opcional" onChange={(e) => updateContent(section.id, "subtitle", e.target.value)} className={INPUT_CLS} />
          </div>
        </div>
        <div className="space-y-3">
          {events.map((ev, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--platform-text)]/30">Evento {i + 1}</span>
                {events.length > 1 && (
                  <button type="button" onClick={() => removeEvent(i)} className="rounded p-1 text-red-400/60 hover:text-red-400"><Trash2 size={13} /></button>
                )}
              </div>
              <input value={ev.title} placeholder="Nome do evento" onChange={(e) => updateEvent(i, { title: e.target.value })} className={INPUT_CLS} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={LABEL_CLS}>Data</label>
                  <input type="date" value={ev.date} onChange={(e) => updateEvent(i, { date: e.target.value })} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Horário (opcional)</label>
                  <input type="time" value={ev.time ?? ""} onChange={(e) => updateEvent(i, { time: e.target.value })} className={INPUT_CLS} />
                </div>
              </div>
              <input value={ev.location ?? ""} placeholder="Local (opcional)" onChange={(e) => updateEvent(i, { location: e.target.value })} className={INPUT_CLS} />
              <textarea value={ev.description ?? ""} placeholder="Descrição (opcional)" rows={2} onChange={(e) => updateEvent(i, { description: e.target.value })} className={INPUT_CLS + " resize-none"} />
            </div>
          ))}
          <button type="button"
            onClick={() => updateContent(section.id, "events", [...events, { title: "", date: "", time: "", location: "", description: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-[var(--platform-text)]/60 hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Plus size={13} /> Adicionar evento
          </button>
        </div>
      </div>
    );
  }

  /* ─── Render ─── */

  if (!hasSites) {
    return (
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-[var(--platform-text)]">Seções do site</h2>
        <p className="mt-2 text-sm text-[var(--platform-text)]/70">
          Nenhum site disponível para edição neste usuário.
        </p>
      </section>
    );
  }

  const activeTypesSet = new Set(sections.map((s) => s.type));
  const availableToAdd = (Object.keys(SECTION_META) as Section["type"][]).filter((t) => !activeTypesSet.has(t));

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--platform-text)]">Seções do site</h2>
          <p className="mt-1 text-sm text-[var(--platform-text)]/70">
            Adicione, edite e organize as seções da página inicial.
          </p>
        </div>
        {!isClient && (
          <div className="w-full max-w-sm">
            <label className={LABEL_CLS} htmlFor="site-picker">Site</label>
            <select
              id="site-picker"
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            >
              {sortedSites.map((site) => (
                <option key={site.id} value={site.id}>{site.name} - {site.domain}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasUnsavedChanges && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-300/20 bg-amber-500/5 px-4 py-2.5">
          <span className="text-xs text-amber-300">
            {dirtySectionIds.length === 1 ? "1 seção com alterações não salvas." : `${dirtySectionIds.length} seções com alterações não salvas.`}
          </span>
          <button
            type="button"
            onClick={() => void saveAllSections()}
            disabled={state === "saving"}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            <Save size={12} />
            {state === "saving" ? "Salvando..." : "Salvar tudo"}
          </button>
        </div>
      )}

      {status && (
        <p className={`mt-4 rounded-lg px-3 py-2 text-xs ${
          status.type === "error"
            ? "border border-red-300/40 bg-red-500/10 text-red-200"
            : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
        }`}>
          {status.message}
        </p>
      )}

      {state === "loading" && (
        <p className="mt-4 text-sm text-[var(--platform-text)]/70">Carregando seções...</p>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.1fr] xl:items-start">
        <div className="space-y-3">
          {sections.length === 0 && state !== "loading" && (
            <div className="rounded-xl border border-dashed border-white/15 py-8 text-center">
              <p className="text-sm text-[var(--platform-text)]/50">Nenhuma seção ainda.</p>
              <p className="mt-1 text-xs text-[var(--platform-text)]/30">Adicione seções abaixo para montar sua página.</p>
            </div>
          )}

          {[...sections].sort((a, b) => a.order - b.order).map((section, index, sortedArr) => {
            const meta = SECTION_META[section.type] ?? { label: section.type, description: "", Icon: Layout };
            const SectionIcon = meta.Icon;
            const isDirty = dirtySectionIds.includes(section.id);
            const isExpanded = expandedSectionIds.has(section.id);
            const isConfirmingDelete = deletingSection === section.id;

            return (
              <article
                key={section.id}
                onMouseEnter={() => setActiveSectionId(section.id)}
                onFocusCapture={() => setActiveSectionId(section.id)}
                className={`rounded-2xl border bg-[#12182B] transition ${
                  activeSectionId === section.id
                    ? "border-[#22D3EE]/60 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "border-white/10"
                }`}
              >
                {/* Section header — always visible, click to expand/collapse */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(section.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  {isClient && (
                    <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0 || state === "saving"}
                        onClick={() => void handleReorder(section.id, "up")}
                        className="flex h-5 w-5 items-center justify-center rounded text-[var(--platform-text)]/40 transition hover:bg-white/10 hover:text-[var(--platform-text)] disabled:cursor-not-allowed disabled:opacity-20"
                        title="Mover para cima"
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={index === sortedArr.length - 1 || state === "saving"}
                        onClick={() => void handleReorder(section.id, "down")}
                        className="flex h-5 w-5 items-center justify-center rounded text-[var(--platform-text)]/40 transition hover:bg-white/10 hover:text-[var(--platform-text)] disabled:cursor-not-allowed disabled:opacity-20"
                        title="Mover para baixo"
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                    <SectionIcon size={16} className="text-[#22D3EE]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--platform-text)]">{meta.label}</span>
                      {isDirty && (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                          Não salvo
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[var(--platform-text)]/40">{meta.description}</p>
                  </div>
                  <ChevronRight
                    size={15}
                    className={`shrink-0 text-[var(--platform-text)]/30 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] px-4 pb-4">
                    {/* Platform-only variant/order */}
                    {!isClient && (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <label className={LABEL_CLS}>Variante</label>
                          <input
                            value={section.variant ?? "default"}
                            onChange={(e) => updateSection(section.id, (cur) => ({ ...cur, variant: e.target.value }))}
                            className={INPUT_CLS}
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Ordem</label>
                          <input
                            type="number"
                            value={section.order}
                            onChange={(e) => updateSection(section.id, (cur) => ({ ...cur, order: Number(e.target.value || "0") }))}
                            className={INPUT_CLS}
                          />
                        </div>
                      </div>
                    )}

                    {/* Section-specific fields */}
                    {section.type === "hero" && renderHeroFields(section)}
                    {section.type === "services" && renderServicesFields(section)}
                    {section.type === "cta" && renderCtaFields(section)}
                    {section.type === "about" && renderAboutFields(section)}
                    {section.type === "contact" && renderContactFields(section)}
                    {section.type === "testimonials" && renderTestimonialsFields(section)}
                    {section.type === "faq" && renderFaqFields(section)}
                    {section.type === "blog" && renderBlogFields(section)}
                    {section.type === "gallery" && renderGalleryFields(section)}
                    {section.type === "events" && renderEventsFields(section)}

                    {/* Footer actions */}
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                      {/* Delete section */}
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={13} className="shrink-0 text-red-400" />
                          <span className="text-xs text-red-300">Remover esta seção?</span>
                          <button
                            type="button"
                            onClick={() => void handleDeleteSection(section.id)}
                            disabled={state === "saving"}
                            className="rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
                          >
                            Sim, remover
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSection(null)}
                            className="text-xs text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingSection(section.id)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--platform-text)]/40 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                          Remover seção
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => void saveSection(section)}
                        disabled={state === "saving" || !isDirty}
                        className="flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save size={12} />
                        {state === "saving" ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {/* Add Section Panel */}
          {availableToAdd.length > 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--platform-text)]/40">
                Adicionar seção
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availableToAdd.map((type) => {
                  const meta = SECTION_META[type];
                  const SectionIcon = meta.Icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={state === "saving"}
                      onClick={() => void handleAddSection(type)}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left transition hover:border-[#22D3EE]/30 hover:bg-[#22D3EE]/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#22D3EE]/8">
                        <SectionIcon size={14} className="text-[#22D3EE]/70" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--platform-text)]/80">{meta.label}</p>
                        <p className="mt-0.5 truncate text-[10px] text-[var(--platform-text)]/35">{meta.description}</p>
                      </div>
                      <Plus size={13} className="ml-auto shrink-0 text-[#22D3EE]/50" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <MiniSitePreview
          siteName={selectedSite?.name ?? "Site"}
          siteDomain={selectedSite?.domain ?? "tenant.local"}
          sections={sections}
          hasUnsavedChanges={hasUnsavedChanges}
          activeSectionId={activeSectionId}
          themeSettings={siteTheme}
        />
      </div>

      {/* Floating preview button — visible only on <xl screens */}
      {canLoad && sections.length > 0 && (
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-3 text-sm font-bold text-white shadow-xl xl:hidden"
        >
          <Monitor size={16} />
          Visualizar
        </button>
      )}

      {/* Mobile preview overlay */}
      {showMobilePreview && (
        <div
          className="fixed inset-0 z-40 bg-black/85 xl:hidden"
          onClick={() => setShowMobilePreview(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 top-10 overflow-y-auto rounded-t-2xl bg-[#0B1020] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--platform-text)]">Preview do site</p>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="rounded-lg p-1.5 text-[var(--platform-text)]/60 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <MiniSitePreview
              siteName={selectedSite?.name ?? "Site"}
              siteDomain={selectedSite?.domain ?? "tenant.local"}
              sections={sections}
              hasUnsavedChanges={hasUnsavedChanges}
              activeSectionId={activeSectionId}
              themeSettings={siteTheme}
            />
          </div>
        </div>
      )}
    </section>
  );
}
