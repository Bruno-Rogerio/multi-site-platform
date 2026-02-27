import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validateEmail, validatePassword } from "@/lib/onboarding/validation";

async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return;

  const firstName = fullName.split(" ")[0];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BuildSphere <ola@bsph.com.br>",
      to: email,
      subject: "Sua conta foi criada! Acesse seu site",
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a2e;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">Bem-vindo(a), ${firstName}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            Sua conta na BuildSphere foi criada com sucesso.
            Agora você pode publicar e gerenciar o seu site.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            Acesse sua área com o e-mail <strong>${email}</strong> e a senha que você criou.
          </p>
          <a
            href="https://bsph.com.br/login"
            style="display: inline-block; margin-top: 24px; padding: 12px 28px; background: #3B82F6; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;"
          >
            Acessar minha conta
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #aaa;">BuildSphere · Feito no Brasil</p>
        </div>
      `,
    }),
  }).catch((err: unknown) => {
    console.error("[Resend] network error sending welcome email:", err);
    return null;
  });

  if (res && !res.ok) {
    const body = await res.json().catch(() => null);
    console.error("[Resend] API error sending welcome email:", res.status, body);
  }
}

type RegisterOwnerPayload = {
  email: string;
  password: string;
  fullName: string;
};

export async function POST(request: Request) {
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

  // Check if email already exists
  const { data: existing } = await admin.auth.admin.listUsers();
  const alreadyExists = existing?.users?.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase().trim(),
  );

  if (alreadyExists) {
    return NextResponse.json(
      { error: "E-mail já cadastrado. Entre com sua conta para continuar." },
      { status: 409 },
    );
  }

  // Create user via admin — email_confirm: true skips confirmation email
  const { data, error } = await admin.auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    user_metadata: { full_name: fullName.trim() },
    email_confirm: true,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Erro ao criar conta." },
      { status: 500 },
    );
  }

  await sendWelcomeEmail(email.toLowerCase().trim(), fullName.trim());

  return NextResponse.json({ ok: true, userId: data.user.id });
}
