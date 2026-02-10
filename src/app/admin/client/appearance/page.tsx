import { SiteBrandingEditor } from "@/components/admin/site-branding-editor";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export default async function ClientAppearancePage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let scopedSites: Array<{ id: string; name: string; domain: string }> = [];
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain")
      .eq("id", profile.site_id)
      .limit(1);
    scopedSites = data ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Aparência</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Personalize cores, logo e estilo visual do seu site.
        </p>
      </div>

      <SiteBrandingEditor
        sites={scopedSites}
        defaultSiteId={profile.site_id ?? scopedSites[0]?.id ?? null}
      />
    </div>
  );
}
