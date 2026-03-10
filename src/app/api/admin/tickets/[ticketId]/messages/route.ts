import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createNotification, createNotificationForMany, getAdminUserIds } from "@/lib/notifications";

type Params = { params: Promise<{ ticketId: string }> };

// ─── POST /api/admin/tickets/[ticketId]/messages ─────────────────────────────
export async function POST(request: Request, { params }: Params) {
  const { ticketId } = await params;

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    body?: string;
    attachments?: unknown[];
  } | null;

  const messageBody = body?.body?.trim();
  const attachments = body?.attachments ?? [];

  if (!messageBody || messageBody.length < 1) {
    return NextResponse.json({ error: "Mensagem não pode estar vazia." }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  // Load ticket to verify access + status
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("*, sites(name)")
    .eq("id", ticketId)
    .maybeSingle();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 });
  }

  if (ticket.status === "resolved") {
    return NextResponse.json({ error: "Chamado encerrado. Abra um novo chamado para continuar." }, { status: 400 });
  }

  // Access check for clients
  if (profile.role === "client" && ticket.site_id !== profile.site_id) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const senderRole = profile.role === "admin" ? "admin" : "client";

  const { data: message, error: msgError } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      sender_role: senderRole,
      sender_id: profile.id,
      body: messageBody,
      attachments,
    })
    .select()
    .single();

  if (msgError || !message) {
    return NextResponse.json({ error: msgError?.message ?? "Erro ao enviar mensagem." }, { status: 400 });
  }

  // In-app notifications only — no email per message (avoids quota exhaustion)
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const siteName = (ticket.sites as { name: string } | null)?.name ?? "Cliente";
    const preview = messageBody.length > 80 ? messageBody.slice(0, 77) + "…" : messageBody;

    if (senderRole === "admin") {
      createNotification(
        ticket.owner_id as string,
        "ticket_message",
        "Nova resposta no seu chamado",
        `${ticket.subject}: ${preview}`,
        ticketId,
      ).catch(() => {});
    } else {
      const { data: adminProfiles } = await adminClient
        .from("user_profiles")
        .select("id, email")
        .eq("role", "admin");

      if (adminProfiles?.length) {
        const adminIds = adminProfiles.map((ap) => ap.id as string);
        createNotificationForMany(
          adminIds,
          "ticket_message",
          `${siteName} respondeu`,
          `${ticket.subject}: ${preview}`,
          ticketId,
        ).catch(() => {});
      }
    }
  }

  return NextResponse.json({ message }, { status: 201 });
}
