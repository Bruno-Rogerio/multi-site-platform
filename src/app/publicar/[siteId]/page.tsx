import { redirect, notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { PublicarClient } from "./publicar-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ siteId: string }>;
};

export default async function PublicarPage({ params }: Props) {
  const { siteId } = await params;

  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const admin = createSupabaseAdminClient();
  if (!admin) notFound();

  const { data: site } = await admin
    .from("sites")
    .select("id, name, domain, theme_settings")
    .eq("id", siteId)
    .maybeSingle();

  if (!site) notFound();

  const settings = (site.theme_settings ?? {}) as Record<string, unknown>;

  // Must still be a draft
  if (!settings.onboardingDraft) {
    redirect(`/login?checkout=success`);
  }

  const ownerEmail = typeof settings.ownerEmail === "string" ? settings.ownerEmail : "";
  const selectedPlan = typeof settings.selectedPlan === "string" ? settings.selectedPlan : "basico";
  const previewExpiresAt = typeof settings.previewExpiresAt === "string" ? settings.previewExpiresAt : "";

  return (
    <PublicarClient
      siteId={site.id}
      siteName={site.name}
      siteDomain={site.domain}
      ownerEmail={ownerEmail}
      selectedPlan={selectedPlan}
      previewExpiresAt={previewExpiresAt}
    />
  );
}
