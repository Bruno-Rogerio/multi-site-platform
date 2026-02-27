import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";
import { validateDocument } from "@/lib/onboarding/validation";

type CheckoutSessionPayload = {
  siteId: string;
  priceId: string;
  document?: string;
};

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

async function findOrCreateStripeCustomer(
  stripeKey: string,
  email: string,
  name: string,
): Promise<string> {
  // Search existing customers by email
  const searchUrl = `https://api.stripe.com/v1/customers/search?query=email:"${encodeURIComponent(email)}"`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const searchData = (await searchRes.json().catch(() => null)) as { data?: { id: string }[] } | null;
  if (searchData?.data?.[0]?.id) {
    return searchData.data[0].id;
  }

  // Create new customer
  const params = new URLSearchParams();
  params.set("email", email);
  params.set("name", name);
  params.set("metadata[source]", "buildsphere_onboarding");

  const createRes = await fetch("https://api.stripe.com/v1/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const createData = (await createRes.json().catch(() => null)) as { id?: string; error?: { message?: string } } | null;
  if (!createRes.ok || !createData?.id) {
    throw new Error(createData?.error?.message ?? "Falha ao criar customer no Stripe.");
  }
  return createData.id;
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const hostname = resolveRequestHostname(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    requestUrl.hostname,
  );

  if (classifyHost(hostname).kind === "tenant") {
    return NextResponse.json({ error: "Checkout deve ser iniciado no domínio da plataforma." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as CheckoutSessionPayload | null;
  if (!payload?.siteId || !payload?.priceId) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (!isUuid(payload.siteId)) {
    return NextResponse.json({ error: "siteId inválido." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });
  }

  const bypassPayment = process.env.BYPASS_PAYMENT === "true";

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!bypassPayment && !stripeKey) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
  }

  // Fetch site to get owner info
  const { data: site } = await admin
    .from("sites")
    .select("id,domain,name,theme_settings")
    .eq("id", payload.siteId)
    .maybeSingle();

  if (!site) {
    return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  }

  const settings = (site.theme_settings ?? {}) as Record<string, unknown>;
  const ownerEmail = typeof settings.ownerEmail === "string" ? settings.ownerEmail : "";
  const ownerUserId = typeof settings.ownerUserId === "string" ? settings.ownerUserId : "";

  if (!ownerEmail) {
    return NextResponse.json({ error: "Site sem e-mail do dono. Refaça o cadastro." }, { status: 400 });
  }

  // Validação do documento antes de qualquer chamada ao Stripe
  const rawDoc = payload.document?.replace(/\D/g, "") ?? "";
  if (rawDoc) {
    const docValidation = validateDocument(rawDoc);
    if (!docValidation.valid) {
      return NextResponse.json({ error: docValidation.error ?? "CPF ou CNPJ inválido." }, { status: 400 });
    }
  }
  const document = rawDoc || null;

  // Get owner name from Supabase user
  let ownerName = ownerEmail.split("@")[0];
  if (ownerUserId) {
    const { data: userData } = await admin.auth.admin.getUserById(ownerUserId);
    const fullName = userData?.user?.user_metadata?.full_name;
    if (typeof fullName === "string" && fullName.trim()) {
      ownerName = fullName.trim();
    }
  }

  // ── BYPASS: ativa o site diretamente sem Stripe (apenas em dev/teste) ──
  if (bypassPayment) {
    const { onboardingDraft: _, ...activeSettings } = settings;
    await admin.from("sites").update({ theme_settings: activeSettings }).eq("id", site.id);

    if (ownerUserId) {
      await admin.from("billing_profiles").upsert(
        {
          user_id: ownerUserId,
          site_id: site.id,
          email: ownerEmail,
          full_name: ownerName,
          document: document || null,
          document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : null,
          stripe_customer_id: "bypass_dev",
          billing_status: "active",
        },
        { onConflict: "user_id" },
      );
    }

    return NextResponse.json({ bypass: true });
  }

  // Find or create Stripe customer
  let customerId: string;
  try {
    customerId = await findOrCreateStripeCustomer(stripeKey, ownerEmail, ownerName);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao configurar cliente no Stripe.", details: err instanceof Error ? err.message : "Desconhecido" },
      { status: 502 },
    );
  }

  // Create embedded Checkout Session
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("customer", customerId);
  params.set("ui_mode", "embedded");
  params.set("return_url", `${requestUrl.origin}/login?checkout=success`);
  params.set("line_items[0][price]", payload.priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("allow_promotion_codes", "true");
  params.set("metadata[site_id]", site.id);
  params.set("metadata[site_domain]", site.domain);
  params.set("metadata[source]", "buildsphere_onboarding");

  const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const sessionData = (await sessionRes.json().catch(() => null)) as
    | { client_secret?: string; error?: { message?: string } }
    | null;

  if (!sessionRes.ok || !sessionData?.client_secret) {
    return NextResponse.json(
      { error: sessionData?.error?.message ?? "Falha ao criar sessão de pagamento." },
      { status: 502 },
    );
  }

  // Save billing profile as pending
  // Upsert no billing_profiles — conflito em user_id (unique constraint)
  // Se não há ownerUserId, apenas insere (sem upsert)
  if (ownerUserId) {
    await admin.from("billing_profiles").upsert(
      {
        user_id: ownerUserId,
        site_id: site.id,
        email: ownerEmail,
        full_name: ownerName,
        document: document || null,
        document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : null,
        stripe_customer_id: customerId,
        billing_status: "checkout_pending",
      },
      { onConflict: "user_id" },
    );
  } else {
    await admin.from("billing_profiles").insert({
      site_id: site.id,
      email: ownerEmail,
      full_name: ownerName,
      document: document || null,
      document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : null,
      stripe_customer_id: customerId,
      billing_status: "checkout_pending",
    });
  }

  return NextResponse.json({ clientSecret: sessionData.client_secret });
}
