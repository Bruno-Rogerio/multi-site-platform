import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendLeadConfirmationEmail } from "@/lib/email";

type SaveLeadPayload = {
  email: string;
  businessName: string;
  businessType: string;
  subdomain?: string;
};

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

  await sendLeadConfirmationEmail(email, businessName);

  return NextResponse.json({ ok: true, leadId: lead.id });
}
