import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SiteBrandingEditor } from "@/components/admin/site-branding-editor";
import { FloatingButtonsEditor } from "@/components/admin/floating-buttons-editor";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type FloatingLink = {
  type: string;
  url: string;
  icon: string;
  label: string;
};

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  theme_settings: Record<string, unknown> | null;
};

export default async function ClientAppearancePage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let site: SiteRow | null = null;
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,theme_settings")
      .eq("id", profile.site_id)
      .maybeSingle<SiteRow>();
    site = data;
  }

  const selectedPlan = (site?.theme_settings?.selectedPlan as string) ?? "basico";
  const scopedSites = site ? [{ id: site.id, name: site.name, domain: site.domain }] : [];

  const floatingButtonsEnabled = (site?.theme_settings?.floatingButtonsEnabled as boolean) ?? false;
  const floatingLinks = (site?.theme_settings?.floatingLinks as FloatingLink[]) ?? [];
  // socialLinks é salvo pelo draft moderno; fallback para floatingLinks em sites antigos
  const socialLinksFromSettings = (site?.theme_settings?.socialLinks as FloatingLink[]) ?? [];
  const allSocialLinks = socialLinksFromSettings.length > 0 ? socialLinksFromSettings : floatingLinks;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Aparência</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Personalize a identidade visual do seu site.
        </p>
      </div>

      {selectedPlan === "basico" && (
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
        defaultSiteId={profile.site_id ?? scopedSites[0]?.id ?? null}
        plan={selectedPlan}
      />

      {site && (
        <div className="mt-6">
          <FloatingButtonsEditor
            siteId={site.id}
            enabled={floatingButtonsEnabled}
            floatingLinks={floatingLinks}
            socialLinks={allSocialLinks}
          />
        </div>
      )}
    </div>
  );
}
