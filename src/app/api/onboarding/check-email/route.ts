import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  if (!checkRateLimit(getClientIp(request), "check-email", 20, 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    // If admin is unavailable, fail open (don't block the wizard)
    return NextResponse.json({ status: "free" });
  }

  // Check for draft sites with this email in theme_settings
  const { data: draftSites } = await admin
    .from("sites")
    .select("id")
    .filter("theme_settings->>'ownerEmail'", "eq", email)
    .filter("theme_settings->>'onboardingDraft'", "eq", "true")
    .limit(1);

  if (draftSites && draftSites.length > 0) {
    return NextResponse.json({ status: "draft" });
  }

  // Check for active sites with this email
  const { data: activeSites } = await admin
    .from("sites")
    .select("id, theme_settings")
    .filter("theme_settings->>'ownerEmail'", "eq", email)
    .limit(1);

  if (activeSites && activeSites.length > 0) {
    const settings = activeSites[0].theme_settings as Record<string, unknown> | null;
    // If not draft → active
    if (!settings?.onboardingDraft) {
      return NextResponse.json({ status: "active" });
    }
  }

  return NextResponse.json({ status: "free" });
}
