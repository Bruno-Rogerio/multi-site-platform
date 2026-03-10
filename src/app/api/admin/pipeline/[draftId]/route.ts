import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const VALID_STATUSES = ["draft", "checkout_pending", "active"] as const;
type PipelineStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { draftId: siteId } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status as PipelineStatus | undefined;

  if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Configuração do servidor incompleta." }, { status: 500 });
  }

  // Fetch current site to merge theme_settings
  const { data: site, error: fetchError } = await admin
    .from("sites")
    .select("theme_settings")
    .eq("id", siteId)
    .maybeSingle();

  if (fetchError || !site) {
    return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  }

  const currentSettings = (site.theme_settings ?? {}) as Record<string, unknown>;

  if (status === "draft") {
    // Mark site as draft again
    await admin
      .from("sites")
      .update({ theme_settings: { ...currentSettings, onboardingDraft: true } })
      .eq("id", siteId);
  } else if (status === "active") {
    // Remove draft flag + set billing to active
    await admin
      .from("sites")
      .update({ theme_settings: { ...currentSettings, onboardingDraft: false } })
      .eq("id", siteId);
    await admin
      .from("billing_profiles")
      .update({ billing_status: "active" })
      .eq("site_id", siteId);
  } else if (status === "checkout_pending") {
    // Remove draft flag + set billing to checkout_pending
    await admin
      .from("sites")
      .update({ theme_settings: { ...currentSettings, onboardingDraft: false } })
      .eq("id", siteId);
    await admin
      .from("billing_profiles")
      .update({ billing_status: "checkout_pending" })
      .eq("site_id", siteId);
  }

  return NextResponse.json({ ok: true });
}
