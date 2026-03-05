import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { isReservedSubdomain } from "@/lib/tenant/host";

const SUBDOMAIN_REGEX = /^[a-z0-9-]{3,30}$/;

export async function POST(request: Request) {
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

  const body = await request.json().catch(() => null) as { newSubdomain?: unknown } | null;
  const newSubdomain = String(body?.newSubdomain ?? "").toLowerCase().trim();

  if (!newSubdomain) {
    return NextResponse.json({ error: "Informe o novo subdomínio." }, { status: 400 });
  }
  if (!SUBDOMAIN_REGEX.test(newSubdomain)) {
    return NextResponse.json({ error: "Use 3-30 caracteres (a-z, 0-9, -)." }, { status: 400 });
  }
  if (isReservedSubdomain(newSubdomain)) {
    return NextResponse.json({ error: "Subdomínio reservado. Escolha outro." }, { status: 400 });
  }

  const rootDomain =
    process.env.PLATFORM_ROOT_DOMAIN ??
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ??
    "bsph.com.br";
  const newDomain = `${newSubdomain}.${rootDomain}`;

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase indisponível." }, { status: 500 });
  }

  // Get current site domain
  const { data: site } = await supabase
    .from("sites")
    .select("domain")
    .eq("id", profile.site_id)
    .maybeSingle();

  if (!site) {
    return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  }

  if (newDomain === site.domain) {
    return NextResponse.json({ error: "Este já é seu subdomínio atual." }, { status: 400 });
  }

  // Check availability
  const { data: existing } = await supabase
    .from("sites")
    .select("id")
    .eq("domain", newDomain)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Subdomínio já em uso. Escolha outro." }, { status: 400 });
  }

  // Stripe
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_DOMINIO;
  if (!priceId) {
    return NextResponse.json({ error: "Price ID de domínio não configurado." }, { status: 500 });
  }

  const origin = new URL(request.url).origin;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[site_id]", profile.site_id);
  params.set("metadata[new_domain]", newDomain);
  params.set("metadata[type]", "domain_change");
  params.set("success_url", `${origin}/admin/client/settings?tab=dominio&success=1`);
  params.set("cancel_url", `${origin}/admin/client/settings?tab=dominio`);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json().catch(() => null) as { url?: string; error?: { message?: string } } | null;

  if (!res.ok || !data?.url) {
    return NextResponse.json(
      { error: "Não foi possível criar o checkout.", details: data?.error?.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ checkoutUrl: data.url });
}
