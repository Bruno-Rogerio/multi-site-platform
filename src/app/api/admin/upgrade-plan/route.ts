import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export async function POST() {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (profile.role !== "client") {
    return NextResponse.json({ error: "Client account required." }, { status: 403 });
  }
  if (!profile.site_id) {
    return NextResponse.json({ error: "Nenhum site vinculado a esta conta." }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase indisponível." }, { status: 500 });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("theme_settings")
    .eq("id", profile.site_id)
    .maybeSingle();

  const currentSettings = (site?.theme_settings ?? {}) as Record<string, unknown>;

  if (currentSettings.selectedPlan === "premium-full") {
    return NextResponse.json({ error: "Já está no plano Premium." }, { status: 400 });
  }

  const newSettings = {
    ...currentSettings,
    selectedPlan: "premium-full",
    planUpgradedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("sites")
    .update({ theme_settings: newSettings })
    .eq("id", profile.site_id);

  if (error) {
    return NextResponse.json({ error: "Não foi possível fazer o upgrade." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
