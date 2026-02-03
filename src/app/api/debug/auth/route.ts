import { NextResponse } from "next/server";

import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const rawForwardedHost = request.headers.get("x-forwarded-host");
  const rawHost = request.headers.get("host");
  const resolvedHostname = resolveRequestHostname(rawForwardedHost, rawHost, requestUrl.hostname);
  const host = classifyHost(resolvedHostname);

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({
      ok: false,
      reason: "supabase_missing",
      host,
      headers: { host: rawHost, forwardedHost: rawForwardedHost },
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({
      ok: false,
      reason: userError ? "auth_user_error" : "no_user",
      userError: userError?.message ?? null,
      host,
      headers: { host: rawHost, forwardedHost: rawForwardedHost },
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,email,role,site_id")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    ok: Boolean(profile) && !profileError,
    reason: profileError ? "profile_query_error" : profile ? "ok" : "profile_not_found",
    host,
    headers: { host: rawHost, forwardedHost: rawForwardedHost },
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    profile: profile ?? null,
    profileError: profileError?.message ?? null,
  });
}
