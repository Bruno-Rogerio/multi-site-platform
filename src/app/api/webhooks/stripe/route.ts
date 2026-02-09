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

  const siteDomain = session.metadata?.site_domain;
  if (!siteDomain) return;

  // Activate site: remove draft flag from theme_settings
  const { data: site } = await admin
    .from("sites")
    .select("id, theme_settings")
    .eq("domain", siteDomain)
    .maybeSingle();

  if (!site) return;

  const updatedSettings = { ...(site.theme_settings as Record<string, unknown>) };
  delete updatedSettings.onboardingDraft;

  await admin
    .from("sites")
    .update({ theme_settings: updatedSettings })
    .eq("id", site.id);

  // Update billing profile status
  if (session.customer) {
    await admin
      .from("billing_profiles")
      .update({
        billing_status: "active",
        stripe_subscription_id: session.subscription ?? null,
      })
      .eq("stripe_customer_id", session.customer);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  if (STRIPE_WEBHOOK_SECRET) {
    const valid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
