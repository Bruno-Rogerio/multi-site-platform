import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

type CreateUserPayload = {
  email: string;
  role: "admin" | "client";
  siteId?: string | null;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const host = classifyHost(
    resolveRequestHostname(
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      requestUrl.hostname,
    ),
  );

  if (host.kind === "tenant") {
    return NextResponse.json({ error: "Tenant host cannot provision platform users." }, { status: 403 });
  }

  const currentProfile = await getCurrentUserProfile();
  if (!currentProfile || currentProfile.role !== "admin") {
    return NextResponse.json({ error: "Only admins can create users." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as CreateUserPayload | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const role = body.role === "admin" ? "admin" : "client";
  const siteId = body.siteId?.trim() || null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  if (role === "client" && !siteId) {
    return NextResponse.json({ error: "Clients must be linked to a site." }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY for admin provisioning." },
      { status: 500 },
    );
  }

  const redirectTo = `${requestUrl.origin}/auth/callback?next=/reset-password`;
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      role,
      site_id: siteId,
    },
  });

  if (error) {
    return NextResponse.json({ error: "Could not invite user.", details: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "User invited successfully. They will set password via email.",
    userId: data.user?.id ?? null,
  });
}
