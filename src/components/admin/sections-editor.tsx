"use client";

import { useEffect, useMemo, useState } from "react";

import { validateImageForSlot } from "@/components/admin/image-validation";
import { MiniSitePreview } from "@/components/admin/minisite-preview";
import { mediaPresets } from "@/lib/media/presets";
import type { Section } from "@/lib/tenant/types";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
};

type SectionsEditorProps = {
  sites: SiteOption[];
  defaultSiteId: string | null;
};

type LoadState = "idle" | "loading" | "saving";

type StatusMessage =
  | { type: "error"; message: string }
  | { type: "success"; message: string }
  | null;

type SectionSnapshots = Record<string, string>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asItems(content: Record<string, unknown>): string[] {
  const rawItems = content.items;
  if (!Array.isArray(rawItems)) {
    return [];
  }
  return rawItems.filter((item): item is string => typeof item === "string");
}

function sortSections(sections: Section[]): Section[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function serializeSection(section: Section): string {
  return JSON.stringify({
    id: section.id,
    type: section.type,
    variant: section.variant ?? "default",
    order: section.order,
    content: section.content,
  });
}

function buildSectionSnapshots(sections: Section[]): SectionSnapshots {
  return Object.fromEntries(sections.map((section) => [section.id, serializeSection(section)]));
}

export function SectionsEditor({ sites, defaultSiteId }: SectionsEditorProps) {
  const [selectedSiteId, setSelectedSiteId] = useState(defaultSiteId ?? "");
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [syncedSectionsSnapshot, setSyncedSectionsSnapshot] = useState<SectionSnapshots>({});
  const [state, setState] = useState<LoadState>("idle");
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage>(null);

  const hasSites = sites.length > 0;
  const canLoad = hasSites && Boolean(selectedSiteId);

  const sortedSites = useMemo(
    () => [...sites].sort((a, b) => a.name.localeCompare(b.name)),
    [sites],
  );
  const selectedSite = useMemo(
    () => sortedSites.find((site) => site.id === selectedSiteId) ?? null,
    [sortedSites, selectedSiteId],
  );
  const dirtySectionIds = useMemo(
    () =>
      sections
        .filter((section) => serializeSection(section) !== syncedSectionsSnapshot[section.id])
        .map((section) => section.id),
    [sections, syncedSectionsSnapshot],
  );
  const hasUnsavedChanges = dirtySectionIds.length > 0;

  async function loadSections(siteId: string) {
    setState("loading");
    setStatus(null);

    const response = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { sections?: Section[]; error?: string; details?: string }
      | null;

    if (!response.ok) {
      setState("idle");
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Não foi possível carregar seções."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    const loadedSections = sortSections(payload?.sections ?? []);
    setSections(loadedSections);
    setSyncedSectionsSnapshot(buildSectionSnapshots(loadedSections));
    setState("idle");
  }

  useEffect(() => {
    if (!canLoad) {
      return;
    }
    setActiveSectionId(null);
    void loadSections(selectedSiteId);
  }, [selectedSiteId, canLoad]);

  function updateSection(sectionId: string, updater: (current: Section) => Section) {
    setSections((currentSections) =>
      currentSections.map((section) => (section.id === sectionId ? updater(section) : section)),
    );
  }

  async function uploadImageForSection(section: Section, file: File) {
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

    const response = await fetch("/api/admin/upload-asset", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | { url?: string; error?: string; details?: string }
      | null;

    setUploadingSectionId(null);

    if (!response.ok || !payload?.url) {
      setStatus({
        type: "error",
        message: `${payload?.error ?? "Falha no upload."} ${payload?.details ?? ""}`.trim(),
      });
      return;
    }

    updateSection(section.id, (current) => ({
      ...current,
      content: {
        ...current.content,
        imageUrl: payload.url,
      },
    }));
    setStatus({
      type: "success",
      message: "Imagem enviada. Clique em salvar seção para publicar.",
    });
  }

  async function persistSection(section: Section) {
    const response = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(selectedSiteId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId: section.id,
        order: section.order,
        variant: section.variant ?? "default",
        content: section.content,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; section?: Section; error?: string; details?: string }
      | null;

    if (!response.ok || !payload?.section) {
      throw new Error(
        `${payload?.error ?? "Não foi possível salvar seção."} ${payload?.details ?? ""}`.trim(),
      );
    }

    return payload.section;
  }

  async function saveSection(section: Section) {
    setState("saving");
    setStatus(null);

    try {
      const savedSection = await persistSection(section);
      const updatedSections = sortSections(
        sections.map((current) => (current.id === savedSection.id ? savedSection : current)),
      );
      setSections(updatedSections);
      setSyncedSectionsSnapshot((current) => ({
        ...current,
        [savedSection.id]: serializeSection(savedSection),
      }));
      setStatus({ type: "success", message: `Seção "${savedSection.type}" atualizada com sucesso.` });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível salvar seção.",
      });
    } finally {
      setState("idle");
    }
  }

  async function saveAllSections() {
    const dirtySections = sections.filter((section) => dirtySectionIds.includes(section.id));
    if (dirtySections.length === 0) {
      setStatus({ type: "success", message: "Não há alterações pendentes para salvar." });
      return;
    }

    setState("saving");
    setStatus(null);

    try {
      const updatedById = new Map<string, Section>();
      for (const section of dirtySections) {
        const savedSection = await persistSection(section);
        updatedById.set(savedSection.id, savedSection);
      }

      const mergedSections = sortSections(
        sections.map((section) => updatedById.get(section.id) ?? section),
      );
      setSections(mergedSections);
      setSyncedSectionsSnapshot((current) => ({
        ...current,
        ...Object.fromEntries(
          Array.from(updatedById.entries()).map(([sectionId, savedSection]) => [
            sectionId,
            serializeSection(savedSection),
          ]),
        ),
      }));
      setStatus({
        type: "success",
        message: `${updatedById.size} seções salvas com sucesso.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível salvar todas as seções.",
      });
    } finally {
      setState("idle");
    }
  }

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
            Ajuste Hero, Services e CTA em tempo real para cada tenant.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
            htmlFor="site-picker"
          >
            Site
          </label>
          <select
            id="site-picker"
            value={selectedSiteId}
            onChange={(event) => setSelectedSiteId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#12182B] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          >
            {sortedSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} - {site.domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void saveAllSections()}
          disabled={state === "saving" || !hasUnsavedChanges}
          className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "saving"
            ? "Salvando..."
            : `Salvar tudo${hasUnsavedChanges ? ` (${dirtySectionIds.length})` : ""}`}
        </button>
        <span className="text-xs text-[var(--platform-text)]/65">
          {hasUnsavedChanges
            ? `${dirtySectionIds.length} seções com alteração pendente.`
            : "Sem alterações pendentes."}
        </span>
      </div>

      {status && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-xs ${
            status.type === "error"
              ? "border border-red-300/40 bg-red-500/10 text-red-200"
              : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {status.message}
        </p>
      )}

      {state === "loading" ? (
        <p className="mt-4 text-sm text-[var(--platform-text)]/70">Carregando seções...</p>
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.1fr] xl:items-start">
        <div className="space-y-4">
          {sections.map((section) => (
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">
                    {section.type}
                  </p>
                  <p className="mt-1 text-sm text-[var(--platform-text)]/65">ID: {section.id}</p>
                  <p
                    className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      dirtySectionIds.includes(section.id) ? "text-amber-200" : "text-emerald-200"
                    }`}
                  >
                    {dirtySectionIds.includes(section.id) ? "Não salvo" : "Sincronizado"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void saveSection(section)}
                  disabled={state === "saving"}
                  className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "saving" ? "Salvando..." : "Salvar seção"}
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                    Variant
                  </label>
                  <input
                    value={section.variant ?? "default"}
                    onChange={(event) =>
                      updateSection(section.id, (current) => ({
                        ...current,
                        variant: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                    Order
                  </label>
                  <input
                    type="number"
                    value={section.order}
                    onChange={(event) =>
                      updateSection(section.id, (current) => ({
                        ...current,
                        order: Number(event.target.value || "0"),
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                  />
                </div>
              </div>

              {section.type === "hero" ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ["eyebrow", "Eyebrow"],
                    ["title", "Título"],
                    ["subtitle", "Subtítulo"],
                    ["ctaLabel", "CTA Label"],
                    ["ctaHref", "CTA Link"],
                    ["imageUrl", "Imagem (URL)"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                        {label}
                      </label>
                      <input
                        value={asString(section.content[key])}
                        onChange={(event) =>
                          updateSection(section.id, (current) => ({
                            ...current,
                            content: { ...current.content, [key]: event.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Upload de imagem
                    </label>
                    <p className="mt-1 text-[11px] text-[var(--platform-text)]/55">
                      {mediaPresets.hero.recommendedText}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSectionId === section.id}
                      onChange={async (event) => {
                        const inputElement = event.currentTarget;
                        const file = event.target.files?.[0];
                        if (file) {
                          const validationError = await validateImageForSlot(file, "hero");
                          if (validationError) {
                            setStatus({ type: "error", message: validationError });
                            inputElement.value = "";
                            return;
                          }
                          void uploadImageForSection(section, file);
                        }
                        inputElement.value = "";
                      }}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                    />
                  </div>
                </div>
              ) : null}

              {section.type === "services" ? (
                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Título
                    </label>
                    <input
                      value={asString(section.content.title)}
                      onChange={(event) =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          content: { ...current.content, title: event.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Imagem (URL)
                    </label>
                    <input
                      value={asString(section.content.imageUrl)}
                      onChange={(event) =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          content: { ...current.content, imageUrl: event.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Itens (um por linha)
                    </label>
                    <textarea
                      rows={5}
                      value={asItems(section.content).join("\n")}
                      onChange={(event) =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          content: {
                            ...current.content,
                            items: event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean),
                          },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Upload de imagem
                    </label>
                    <p className="mt-1 text-[11px] text-[var(--platform-text)]/55">
                      {mediaPresets.services.recommendedText}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSectionId === section.id}
                      onChange={async (event) => {
                        const inputElement = event.currentTarget;
                        const file = event.target.files?.[0];
                        if (file) {
                          const validationError = await validateImageForSlot(file, "services");
                          if (validationError) {
                            setStatus({ type: "error", message: validationError });
                            inputElement.value = "";
                            return;
                          }
                          void uploadImageForSection(section, file);
                        }
                        inputElement.value = "";
                      }}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                    />
                  </div>
                </div>
              ) : null}

              {section.type === "cta" ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ["title", "Título"],
                    ["description", "Descrição"],
                    ["buttonLabel", "Botão"],
                    ["buttonHref", "Link do botão"],
                    ["imageUrl", "Imagem (URL)"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                        {label}
                      </label>
                      <input
                        value={asString(section.content[key])}
                        onChange={(event) =>
                          updateSection(section.id, (current) => ({
                            ...current,
                            content: { ...current.content, [key]: event.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                      Upload de imagem
                    </label>
                    <p className="mt-1 text-[11px] text-[var(--platform-text)]/55">
                      {mediaPresets.cta.recommendedText}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSectionId === section.id}
                      onChange={async (event) => {
                        const inputElement = event.currentTarget;
                        const file = event.target.files?.[0];
                        if (file) {
                          const validationError = await validateImageForSlot(file, "cta");
                          if (validationError) {
                            setStatus({ type: "error", message: validationError });
                            inputElement.value = "";
                            return;
                          }
                          void uploadImageForSection(section, file);
                        }
                        inputElement.value = "";
                      }}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] file:mr-3 file:rounded-md file:border-0 file:bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                    />
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <MiniSitePreview
          siteName={selectedSite?.name ?? "Site"}
          siteDomain={selectedSite?.domain ?? "tenant.local"}
          sections={sections}
          hasUnsavedChanges={hasUnsavedChanges}
          activeSectionId={activeSectionId}
        />
      </div>
    </section>
  );
}
