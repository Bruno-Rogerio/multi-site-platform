import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// POST /api/onboarding/validate-coupon
// Body: { code: string; planKey: "basico" | "premium" }
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    code?: string;
    planKey?: string;
  } | null;

  const code = body?.code?.trim().toUpperCase();
  const planKey = body?.planKey;

  if (!code) return NextResponse.json({ error: "Código não informado." }, { status: 400 });

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });

  const { data: coupon } = await admin
    .from("platform_coupons")
    .select("*")
    .eq("active", true)
    .ilike("code", code)
    .maybeSingle();

  if (!coupon) {
    return NextResponse.json({ valid: false, error: "Cupom inválido ou inativo." });
  }

  // Verifica expiração
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: "Cupom expirado." });
  }

  // Verifica limite de usos
  if (coupon.max_redemptions !== null && coupon.redemption_count >= coupon.max_redemptions) {
    return NextResponse.json({ valid: false, error: "Cupom esgotado." });
  }

  // Verifica restrição de plano
  if (planKey && coupon.applicable_plans && coupon.applicable_plans.length > 0) {
    if (!coupon.applicable_plans.includes(planKey)) {
      const planNames = coupon.applicable_plans.map((p: string) =>
        p === "starter" ? "Starter" : p === "basico" ? "Básico" : "Premium"
      ).join(" ou ");
      return NextResponse.json({
        valid: false,
        error: `Este cupom é válido apenas para o plano ${planNames}.`,
      });
    }
  }

  // Monta label do desconto
  let discount_label = "";
  if (coupon.percent_off !== null) {
    if (coupon.percent_off === 100) {
      if (coupon.duration === "once") discount_label = "1º mês grátis";
      else if (coupon.duration === "repeating")
        discount_label = `${coupon.duration_in_months} meses grátis`;
      else discount_label = "Grátis para sempre";
    } else {
      if (coupon.duration === "once") discount_label = `${coupon.percent_off}% no 1º mês`;
      else if (coupon.duration === "repeating")
        discount_label = `${coupon.percent_off}% por ${coupon.duration_in_months} meses`;
      else discount_label = `${coupon.percent_off}% de desconto`;
    }
  } else if (coupon.amount_off_cents !== null) {
    const brl = (coupon.amount_off_cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    if (coupon.duration === "once") discount_label = `${brl} no 1º mês`;
    else if (coupon.duration === "repeating")
      discount_label = `${brl} por ${coupon.duration_in_months} meses`;
    else discount_label = `${brl} de desconto`;
  }

  return NextResponse.json({
    valid: true,
    discount_label,
    percent_off: coupon.percent_off,
    amount_off_cents: coupon.amount_off_cents,
    duration: coupon.duration,
    duration_in_months: coupon.duration_in_months,
    stripe_promotion_code_id: coupon.stripe_promotion_code_id,
    code: coupon.code,
  });
}
