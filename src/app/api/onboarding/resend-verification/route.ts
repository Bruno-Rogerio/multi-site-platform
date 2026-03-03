import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendVerificationEmail } from "@/lib/email";

function getPlatformUrl(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");

  const rootDomain =
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN?.trim() ??
    process.env.PLATFORM_ROOT_DOMAIN?.trim();
  if (rootDomain) return `https://${rootDomain}`;

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Servidor indisponível." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  // Find the user to get their name
  const { data: users } = await admin.auth.admin.listUsers();
  const user = users?.users?.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    // Don't reveal whether the email exists — just return OK
    return NextResponse.json({ ok: true });
  }

  if (user.email_confirmed_at) {
    return NextResponse.json(
      { error: "E-mail já confirmado. Faça login normalmente." },
      { status: 409 },
    );
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.trim() || email.split("@")[0];

  const platformUrl = getPlatformUrl(request);
  const redirectTo = `${platformUrl}/auth/callback?next=/admin/client`;

  // Use magiclink for resend (doesn't require password, proves email access)
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("[resend-verification] generateLink failed:", linkError?.message);
    return NextResponse.json(
      { error: "Falha ao gerar link. Tente novamente." },
      { status: 500 },
    );
  }

  // Build our own URL using hashed_token — bypasses implicit/PKCE project setting
  const tokenHash = linkData.properties.hashed_token;
  const verificationUrl = `${platformUrl}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink&next=/admin/client`;

  await sendVerificationEmail(email, fullName, verificationUrl);

  return NextResponse.json({ ok: true });
}
