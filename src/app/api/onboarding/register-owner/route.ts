import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validateEmail, validatePassword } from "@/lib/onboarding/validation";

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

  return NextResponse.json({ ok: true, userId: data.user.id });
}
