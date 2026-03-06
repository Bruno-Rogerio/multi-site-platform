"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PenTool, Paintbrush, MessageSquare, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";

import { LogoEditor } from "@/components/admin/logo-editor";
import { SectionsEditor } from "@/components/admin/sections-editor";
import { SiteBrandingEditor } from "@/components/admin/site-branding-editor";
import { FloatingButtonsEditor } from "@/components/admin/floating-buttons-editor";
import { ContactChannelsEditor } from "@/components/admin/contacts-channels-editor";
import { ExtrasEditor } from "@/components/admin/extras-editor";
import type { Section } from "@/lib/tenant/types";

type FloatingLink = { type: string; url: string; icon: string; label: string };

type Props = {
  siteId: string;
  siteName: string;
  siteDomain: string;
  plan: string;
  // Contatos tab
  contactSection: Section | null;
  floatingButtonsEnabled: boolean;
  floatingLinks: FloatingLink[];
  socialLinks: FloatingLink[];
  // Extras tab
  blogSection: Section | null;
  eventsSection: Section | null;
  gallerySection: Section | null;
};

type Tab = "conteudo" | "aparencia" | "contatos" | "extras";

const TABS: Array<{ key: Tab; label: string; Icon: typeof PenTool }> = [
  { key: "conteudo",  label: "Conteúdo",  Icon: PenTool },
  { key: "aparencia", label: "Aparência", Icon: Paintbrush },
  { key: "contatos",  label: "Contatos",  Icon: MessageSquare },
  { key: "extras",    label: "Extras",    Icon: LayoutGrid },
];

export function UnifiedSiteEditor({
  siteId,
  siteName,
  siteDomain,
  plan,
  contactSection,
  floatingButtonsEnabled,
  floatingLinks,
  socialLinks,
  blogSection,
  eventsSection,
  gallerySection,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = rawTab && TABS.some((t) => t.key === rawTab) ? rawTab : "conteudo";

  function setTab(tab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const scopedSites = [{ id: siteId, name: siteName, domain: siteDomain }];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Meu site</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie o conteúdo, aparência e canais de contato do seu site.
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === key
                ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] text-white shadow"
                : "text-[var(--platform-text)]/60 hover:bg-white/[0.05] hover:text-[var(--platform-text)]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {activeTab === "conteudo" && (
        <div>
          <div className="mb-6">
            <LogoEditor siteId={siteId} siteName={siteName} />
          </div>
          <SectionsEditor
            sites={scopedSites}
            defaultSiteId={siteId}
            role="client"
          />
        </div>
      )}

      {/* Aparência */}
      {activeTab === "aparencia" && (
        <div>
          {plan === "basico" && (
            <Link href="/admin/client/settings?tab=plano" className="mb-6 block">
              <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 transition hover:border-amber-400/30">
                <Sparkles size={15} className="shrink-0 text-amber-400" />
                <p className="text-xs text-amber-300">
                  <strong>Plano Básico:</strong> apenas o logotipo pode ser personalizado.{" "}
                  <span className="underline">Upgrade para desbloquear o editor completo →</span>
                </p>
              </div>
            </Link>
          )}
          <SiteBrandingEditor
            sites={scopedSites}
            defaultSiteId={siteId}
            plan={plan}
          />
        </div>
      )}

      {/* Contatos */}
      {activeTab === "contatos" && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 text-base font-semibold text-[var(--platform-text)]">Canais de contato</h2>
            <p className="mb-4 text-xs text-[var(--platform-text)]/50">
              Configure os canais exibidos na seção de contato e disponíveis para botões flutuantes.
            </p>
            <ContactChannelsEditor siteId={siteId} contactSection={contactSection} />
          </div>
          <div>
            <h2 className="mb-1 text-base font-semibold text-[var(--platform-text)]">Botões flutuantes</h2>
            <p className="mb-4 text-xs text-[var(--platform-text)]/50">
              Escolha até 2 canais para exibir como botão fixo no canto do site.
            </p>
            <FloatingButtonsEditor
              siteId={siteId}
              enabled={floatingButtonsEnabled}
              floatingLinks={floatingLinks}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      )}

      {/* Extras */}
      {activeTab === "extras" && (
        <div>
          <h2 className="mb-1 text-base font-semibold text-[var(--platform-text)]">Páginas extras</h2>
          <p className="mb-4 text-xs text-[var(--platform-text)]/50">
            Blog, agenda e galeria — com preview em tempo real antes de salvar.
          </p>
          <ExtrasEditor
            siteId={siteId}
            blogSection={blogSection}
            eventsSection={eventsSection}
            gallerySection={gallerySection}
          />
        </div>
      )}
    </div>
  );
}
