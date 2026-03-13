import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─── GET /api/admin/plans ─────────────────────────────────────────────────────
export async function GET() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data, error } = await admin
    .from("platform_plans")
    .select("*")
    .order("monthly_price", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plans: data ?? [] });
}

// ─── PATCH /api/admin/plans ───────────────────────────────────────────────────
// Body: { key: "basico" | "premium", monthly_price: number }
// Cria novo Price no Stripe (imutáveis), arquiva o antigo, atualiza DB.
export async function PATCH(request: Request) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    key?: string;
    monthly_price?: number;
  } | null;

  const key = body?.key;
  const monthly_price = body?.monthly_price;

  if (!key || !["basico", "premium"].includes(key)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }
  if (typeof monthly_price !== "number" || monthly_price < 1 || monthly_price > 99999) {
    return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!stripeKey) return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  // Busca plano atual no DB
  const { data: plan } = await admin
    .from("platform_plans")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (!plan) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

  // Busca o Price atual no Stripe para obter o product ID
  const priceRes = await fetch(`https://api.stripe.com/v1/prices/${plan.stripe_price_id}`, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const priceData = (await priceRes.json().catch(() => null)) as {
    product?: string;
    error?: { message?: string };
  } | null;

  if (!priceRes.ok || !priceData?.product) {
    return NextResponse.json(
      { error: priceData?.error?.message ?? "Erro ao buscar preço atual no Stripe." },
      { status: 502 },
    );
  }

  // Cria novo Price no Stripe
  const newPriceParams = new URLSearchParams();
  newPriceParams.set("product", priceData.product);
  newPriceParams.set("unit_amount", String(Math.round(monthly_price * 100)));
  newPriceParams.set("currency", "brl");
  newPriceParams.set("recurring[interval]", "month");
  newPriceParams.set("recurring[interval_count]", "1");
  newPriceParams.set("metadata[plan_key]", key);
  newPriceParams.set("metadata[source]", "buildsphere_admin");

  const newPriceRes = await fetch("https://api.stripe.com/v1/prices", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: newPriceParams.toString(),
  });
  const newPriceData = (await newPriceRes.json().catch(() => null)) as {
    id?: string;
    error?: { message?: string };
  } | null;

  if (!newPriceRes.ok || !newPriceData?.id) {
    return NextResponse.json(
      { error: newPriceData?.error?.message ?? "Erro ao criar novo preço no Stripe." },
      { status: 502 },
    );
  }

  // Arquiva o Price antigo no Stripe (best-effort)
  await fetch(`https://api.stripe.com/v1/prices/${plan.stripe_price_id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "active=false",
  }).catch(() => {});

  // Atualiza DB
  const { error: dbError } = await admin
    .from("platform_plans")
    .update({
      monthly_price,
      stripe_price_id: newPriceData.id,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (dbError) {
    return NextResponse.json({ error: "Erro ao atualizar plano no banco." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stripe_price_id: newPriceData.id, monthly_price });
}
