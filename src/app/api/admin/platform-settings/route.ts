import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

type PlatformSettingsRow = {
  id: number;
  settings: Record<string, unknown> | null;
};

async function assertAdminPlatformRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const host = classifyHost(
    resolveRequestHostname(
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      requestUrl.hostname,
    ),
  );

  if (host.kind === "tenant") {
    return {
      error: NextResponse.json({ error: "Tenant host cannot access platform endpoints." }, { status: 403 }),
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Only platform admins can access this endpoint." }, { status: 403 }),
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return {
      error: NextResponse.json({ error: "Supabase unavailable." }, { status: 500 }),
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  return { error: null, supabase };
}

export async function GET(request: Request) {
  const gate = await assertAdminPlatformRequest(request);
  if (gate.error) {
    return gate.error;
  }
  if (!gate.supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  const { data, error } = await gate.supabase
    .from("platform_settings")
    .select("id,settings")
    .eq("id", 1)
    .maybeSingle<PlatformSettingsRow>();

  if (error) {
    return NextResponse.json(
      { error: "Could not load platform settings.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ settings: data?.settings ?? {} });
}

export async function PATCH(request: Request) {
  const gate = await assertAdminPlatformRequest(request);
  if (gate.error) {
    return gate.error;
  }
  if (!gate.supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as
    | { settings?: Record<string, unknown> }
    | null;

  if (!body?.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  const { error } = await gate.supabase
    .from("platform_settings")
    .upsert(
      {
        id: 1,
        settings: body.settings,
      },
      { onConflict: "id" },
    );

  if (error) {
    return NextResponse.json(
      { error: "Could not save platform settings.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
