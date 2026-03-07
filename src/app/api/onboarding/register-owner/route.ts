import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validateEmail, validatePassword } from "@/lib/onboarding/validation";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type RegisterOwnerPayload = {
  email: string;
  password: string;
  fullName: string;
};

/** Returns the platform base URL, e.g. https://bsph.com.br */
function getPlatformUrl(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");

  const rootDomain =
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN?.trim() ??
    process.env.PLATFORM_ROOT_DOMAIN?.trim();
  if (rootDomain) return `https://${rootDomain}`;

  // Fallback: derive from the incoming request
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  if (!checkRateLimit(getClientIp(request), "register-owner", 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as RegisterOwnerPayload | null;
  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const { email, password, fullName } = body;

  if (!validateEmail(email).valid) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (!validatePassword(password).valid) {
    return NextResponse.json({ error: "Senha não atende aos requisitos." }, { status: 400 });
  }
  if (!fullName || fullName.trim().length < 2) {
    return NextResponse.json({ error: "Nome muito curto." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = fullName.trim();

  // ── Check if email already exists ────────────────────────────────────────
  const { data: existing } = await admin.auth.admin.listUsers();
  const alreadyExists = existing?.users?.some(
    (u) => u.email?.toLowerCase() === normalizedEmail,
  );

  if (alreadyExists) {
    return NextResponse.json(
      { error: "E-mail já cadastrado. Entre com sua conta para continuar." },
      { status: 409 },
    );
  }

  // ── Create user (email NOT auto-confirmed — must verify via email link) ───
  const { data, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    user_metadata: { full_name: trimmedName },
    email_confirm: false,
  });

  if (createError || !data.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Erro ao criar conta." },
      { status: 500 },
    );
  }

  // ── Generate verification link via Supabase Admin ─────────────────────────
  const platformUrl = getPlatformUrl(request);
  const redirectTo = `${platformUrl}/auth/callback?next=/admin/client`;

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "signup",
    email: normalizedEmail,
    password,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.action_link) {
    // Non-fatal: account was created; user can request resend later.
    console.error("[register-owner] generateLink failed:", linkError?.message);
    return NextResponse.json({
      ok: true,
      userId: data.user.id,
      requiresVerification: true,
      linkFailed: true,
    });
  }

  // ── Build our own verification URL using hashed_token ────────────────────
  // This bypasses the Supabase project's implicit/PKCE setting: the link goes
  // directly to our /auth/callback which calls verifyOtp() server-side.
  const tokenHash = linkData.properties.hashed_token;
  const verificationUrl = `${platformUrl}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=signup&next=/admin/client`;

  // ── Send beautiful verification email via Resend ──────────────────────────
  await sendVerificationEmail(normalizedEmail, trimmedName, verificationUrl);

  return NextResponse.json({
    ok: true,
    userId: data.user.id,
    requiresVerification: true,
  });
}
