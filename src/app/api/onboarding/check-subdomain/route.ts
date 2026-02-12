import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isReservedSubdomain } from "@/lib/tenant/host";

const SUBDOMAIN_REGEX = /^[a-z0-9-]{3,30}$/;

function resolveRootDomain(): string {
  const configured =
    process.env.PLATFORM_ROOT_DOMAIN ??
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ??
    "";

  return configured.toLowerCase().trim() || "seudominio.com";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain")?.toLowerCase().trim() ?? "";

  if (!subdomain) {
    return NextResponse.json({ available: false, error: "Subdominio obrigatorio." }, { status: 400 });
  }

  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    return NextResponse.json({ available: false, error: "Use 3-30 caracteres (a-z, 0-9, -)." });
  }

  if (isReservedSubdomain(subdomain)) {
    return NextResponse.json({ available: false, error: "Subdominio reservado." });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ available: false, error: "Erro interno." }, { status: 500 });
  }

  const headerStore = await headers();
  const hostHeader = (headerStore.get("host") ?? "").toLowerCase();
  const rootDomain = resolveRootDomain();
  const domain = `${subdomain}.${rootDomain}`;

  const { data: existingSite } = await admin
    .from("sites")
    .select("id")
    .eq("domain", domain)
    .maybeSingle();

  if (existingSite) {
    return NextResponse.json({ available: false, error: "Subdominio ja em uso." });
  }

  return NextResponse.json({ available: true });
}
