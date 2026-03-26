import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

// Allowed upgrade paths — no downgrade
const UPGRADE_PATHS: Record<string, string[]> = {
  starter:        ["basico", "premium"],
  basico:         ["premium"],
  construir:      ["premium"],
  "premium-full": [],           // already at top
};

// Map selectedPlan → sites.plan column
const PLAN_TO_SITE_PLAN: Record<string, string> = {
  starter:        "starter",
  basico:         "landing",
  construir:      "landing",
  "premium-full": "pro",
  premium:        "pro",
};

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

  const body = (await request.json().catch(() => null)) as { targetPlan?: string } | null;
  const targetPlan = body?.targetPlan;

  if (!targetPlan || !["basico", "premium"].includes(targetPlan)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  // Normalise "premium" → "premium-full" for DB storage
  const targetPlanStored = targetPlan === "premium" ? "premium-full" : targetPlan;

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase indisponível." }, { status: 500 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin indisponível." }, { status: 500 });
  }

  // Fetch current site + billing profile
  const [{ data: site }, { data: billing }] = await Promise.all([
    supabase.from("sites").select("theme_settings").eq("id", profile.site_id).maybeSingle(),
    admin
      .from("billing_profiles")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("site_id", profile.site_id)
      .maybeSingle(),
  ]);

  const currentSettings = (site?.theme_settings ?? {}) as Record<string, unknown>;
  const currentPlan = (typeof currentSettings.selectedPlan === "string"
    ? currentSettings.selectedPlan
    : "basico") as string;

  // Validate upgrade path
  const allowed = UPGRADE_PATHS[currentPlan] ?? [];
  if (!allowed.includes(targetPlan)) {
    return NextResponse.json(
      { error: `Upgrade de "${currentPlan}" para "${targetPlan}" não permitido.` },
      { status: 400 },
    );
  }

  // ── Stripe: update subscription price (best-effort, proration: none) ──────
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  const stripeSubId = billing?.stripe_subscription_id;

  if (stripeKey && stripeSubId) {
    try {
      // 1. Fetch subscription to get current subscription item ID
      const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${stripeSubId}`, {
        headers: { Authorization: `Bearer ${stripeKey}` },
      });
      const subData = (await subRes.json().catch(() => null)) as {
        items?: { data?: { id: string }[] };
        error?: { message?: string };
      } | null;

      const itemId = subData?.items?.data?.[0]?.id;

      // 2. Fetch new price_id from platform_plans
      const planDbKey = targetPlan === "premium" ? "premium" : "basico";
      const { data: planRow } = await admin
        .from("platform_plans")
        .select("stripe_price_id")
        .eq("key", planDbKey)
        .maybeSingle();

      const newPriceId = planRow?.stripe_price_id;

      if (itemId && newPriceId && newPriceId !== "pending") {
        const patchParams = new URLSearchParams();
        patchParams.set("proration_behavior", "none");
        patchParams.set(`items[0][id]`, itemId);
        patchParams.set(`items[0][price]`, newPriceId);

        await fetch(`https://api.stripe.com/v1/subscriptions/${stripeSubId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: patchParams.toString(),
        });
        // Best-effort: we don't block the upgrade if Stripe fails
      }
    } catch {
      // Log but don't block
      console.error("[upgrade-plan] Erro ao atualizar subscription no Stripe (best-effort)");
    }
  }

  // ── DB: update sites ───────────────────────────────────────────────────────
  const newSettings = {
    ...currentSettings,
    selectedPlan: targetPlanStored,
    planUpgradedAt: new Date().toISOString(),
    planUpgradedFrom: currentPlan,
  };

  const newSitePlan = PLAN_TO_SITE_PLAN[targetPlanStored] ?? "landing";

  const { error } = await supabase
    .from("sites")
    .update({ theme_settings: newSettings, plan: newSitePlan })
    .eq("id", profile.site_id);

  if (error) {
    return NextResponse.json({ error: "Não foi possível fazer o upgrade." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newPlan: targetPlanStored });
}
