import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ siteId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  const { siteId } = await params;
  if (!siteId) {
    return NextResponse.json({ error: "siteId obrigatório." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as { suspended?: boolean } | null;
  if (typeof body?.suspended !== "boolean") {
    return NextResponse.json({ error: "Campo 'suspended' (boolean) obrigatório." }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  // Fetch current theme_settings to merge (avoid overwriting other fields)
  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select("theme_settings")
    .eq("id", siteId)
    .maybeSingle();

  if (fetchError || !site) {
    return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  }

  const current = (site.theme_settings as Record<string, unknown>) ?? {};
  const updated = { ...current, suspended: body.suspended };

  const { error: updateError } = await supabase
    .from("sites")
    .update({ theme_settings: updated })
    .eq("id", siteId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, suspended: body.suspended });
}
