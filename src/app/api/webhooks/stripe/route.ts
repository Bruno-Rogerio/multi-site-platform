import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  sendWelcomeEmail,
  sendReceiptEmail,
  sendCancellationEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";

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

type StripeCheckoutSession = {
  id: string;
  customer: string;
  subscription?: string;
  amount_total?: number;
  metadata?: Record<string, string>;
  customer_details?: { email?: string; name?: string };
};

type StripeSubscription = {
  id: string;
  customer: string;
};

type StripeInvoice = {
  id: string;
  customer: string;
  amount_due: number;
};

type StripeEvent =
  | { id: string; type: "checkout.session.completed";     data: { object: StripeCheckoutSession } }
  | { id: string; type: "customer.subscription.deleted";  data: { object: StripeSubscription } }
  | { id: string; type: "invoice.payment_failed";         data: { object: StripeInvoice } }
  | { id: string; type: string;                           data: { object: Record<string, unknown> } };

async function handleCheckoutCompleted(session: StripeCheckoutSession) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // ── Domain change (one-time payment) ──────────────────────────────────────
  if (session.metadata?.type === "domain_change") {
    const { site_id, new_domain } = session.metadata;
    if (site_id && new_domain) {
      const { error } = await admin
        .from("sites")
        .update({ domain: new_domain })
        .eq("id", site_id);
      if (error) {
        console.error("[Stripe Webhook] Erro ao atualizar domínio:", error.message);
      } else {
        console.log("[Stripe Webhook] Domínio atualizado:", new_domain, "site:", site_id);
      }
    }
    return;
  }

  // ── Onboarding checkout ───────────────────────────────────────────────────
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
  const selectedPlanStr = settings.selectedPlan as string;
  const activePlan = ["premium", "premium-full", "construir"].includes(selectedPlanStr)
    ? "pro"
    : selectedPlanStr === "starter"
    ? "starter"
    : "landing";

  const { error: siteUpdateError } = await admin
    .from("sites")
    .update({ theme_settings: activeSettings, plan: activePlan })
    .eq("id", site.id);

  if (siteUpdateError) {
    console.error("[Stripe Webhook] Erro ao ativar site:", siteUpdateError.message);
    return;
  }

  // Atualizar billing_profiles + buscar dados para email
  let billingFullName = session.customer_details?.name ?? "Cliente";
  let billingEmail = session.customer_details?.email ?? "";
  let billingMonthlyAmount = 0;

  if (session.customer) {
    const { data: billing, error: billingError } = await admin
      .from("billing_profiles")
      .select("full_name, email, monthly_amount")
      .eq("stripe_customer_id", session.customer)
      .maybeSingle();

    if (billingError) {
      console.error("[Stripe Webhook] Erro ao buscar billing_profiles:", billingError.message);
    } else if (billing) {
      billingFullName = billing.full_name ?? billingFullName;
      billingEmail = billing.email ?? billingEmail;
      billingMonthlyAmount = billing.monthly_amount ?? 0;
    }

    const { error: updateError } = await admin
      .from("billing_profiles")
      .update({
        billing_status: "active",
        stripe_subscription_id: session.subscription ?? null,
      })
      .eq("stripe_customer_id", session.customer);

    if (updateError) {
      console.error("[Stripe Webhook] Erro ao atualizar billing_profiles:", updateError.message);
    }
  }

  console.log("[Stripe Webhook] Site ativado com sucesso:", site.id);

  // Enviar emails de boas-vindas + recibo
  if (billingEmail) {
    const amountBRL = session.amount_total ? session.amount_total / 100 : billingMonthlyAmount;
    const planName = amountBRL >= 100 ? "Plano Premium Full" : "Plano Básico";
    const referenceId = session.id.slice(-8).toUpperCase();
    const dashboardUrl = `${process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ? `https://${process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN}` : "https://bsph.com.br"}/admin/client`;

    await Promise.all([
      sendWelcomeEmail(billingEmail, billingFullName, dashboardUrl),
      sendReceiptEmail(billingEmail, billingFullName, amountBRL, planName, referenceId, new Date().toISOString()),
    ]);
  }
}

async function handleSubscriptionDeleted(subscription: StripeSubscription) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // Buscar billing_profile pelo stripe_subscription_id
  const { data: billing } = await admin
    .from("billing_profiles")
    .select("site_id, email, full_name")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (!billing) {
    console.warn("[Stripe Webhook] billing_profile não encontrado para subscription:", subscription.id);
    return;
  }

  // Atualizar status de billing
  await admin
    .from("billing_profiles")
    .update({ billing_status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);

  // Suspender site
  const { data: siteData } = await admin
    .from("sites")
    .select("theme_settings, domain")
    .eq("id", billing.site_id)
    .maybeSingle();

  const currentSettings = (siteData?.theme_settings as Record<string, unknown>) ?? {};
  await admin
    .from("sites")
    .update({ theme_settings: { ...currentSettings, suspended: true } })
    .eq("id", billing.site_id);

  console.log("[Stripe Webhook] Site suspenso após cancelamento:", billing.site_id);

  // Email de cancelamento
  if (billing.email) {
    await sendCancellationEmail(billing.email, billing.full_name ?? "Cliente", siteData?.domain ?? "");
  }
}

async function handlePaymentFailed(invoice: StripeInvoice) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // Buscar billing_profile pelo stripe_customer_id
  const { data: billing } = await admin
    .from("billing_profiles")
    .select("email, full_name, monthly_amount")
    .eq("stripe_customer_id", invoice.customer)
    .maybeSingle();

  if (!billing) {
    console.warn("[Stripe Webhook] billing_profile não encontrado para customer:", invoice.customer);
    return;
  }

  // Marcar como past_due
  await admin
    .from("billing_profiles")
    .update({ billing_status: "past_due" })
    .eq("stripe_customer_id", invoice.customer);

  console.log("[Stripe Webhook] billing_status atualizado para past_due:", invoice.customer);

  // Email de falha de pagamento
  if (billing.email) {
    const amountBRL = invoice.amount_due / 100;
    await sendPaymentFailedEmail(billing.email, billing.full_name ?? "Cliente", amountBRL);
  }
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
      await handleCheckoutCompleted(event.data.object as StripeCheckoutSession);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as StripeSubscription);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object as StripeInvoice);
      break;
  }

  return NextResponse.json({ received: true });
}
