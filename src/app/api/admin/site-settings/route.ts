import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

export async function PATCH(request: Request) {
  const requestUrl = new URL(request.url);
  const host = classifyHost(
    resolveRequestHostname(
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      requestUrl.hostname,
    ),
  );

  if (host.kind === "tenant") {
    return NextResponse.json(
      { error: "Tenant host cannot access platform endpoints." },
      { status: 403 },
    );
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (profile.role !== "client" || !profile.site_id) {
    return NextResponse.json({ error: "Client account required." }, { status: 403 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as
    | { name?: string }
    | null;

  const name = body?.name?.trim();
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Nome deve ter pelo menos 2 caracteres." },
      { status: 400 },
    );
  }
  if (name.length > 100) {
    return NextResponse.json(
      { error: "Nome muito longo (máximo 100 caracteres)." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("sites")
    .update({ name })
    .eq("id", profile.site_id);

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível atualizar o nome.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
