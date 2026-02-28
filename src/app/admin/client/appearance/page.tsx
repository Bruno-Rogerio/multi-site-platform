import { SiteBrandingEditor } from "@/components/admin/site-branding-editor";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

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

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Aparência</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Personalize a identidade visual do seu site.
        </p>
      </div>

      <SiteBrandingEditor
        sites={scopedSites}
        defaultSiteId={profile.site_id ?? scopedSites[0]?.id ?? null}
        plan={selectedPlan}
      />
    </div>
  );
}
