import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

const BASE_MONTHLY_PRICE = 59.9;
const ADDON_PRICES: Record<string, number> = {
  "premium-design": 19.9,
  "extra-section": 9.9,
  blog: 29.9,
  "lead-capture": 19.9,
  appointments: 29.9,
  "members-area": 49.9,
};

type RegisterCheckoutPayload = {
  siteId: string;
  creationMode?: "template" | "builder" | "builder-premium";
  fullName: string;
  document: string;
  email: string;
  password: string;
  addonsSelected?: string[];
};

function normalizeDocument(value: string): string {
  return value.replace(/\D/g, "");
}

function validatePassword(password: string): boolean {
  return (
    password.length >= 10 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toMonthlyAmount(addonsSelected: string[]): number {
  const addonsTotal = addonsSelected.reduce((sum, addonId) => sum + (ADDON_PRICES[addonId] ?? 0), 0);
  return BASE_MONTHLY_PRICE + addonsTotal;
}

async function createStripeCustomer(
  stripeSecretKey: string,
  payload: RegisterCheckoutPayload,
  documentType: "cpf" | "cnpj",
) {
  const params = new URLSearchParams();
  params.set("name", payload.fullName.trim());
  params.set("email", payload.email.trim().toLowerCase());
  params.set("metadata[document]", normalizeDocument(payload.document));
  params.set("metadata[document_type]", documentType);
  params.set("metadata[source]", "buildsphere_onboarding");

  const response = await fetch("https://api.stripe.com/v1/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await response.json().catch(() => null)) as
    | { id?: string; error?: { message?: string } }
    | null;

  if (!response.ok || !data?.id) {
    throw new Error(data?.error?.message ?? "Falha ao criar customer no Stripe.");
  }

  return data.id;
}

async function createStripeCheckoutSession(
  stripeSecretKey: string,
  customerId: string,
  siteDomain: string,
  monthlyAmount: number,
  requestOrigin: string,
) {
  const unitAmount = Math.round(monthlyAmount * 100);
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("customer", customerId);
  params.set("success_url", `${requestOrigin}/login?checkout=success`);
  params.set("cancel_url", `${requestOrigin}/quero-comecar?checkout=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "brl");
  params.set("line_items[0][price_data][unit_amount]", String(unitAmount));
  params.set("line_items[0][price_data][recurring][interval]", "month");
  params.set("line_items[0][price_data][product_data][name]", `BuildSphere SaaS - ${siteDomain}`);
  params.set("allow_promotion_codes", "true");
  params.set("metadata[site_domain]", siteDomain);
  params.set("metadata[source]", "buildsphere_onboarding");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await response.json().catch(() => null)) as
    | { url?: string; error?: { message?: string } }
    | null;

  if (!response.ok || !data?.url) {
    throw new Error(data?.error?.message ?? "Falha ao criar checkout no Stripe.");
  }

  return data.url;
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const hostname = resolveRequestHostname(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    requestUrl.hostname,
  );

  if (classifyHost(hostname).kind === "tenant") {
    return NextResponse.json({ error: "Checkout deve ser iniciado no dominio da plataforma." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as RegisterCheckoutPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim().toLowerCase();
  const document = normalizeDocument(payload.document ?? "");
  const password = payload.password ?? "";
  const addonsSelected = Array.isArray(payload.addonsSelected) ? payload.addonsSelected : [];

  if (!isUuid(payload.siteId)) {
    return NextResponse.json({ error: "siteId invalido." }, { status: 400 });
  }
  if (!fullName || fullName.length < 3) {
    return NextResponse.json({ error: "Informe nome completo valido." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail valido." }, { status: 400 });
  }
  if (document && !(document.length === 11 || document.length === 14)) {
    return NextResponse.json({ error: "Informe CPF ou CNPJ valido." }, { status: 400 });
  }
  if (!validatePassword(password)) {
    return NextResponse.json(
      { error: "Senha fraca. Use 10+ caracteres com maiuscula, minuscula, numero e simbolo." },
      { status: 400 },
    );
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY ausente para cadastro." },
      { status: 500 },
    );
  }

  const bypassPayment = process.env.BYPASS_PAYMENT === "true";

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!bypassPayment && !stripeSecretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY ausente para iniciar checkout." },
      { status: 500 },
    );
  }

  const { data: site, error: siteError } = await supabaseAdmin
    .from("sites")
    .select("id,domain,name,theme_settings")
    .eq("id", payload.siteId)
    .maybeSingle();

  if (siteError || !site) {
    return NextResponse.json(
      { error: "Rascunho nao encontrado. Crie o rascunho novamente antes do checkout." },
      { status: 404 },
    );
  }

  const userMeta = {
    role: "client",
    site_id: site.id,
    full_name: fullName,
    document: document || undefined,
    document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : undefined,
  };

  let userId: string;

  // Try to create new user
  const { data: createdUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMeta,
  });

  if (userError) {
    // If user already exists, find and reuse
    if (userError.message?.toLowerCase().includes("already") || userError.status === 422) {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const existing = userList?.users?.find((u) => u.email?.toLowerCase() === email);

      if (!existing) {
        return NextResponse.json(
          { error: "Nao foi possivel criar usuario.", details: userError.message },
          { status: 400 },
        );
      }

      userId = existing.id;
      await supabaseAdmin.auth.admin.updateUser(userId, {
        password,
        user_metadata: userMeta,
      });
    } else {
      return NextResponse.json(
        { error: "Nao foi possivel criar usuario.", details: userError.message },
        { status: 400 },
      );
    }
  } else if (!createdUser.user) {
    return NextResponse.json(
      { error: "Nao foi possivel criar usuario." },
      { status: 400 },
    );
  } else {
    userId = createdUser.user.id;
  }

  const monthlyAmount = toMonthlyAmount(addonsSelected);

  // --- BYPASS: skip Stripe, activate site directly ---
  if (bypassPayment) {
    // Remove onboardingDraft flag to activate the site
    const currentSettings = (site.theme_settings as Record<string, unknown>) ?? {};
    const { onboardingDraft: _, ...activeSettings } = currentSettings;

    await supabaseAdmin
      .from("sites")
      .update({ theme_settings: activeSettings })
      .eq("id", site.id);

    // Create billing profile as active (no Stripe)
    await supabaseAdmin.from("billing_profiles").upsert(
      {
        user_id: userId,
        site_id: site.id,
        full_name: fullName,
        document: document || null,
        document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : null,
        email,
        stripe_customer_id: "bypass_dev",
        billing_status: "active",
        monthly_amount: monthlyAmount,
      },
      { onConflict: "user_id" },
    );

    return NextResponse.json({
      ok: true,
      bypass: true,
      siteDomain: site.domain,
      monthlyAmount,
    });
  }

  // --- Normal Stripe checkout flow ---
  let customerId = "";
  let checkoutUrl = "";
  try {
    customerId = await createStripeCustomer(
      stripeSecretKey,
      payload,
      document ? (document.length === 11 ? "cpf" : "cnpj") : "cpf",
    );
    checkoutUrl = await createStripeCheckoutSession(
      stripeSecretKey,
      customerId,
      site.domain,
      monthlyAmount,
      requestUrl.origin,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Usuario criado, mas checkout nao iniciado.",
        details: error instanceof Error ? error.message : "Erro desconhecido no Stripe.",
      },
      { status: 502 },
    );
  }

  const { error: billingError } = await supabaseAdmin.from("billing_profiles").upsert(
    {
      user_id: userId,
      site_id: site.id,
      full_name: fullName,
      document: document || null,
      document_type: document ? (document.length === 11 ? "cpf" : "cnpj") : null,
      email,
      stripe_customer_id: customerId,
      billing_status: "checkout_pending",
      monthly_amount: monthlyAmount,
    },
    { onConflict: "user_id" },
  );

  if (billingError) {
    return NextResponse.json(
      {
        error: "Checkout criado, mas falhou ao salvar perfil de billing.",
        details: billingError.message,
        checkoutUrl,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    checkoutUrl,
    siteDomain: site.domain,
    monthlyAmount,
  });
}
