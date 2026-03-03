import { LogoEditor } from "@/components/admin/logo-editor";
import { SectionsEditor } from "@/components/admin/sections-editor";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export default async function ClientEditorPage() {
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

  const siteId = profile.site_id ?? scopedSites[0]?.id ?? null;
  const siteName = scopedSites[0]?.name;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Editor do site</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Edite o conteúdo das seções do seu site com preview em tempo real.
        </p>
      </div>

      {/* Logo — always first, for all plans */}
      {siteId && (
        <div className="mb-6">
          <LogoEditor siteId={siteId} siteName={siteName} />
        </div>
      )}

      <SectionsEditor
        sites={scopedSites}
        defaultSiteId={siteId}
        role="client"
      />
    </div>
  );
}
