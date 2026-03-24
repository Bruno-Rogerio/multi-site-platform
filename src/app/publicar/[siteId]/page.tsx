import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { PublicarClient } from "./publicar-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ siteId: string }>;
};

export default async function PublicarPage({ params }: Props) {
  const { siteId } = await params;

  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  // ── Auth gate: exige sessão ──────────────────────────────────────────────
  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?return=/publicar/${siteId}`);
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

  // ── Ownership check: apenas o dono ou admin da plataforma ────────────────
  const ownerEmail = typeof settings.ownerEmail === "string" ? settings.ownerEmail : "";
  const ownerUserId = typeof settings.ownerUserId === "string" ? settings.ownerUserId : "";

  const isOwner =
    (ownerUserId && user.id === ownerUserId) ||
    (ownerEmail && user.email?.toLowerCase() === ownerEmail.toLowerCase());

  if (!isOwner) {
    // Verifica se é admin da plataforma antes de rejeitar
    const { data: profile } = await admin
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      redirect("/login?error=forbidden");
    }
  }

  const selectedPlan = typeof settings.selectedPlan === "string" ? settings.selectedPlan : "basico";
  const previewExpiresAt = typeof settings.previewExpiresAt === "string" ? settings.previewExpiresAt : "";

  // Busca preço e price_id do plano no DB
  const planDbKey = ["premium", "premium-full", "construir"].includes(selectedPlan) ? "premium" : "basico";
  const { data: planRow } = await admin
    .from("platform_plans")
    .select("stripe_price_id, monthly_price")
    .eq("key", planDbKey)
    .maybeSingle();

  const priceId = planRow?.stripe_price_id ?? (planDbKey === "premium" ? "price_1T59ImFFAjgAeuC1PHZZu2M7" : "price_1T59HfFFAjgAeuC1RGfeU8wW");
  const monthlyPrice = planRow?.monthly_price ?? (planDbKey === "premium" ? 109.80 : 59.90);

  return (
    <PublicarClient
      siteId={site.id}
      siteName={site.name}
      siteDomain={site.domain}
      ownerEmail={ownerEmail}
      selectedPlan={selectedPlan}
      previewExpiresAt={previewExpiresAt}
      priceId={priceId}
      monthlyPrice={monthlyPrice}
    />
  );
}
