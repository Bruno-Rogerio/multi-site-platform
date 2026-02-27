import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SaveLeadPayload = {
  email: string;
  businessName: string;
  businessType: string;
  subdomain?: string;
};

async function sendConfirmationEmail(
  email: string,
  businessName: string,
): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return; // silently skip if not configured

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BuildSphere <ola@bsph.com.br>",
      to: email,
      subject: `Seu site para ${businessName} está sendo criado!`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a2e;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">Ótimo começo!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            Guardamos seu lugar. Continue construindo o site de <strong>${businessName}</strong>
            — você está a poucos passos de estar online.
          </p>
          <p style="font-size: 14px; color: #888; margin-top: 32px;">
            Se não foi você, pode ignorar este e-mail. Nenhuma conta foi criada ainda.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa;">BuildSphere · Feito no Brasil</p>
        </div>
      `,
    }),
  }).catch((err: unknown) => {
    console.error("[Resend] network error sending confirmation email:", err);
    return null;
  });

  if (resendRes && !resendRes.ok) {
    const body = await resendRes.json().catch(() => null);
    console.error("[Resend] API error sending confirmation email:", resendRes.status, body);
  }
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as SaveLeadPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const businessName = payload.businessName?.trim();
  const businessType = payload.businessType?.trim();
  const subdomain = payload.subdomain?.trim() || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  if (!businessName || businessName.length < 2) {
    return NextResponse.json({ error: "Informe o nome do negócio." }, { status: 400 });
  }

  if (!businessType) {
    return NextResponse.json({ error: "Selecione o tipo de negócio." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Configuração do servidor incompleta." },
      { status: 500 },
    );
  }

  const { data: lead, error } = await admin
    .from("leads")
    .insert({
      email,
      business_name: businessName,
      business_type: businessType,
      subdomain,
    })
    .select("id")
    .single();

  if (error || !lead) {
    return NextResponse.json(
      { error: "Falha ao salvar dados. Tente novamente." },
      { status: 500 },
    );
  }

  // Await so Vercel doesn't kill the function before the Resend call completes
  await sendConfirmationEmail(email, businessName);

  return NextResponse.json({ ok: true, leadId: lead.id });
}
