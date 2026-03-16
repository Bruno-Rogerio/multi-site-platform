import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─── PATCH /api/admin/coupons/[id] ───────────────────────────────────────────
// Body: { active: boolean }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { active?: boolean } | null;
  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "Campo 'active' é obrigatório." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data: coupon } = await admin
    .from("platform_coupons")
    .select("stripe_promotion_code_id")
    .eq("id", id)
    .maybeSingle();

  if (!coupon) return NextResponse.json({ error: "Cupom não encontrado." }, { status: 404 });

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";

  // Atualiza PromotionCode no Stripe (best-effort)
  if (stripeKey && coupon.stripe_promotion_code_id) {
    const promoParams = new URLSearchParams();
    promoParams.set("active", String(body.active));
    await fetch(`https://api.stripe.com/v1/promotion_codes/${coupon.stripe_promotion_code_id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2023-10-16",
      },
      body: promoParams.toString(),
    }).catch(() => {});
  }

  const { error: dbError } = await admin
    .from("platform_coupons")
    .update({ active: body.active })
    .eq("id", id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/admin/coupons/[id] ──────────────────────────────────────────
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data: coupon } = await admin
    .from("platform_coupons")
    .select("stripe_promotion_code_id, stripe_coupon_id")
    .eq("id", id)
    .maybeSingle();

  if (!coupon) return NextResponse.json({ error: "Cupom não encontrado." }, { status: 404 });

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";

  // Desativa PromotionCode no Stripe antes de deletar (best-effort)
  if (stripeKey && coupon.stripe_promotion_code_id) {
    await fetch(`https://api.stripe.com/v1/promotion_codes/${coupon.stripe_promotion_code_id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2023-10-16",
      },
      body: "active=false",
    }).catch(() => {});
  }

  const { error: dbError } = await admin.from("platform_coupons").delete().eq("id", id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
