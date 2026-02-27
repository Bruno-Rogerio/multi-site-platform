import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  if (!secret) return false;

  // Stripe uses HMAC-SHA256 with the webhook secret
  const encoder = new TextEncoder();
  const parts = signature.split(",");

  const timestampPart = parts.find((p) => p.startsWith("t="));
  const signaturePart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.slice(2);
  const expectedSig = signaturePart.slice(3);

  // Reject events older than 5 minutes
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (isNaN(age) || age > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === expectedSig;
}

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      subscription?: string;
      metadata?: Record<string, string>;
      customer_details?: { email?: string };
    };
  };
};

async function handleCheckoutCompleted(session: StripeEvent["data"]["object"]) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // Preferir site_id da metadata (mais confiável que domain)
  const siteId = session.metadata?.site_id;
  const siteDomain = session.metadata?.site_domain;

  if (!siteId && !siteDomain) {
    console.error("[Stripe Webhook] metadata sem site_id e site_domain:", session.id);
    return;
  }

  // Buscar site
  const query = admin.from("sites").select("id, theme_settings");
  const { data: site } = siteId
    ? await query.eq("id", siteId).maybeSingle()
    : await query.eq("domain", siteDomain!).maybeSingle();

  if (!site) {
    console.error("[Stripe Webhook] Site não encontrado para sessão:", session.id);
    return;
  }

  const settings = site.theme_settings as Record<string, unknown>;

  // Idempotência: se o site já está ativo, não reprocessar
  if (!settings.onboardingDraft) {
    console.log("[Stripe Webhook] Site já ativado, ignorando evento duplicado:", session.id);
    return;
  }

  // Remover flag de draft para ativar o site
  const { onboardingDraft: _, ...activeSettings } = settings;

  const { error: siteUpdateError } = await admin
    .from("sites")
    .update({ theme_settings: activeSettings })
    .eq("id", site.id);

  if (siteUpdateError) {
    console.error("[Stripe Webhook] Erro ao ativar site:", siteUpdateError.message);
    return;
  }

  // Atualizar billing_profiles
  if (session.customer) {
    const { error: billingError } = await admin
      .from("billing_profiles")
      .update({
        billing_status: "active",
        stripe_subscription_id: session.subscription ?? null,
      })
      .eq("stripe_customer_id", session.customer);

    if (billingError) {
      console.error("[Stripe Webhook] Erro ao atualizar billing_profiles:", billingError.message);
    }
  }

  console.log("[Stripe Webhook] Site ativado com sucesso:", site.id);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  // STRIPE_WEBHOOK_SECRET é obrigatório em produção
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET não configurado.");
    return NextResponse.json({ error: "Webhook secret não configurado." }, { status: 500 });
  }

  const valid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
