import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { UnifiedSiteEditor } from "@/components/admin/unified-site-editor";
import type { Section } from "@/lib/tenant/types";

type FloatingLink = { type: string; url: string; icon: string; label: string };
type SiteRow = {
  id: string;
  name: string;
  domain: string;
  theme_settings: Record<string, unknown> | null;
};
type SectionRow = {
  id: string;
  type: string;
  variant: string | null;
  order: number;
  content: Record<string, unknown> | null;
};

export default async function ClientEditorPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let site: SiteRow | null = null;
  let sections: Section[] = [];

  if (supabase && profile.site_id) {
    const [siteResult, pageResult] = await Promise.all([
      supabase
        .from("sites")
        .select("id,name,domain,theme_settings")
        .eq("id", profile.site_id)
        .maybeSingle<SiteRow>(),
      supabase
        .from("pages")
        .select("id")
        .eq("site_id", profile.site_id)
        .eq("slug", "home")
        .maybeSingle<{ id: string }>(),
    ]);
    site = siteResult.data;

    if (pageResult.data?.id) {
      const { data: sectionsData } = await supabase
        .from("sections")
        .select("id,type,variant,order,content")
        .eq("page_id", pageResult.data.id)
        .order("order", { ascending: true });
      sections = (sectionsData as SectionRow[] | null ?? []).map((s) => ({
        id: s.id,
        type: s.type as Section["type"],
        variant: s.variant ?? "default",
        order: s.order,
        content: s.content ?? {},
      }));
    }
  }

  if (!site) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <p className="text-sm text-[var(--platform-text)]/60">Site não encontrado.</p>
      </div>
    );
  }

  const ts = site.theme_settings ?? {};
  const selectedPlan = (ts.selectedPlan as string) ?? "basico";
  const floatingButtonsEnabled = (ts.floatingButtonsEnabled as boolean) ?? false;
  const floatingLinks = (ts.floatingLinks as FloatingLink[]) ?? [];
  const socialLinksFromSettings = (ts.socialLinks as FloatingLink[]) ?? [];
  const allSocialLinks = socialLinksFromSettings.length > 0 ? socialLinksFromSettings : floatingLinks;

  const contactSection = sections.find((s) => s.type === "contact") ?? null;
  const blogSection = sections.find((s) => s.type === "blog") ?? null;
  const eventsSection = sections.find((s) => s.type === "events") ?? null;
  const gallerySection = sections.find((s) => s.type === "gallery") ?? null;

  return (
    <UnifiedSiteEditor
      siteId={site.id}
      siteName={site.name}
      siteDomain={site.domain}
      plan={selectedPlan}
      sections={sections}
      contactSection={contactSection}
      floatingButtonsEnabled={floatingButtonsEnabled}
      floatingLinks={floatingLinks}
      socialLinks={allSocialLinks}
      blogSection={blogSection}
      eventsSection={eventsSection}
      gallerySection={gallerySection}
    />
  );
}
