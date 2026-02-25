"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layout, Grid3X3, Megaphone, User, Mail, Plus, Trash2, Save,
} from "lucide-react";

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
type ServiceCard = { title: string; description: string; iconName: string; imageUrl?: string };

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

const SECTION_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  hero: { label: "Destaque", Icon: Layout },
  services: { label: "Serviços", Icon: Grid3X3 },
  cta: { label: "Chamada para Ação", Icon: Megaphone },
  about: { label: "Sobre", Icon: User },
  contact: { label: "Contato", Icon: Mail },
};

const INPUT_CLS = "mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]";
const LABEL_CLS = "text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60";

/* ─── Component ──────────────────────────────────────────── */

export function SectionsEditor({ sites, defaultSiteId, role = "platform" }: SectionsEditorProps) {
  const isClient = role === "client";
  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [sections, setSections] = useState<Section[]>([]);
  const [siteTheme, setSiteTheme] = useState<Record<string, string> | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [syncedSectionsSnapshot, setSyncedSectionsSnapshot] = useState<SectionSnapshots>({});
  const [state, setState] = useState<LoadState>("idle");
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage>(null);

  const hasSites = sites.length > 0;
  const canLoad = hasSites && Boolean(selectedSiteId);

  const sortedSites = useMemo(() => [...sites].sort((a, b) => a.name.localeCompare(b.name)), [sites]);
  const selectedSite = useMemo(() => sortedSites.find((s) => s.id === selectedSiteId) ?? null, [sortedSites, selectedSiteId]);
  const dirtySectionIds = useMemo(
    () => sections.filter((s) => serializeSection(s) !== syncedSectionsSnapshot[s.id]).map((s) => s.id),
    [sections, syncedSectionsSnapshot],
  );
  const hasUnsavedChanges = dirtySectionIds.length > 0;

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
    const textFields = [
      { key: "eyebrow", label: "Eyebrow", placeholder: "Ex: Psicóloga em São Paulo" },
      { key: "title", label: "Título", placeholder: "Título principal" },
      { key: "subtitle", label: "Subtítulo", placeholder: "Descrição curta do negócio" },
      { key: "ctaLabel", label: "Texto do botão", placeholder: "Ex: Agendar conversa" },
    ];
    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {textFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={LABEL_CLS}>{label}</label>
              <input
                value={asString(section.content[key])}
                placeholder={placeholder}
                onChange={(e) => updateContent(section.id, key, e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>

        <div>
          <label className={LABEL_CLS}>Link do botão</label>
          <div className="mt-1">
            <AdminLinkSelect
              value={asString(section.content.ctaHref)}
              onChange={(url) => updateContent(section.id, "ctaHref", url)}
              placeholder="Escolha o destino do botão"
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
      updateContent(section.id, "cards", [...cards, { title: "", description: "", iconName: "Star", imageUrl: "" }]);
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

                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <input
                    value={card.title}
                    placeholder="Nome do serviço"
                    onChange={(e) => updateCard(index, { title: e.target.value })}
                    className={INPUT_CLS}
                  />
                  <input
                    value={card.description}
                    placeholder="Descrição curta"
                    onChange={(e) => updateCard(index, { description: e.target.value })}
                    className={INPUT_CLS}
                  />
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
    const textFields = [
      { key: "title", label: "Título", placeholder: "Ex: Vamos conversar?" },
      { key: "description", label: "Descrição", placeholder: "Texto de apoio do CTA" },
      { key: "buttonLabel", label: "Texto do botão", placeholder: "Ex: Entrar em contato" },
      { key: "secondaryLabel", label: "Botão secundário (texto)", placeholder: "Opcional" },
    ];
    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {textFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={LABEL_CLS}>{label}</label>
              <input
                value={asString(section.content[key])}
                placeholder={placeholder}
                onChange={(e) => updateContent(section.id, key, e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Link do botão</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.buttonHref)}
                onChange={(url) => updateContent(section.id, "buttonHref", url)}
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}>Link botão secundário</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.secondaryHref)}
                onChange={(url) => updateContent(section.id, "secondaryHref", url)}
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
        />
      </div>
    );
  }

  function renderAboutFields(section: Section) {
    return (
      <div className="mt-4 space-y-4">
        <div>
          <label className={LABEL_CLS}>Título</label>
          <input
            value={asString(section.content.title)}
            placeholder="Ex: Sobre mim"
            onChange={(e) => updateContent(section.id, "title", e.target.value)}
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Texto</label>
          <textarea
            rows={5}
            value={asString(section.content.body)}
            placeholder="Descreva seu negócio, sua história ou diferenciais..."
            onChange={(e) => updateContent(section.id, "body", e.target.value)}
            className={INPUT_CLS}
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
        />
      </div>
    );
  }

  function renderContactFields(section: Section) {
    const textFields = [
      { key: "title", label: "Título", placeholder: "Ex: Contato" },
      { key: "subtitle", label: "Subtítulo", placeholder: "Ex: Entre em contato comigo" },
      { key: "whatsappLabel", label: "Texto do botão WhatsApp", placeholder: "Falar no WhatsApp" },
      { key: "secondaryLabel", label: "Texto do link secundário", placeholder: "Ex: Me siga no Instagram" },
      { key: "submitLabel", label: "Texto do botão do formulário", placeholder: "Enviar" },
    ];
    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {textFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={LABEL_CLS}>{label}</label>
              <input
                value={asString(section.content[key])}
                placeholder={placeholder}
                onChange={(e) => updateContent(section.id, key, e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={LABEL_CLS}>Link WhatsApp</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.whatsappUrl)}
                onChange={(url) => updateContent(section.id, "whatsappUrl", url)}
                placeholder="WhatsApp"
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}>Link secundário</label>
            <div className="mt-1">
              <AdminLinkSelect
                value={asString(section.content.secondaryUrl)}
                onChange={(url) => updateContent(section.id, "secondaryUrl", url)}
                placeholder="Instagram, email, etc."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render ─── */

  if (!hasSites) {
    return (
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-[var(--platform-text)]">Editor de seções</h2>
        <p className="mt-2 text-sm text-[var(--platform-text)]/70">
          Nenhum site disponível para edição neste usuário.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--platform-text)]">Editor de seções</h2>
          <p className="mt-1 text-sm text-[var(--platform-text)]/70">
            Edite o conteúdo do site em tempo real.
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

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void saveAllSections()}
          disabled={state === "saving" || !hasUnsavedChanges}
          className="flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={13} />
          {state === "saving" ? "Salvando..." : `Salvar tudo${hasUnsavedChanges ? ` (${dirtySectionIds.length})` : ""}`}
        </button>
        <span className="text-xs text-[var(--platform-text)]/65">
          {hasUnsavedChanges ? `${dirtySectionIds.length} seções com alteração pendente.` : "Tudo sincronizado."}
        </span>
      </div>

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
        <div className="space-y-4">
          {sections.map((section) => {
            const meta = SECTION_META[section.type] ?? { label: section.type, Icon: Layout };
            const SectionIcon = meta.Icon;
            const isDirty = dirtySectionIds.includes(section.id);

            return (
              <article
                key={section.id}
                onMouseEnter={() => setActiveSectionId(section.id)}
                onFocusCapture={() => setActiveSectionId(section.id)}
                className={`rounded-2xl border bg-[#12182B] p-4 transition ${
                  activeSectionId === section.id
                    ? "border-[#22D3EE]/60 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "border-white/10"
                }`}
              >
                {/* Section header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                      <SectionIcon size={15} className="text-[#22D3EE]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--platform-text)]">
                          {meta.label}
                        </span>
                        {section.variant && section.variant !== "default" && (
                          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-[var(--platform-text)]/40">
                            {section.variant}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${isDirty ? "text-amber-300" : "text-emerald-300"}`}>
                        {isDirty ? "Não salvo" : "Salvo"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void saveSection(section)}
                    disabled={state === "saving"}
                    className="flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={12} />
                    Salvar
                  </button>
                </div>

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
              </article>
            );
          })}
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
    </section>
  );
}
