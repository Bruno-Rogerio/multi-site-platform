import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

type FloatingLink = {
  type: string;
  url: string;
  icon: string;
  label: string;
};

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
    | { enabled?: boolean; channels?: string[] }
    | null;

  if (!body || typeof body.enabled !== "boolean" || !Array.isArray(body.channels)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { enabled, channels } = body;

  // Validate channels count
  if (channels.length > 2) {
    return NextResponse.json(
      { error: "Maximum 2 floating button channels allowed." },
      { status: 400 },
    );
  }

  // Fetch current theme_settings to get socialLinks
  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select("theme_settings")
    .eq("id", profile.site_id)
    .maybeSingle();

  if (fetchError || !site) {
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }

  const themeSettings = (site.theme_settings as Record<string, unknown>) ?? {};
  const socialLinks = (themeSettings.socialLinks as FloatingLink[]) ?? [];

  // Build new floatingLinks from selected channels
  const newFloatingLinks = channels
    .map(ch => socialLinks.find(l => l.type === ch))
    .filter(Boolean) as FloatingLink[];

  const updatedThemeSettings = {
    ...themeSettings,
    floatingButtonsEnabled: enabled,
    floatingLinks: newFloatingLinks,
  };

  const { error: updateError } = await supabase
    .from("sites")
    .update({ theme_settings: updatedThemeSettings })
    .eq("id", profile.site_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
