import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─── GET /api/admin/coupons ───────────────────────────────────────────────────
export async function GET() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data, error } = await admin
    .from("platform_coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ coupons: data ?? [] });
}

// ─── POST /api/admin/coupons ──────────────────────────────────────────────────
// Cria cupom no Stripe (coupon + promotion_code) e salva no DB.
export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    code?: string;
    name?: string;
    percent_off?: number | null;
    amount_off_cents?: number | null;
    duration?: string;
    duration_in_months?: number | null;
    applicable_plans?: string[] | null;
    max_redemptions?: number | null;
    expires_at?: string | null;
  } | null;

  // Validações básicas
  const code = body?.code?.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const name = body?.name?.trim();
  if (!code || code.length < 3 || code.length > 30) {
    return NextResponse.json({ error: "Código inválido (3–30 caracteres alfanuméricos)." }, { status: 400 });
  }
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nome interno é obrigatório." }, { status: 400 });
  }

  const duration = body?.duration;
  if (!duration || !["once", "repeating", "forever"].includes(duration)) {
    return NextResponse.json({ error: "Duração inválida." }, { status: 400 });
  }

  const percent_off = body?.percent_off ?? null;
  const amount_off_cents = body?.amount_off_cents ?? null;
  if (percent_off === null && amount_off_cents === null) {
    return NextResponse.json({ error: "Informe desconto em % ou valor fixo." }, { status: 400 });
  }
  if (percent_off !== null && (percent_off <= 0 || percent_off > 100)) {
    return NextResponse.json({ error: "Percentual deve ser entre 1 e 100." }, { status: 400 });
  }
  if (amount_off_cents !== null && amount_off_cents < 1) {
    return NextResponse.json({ error: "Valor de desconto inválido." }, { status: 400 });
  }

  const duration_in_months = duration === "repeating" ? (body?.duration_in_months ?? null) : null;
  if (duration === "repeating" && (!duration_in_months || duration_in_months < 1)) {
    return NextResponse.json({ error: "Informe o número de meses para duração repetida." }, { status: 400 });
  }

  const max_redemptions = body?.max_redemptions ?? null;
  const expires_at = body?.expires_at ?? null;
  const applicable_plans = body?.applicable_plans?.length ? body.applicable_plans : null;

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!stripeKey) return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });

  // ── 1. Criar Coupon no Stripe ─────────────────────────────────────────────
  const couponParams = new URLSearchParams();
  couponParams.set("name", name);
  couponParams.set("duration", duration);
  if (percent_off !== null) couponParams.set("percent_off", String(percent_off));
  if (amount_off_cents !== null) {
    couponParams.set("amount_off", String(amount_off_cents));
    couponParams.set("currency", "brl");
  }
  if (duration_in_months) couponParams.set("duration_in_months", String(duration_in_months));
  if (max_redemptions) couponParams.set("max_redemptions", String(max_redemptions));
  if (expires_at) {
    const ts = Math.floor(new Date(expires_at).getTime() / 1000);
    if (!isNaN(ts)) couponParams.set("redeem_by", String(ts));
  }
  couponParams.set("metadata[source]", "buildsphere_admin");

  const couponRes = await fetch("https://api.stripe.com/v1/coupons", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: couponParams.toString(),
  });
  const couponData = (await couponRes.json().catch(() => null)) as {
    id?: string;
    error?: { message?: string };
  } | null;

  if (!couponRes.ok || !couponData?.id) {
    return NextResponse.json(
      { error: couponData?.error?.message ?? "Erro ao criar cupom no Stripe." },
      { status: 502 },
    );
  }

  // ── 2. Criar PromotionCode no Stripe ─────────────────────────────────────
  const promoParams = new URLSearchParams();
  promoParams.set("coupon", couponData.id);
  promoParams.set("code", code);
  if (max_redemptions) promoParams.set("max_redemptions", String(max_redemptions));
  if (expires_at) {
    const ts = Math.floor(new Date(expires_at).getTime() / 1000);
    if (!isNaN(ts)) promoParams.set("expires_at", String(ts));
  }
  promoParams.set("metadata[source]", "buildsphere_admin");

  const promoRes = await fetch("https://api.stripe.com/v1/promotion_codes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: promoParams.toString(),
  });
  const promoData = (await promoRes.json().catch(() => null)) as {
    id?: string;
    error?: { message?: string };
  } | null;

  if (!promoRes.ok || !promoData?.id) {
    // Tenta deletar o coupon criado (rollback best-effort)
    await fetch(`https://api.stripe.com/v1/coupons/${couponData.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${stripeKey}` },
    }).catch(() => {});

    return NextResponse.json(
      { error: promoData?.error?.message ?? "Erro ao criar código promocional no Stripe." },
      { status: 502 },
    );
  }

  // ── 3. Salvar no DB ───────────────────────────────────────────────────────
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data: inserted, error: dbError } = await admin
    .from("platform_coupons")
    .insert({
      code,
      name,
      percent_off: percent_off ?? null,
      amount_off_cents: amount_off_cents ?? null,
      duration,
      duration_in_months: duration_in_months ?? null,
      applicable_plans: applicable_plans ?? null,
      max_redemptions: max_redemptions ?? null,
      expires_at: expires_at ?? null,
      stripe_coupon_id: couponData.id,
      stripe_promotion_code_id: promoData.id,
      active: true,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json(
      { error: "Cupom criado no Stripe mas falhou ao salvar no banco: " + dbError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, coupon: inserted });
}
