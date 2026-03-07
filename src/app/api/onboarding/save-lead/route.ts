import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendLeadConfirmationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type SaveLeadPayload = {
  email: string;
  businessName: string;
  businessType: string;
  subdomain?: string;
};

export async function POST(request: Request) {
  if (!checkRateLimit(getClientIp(request), "save-lead", 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

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

  // Check if email already registered (lead or active account)
  const [{ data: existingLead }, { data: existingProfile }] = await Promise.all([
    admin.from("leads").select("id").eq("email", email).maybeSingle(),
    admin.from("profiles").select("id").eq("email", email).maybeSingle(),
  ]);
  if (existingLead ?? existingProfile) {
    return NextResponse.json(
      { error: "Este e-mail já está cadastrado. Faça login em /login ou use outro e-mail." },
      { status: 409 },
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
