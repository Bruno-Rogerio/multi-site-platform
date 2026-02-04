import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

type SiteThemeRow = {
  id: string;
  theme_settings: Record<string, unknown> | null;
};

function normalizeSiteId(raw: string | null): string | null {
  const value = raw?.trim() ?? "";
  return value.length > 0 ? value : null;
}

async function resolveScopedSite(request: Request) {
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
      siteId: null as string | null,
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
      siteId: null as string | null,
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return {
      error: NextResponse.json({ error: "Supabase unavailable." }, { status: 500 }),
      siteId: null as string | null,
      supabase: null as Awaited<ReturnType<typeof createSupabaseServerAuthClient>>,
    };
  }

  const requestedSiteId = normalizeSiteId(requestUrl.searchParams.get("siteId"));

  if (profile.role === "client") {
    if (!profile.site_id) {
      return {
        error: NextResponse.json({ error: "Client user is not linked to a site." }, { status: 400 }),
        siteId: null as string | null,
        supabase,
      };
    }
    if (requestedSiteId && requestedSiteId !== profile.site_id) {
      return {
        error: NextResponse.json({ error: "Client cannot access another site." }, { status: 403 }),
        siteId: null as string | null,
        supabase,
      };
    }
    return { error: null, siteId: profile.site_id, supabase };
  }

  return { error: null, siteId: requestedSiteId, supabase };
}

export async function GET(request: Request) {
  const scoped = await resolveScopedSite(request);
  if (scoped.error) {
    return scoped.error;
  }

  if (!scoped.siteId || !scoped.supabase) {
    return NextResponse.json({ themeSettings: {} });
  }

  const { data, error } = await scoped.supabase
    .from("sites")
    .select("id,theme_settings")
    .eq("id", scoped.siteId)
    .maybeSingle<SiteThemeRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not load site theme.", details: error?.message ?? null },
      { status: 400 },
    );
  }

  return NextResponse.json({
    siteId: data.id,
    themeSettings: data.theme_settings ?? {},
  });
}

export async function PATCH(request: Request) {
  const scoped = await resolveScopedSite(request);
  if (scoped.error) {
    return scoped.error;
  }

  if (!scoped.siteId || !scoped.supabase) {
    return NextResponse.json({ error: "Missing siteId." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        themeSettings?: Record<string, unknown>;
      }
    | null;

  const themeSettings = body?.themeSettings;
  if (!themeSettings || typeof themeSettings !== "object") {
    return NextResponse.json({ error: "Invalid themeSettings." }, { status: 400 });
  }

  const { data, error } = await scoped.supabase
    .from("sites")
    .update({ theme_settings: themeSettings })
    .eq("id", scoped.siteId)
    .select("id,theme_settings")
    .maybeSingle<SiteThemeRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not update site theme.", details: error?.message ?? null },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    siteId: data.id,
    themeSettings: data.theme_settings ?? {},
  });
}
