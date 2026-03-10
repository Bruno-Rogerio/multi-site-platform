import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/notifications";
import { sendTicketStatusChangedEmail } from "@/lib/email";

type Params = { params: Promise<{ ticketId: string }> };

// ─── GET /api/admin/tickets/[ticketId] ───────────────────────────────────────
export async function GET(_req: Request, { params }: Params) {
  const { ticketId } = await params;

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("*, sites(name)")
    .eq("id", ticketId)
    .maybeSingle();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 });
  }

  const { data: messages, error: msgError } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 400 });
  }

  return NextResponse.json({ ticket, messages: messages ?? [] });
}

// ─── PATCH /api/admin/tickets/[ticketId] ─────────────────────────────────────
// Admin-only: update ticket status
export async function PATCH(request: Request, { params }: Params) {
  const { ticketId } = await params;

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (profile.role !== "admin") {
    return NextResponse.json({ error: "Admin account required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const newStatus = body?.status;

  const validStatuses = ["open", "in_progress", "waiting_client", "resolved"];
  if (!newStatus || !validStatuses.includes(newStatus)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  // Fetch ticket to get owner + subject for notification
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("owner_id, subject")
    .eq("id", ticketId)
    .maybeSingle();

  const updatePayload: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };
  if (newStatus === "resolved") {
    updatePayload.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("support_tickets")
    .update(updatePayload)
    .eq("id", ticketId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Notify client about status change: in-app + email (fire-and-forget)
  if (ticket?.owner_id) {
    const STATUS_LABELS: Record<string, string> = {
      open:           "Aberto",
      in_progress:    "Em andamento",
      waiting_client: "Aguardando sua resposta",
      resolved:       "Resolvido",
    };

    createNotification(
      ticket.owner_id as string,
      "ticket_status_changed",
      "Status do chamado atualizado",
      `"${ticket.subject}" → ${STATUS_LABELS[newStatus] ?? newStatus}`,
      ticketId,
    ).catch(() => {});

    // Send status change email to client
    const adminClient = createSupabaseAdminClient();
    if (adminClient) {
      adminClient
        .from("user_profiles")
        .select("email, full_name")
        .eq("id", ticket.owner_id)
        .maybeSingle()
        .then(({ data: ownerProfile }) => {
          if (ownerProfile?.email) {
            sendTicketStatusChangedEmail(
              ownerProfile.email,
              ownerProfile.full_name ?? "Cliente",
              { id: ticketId, subject: ticket.subject },
              newStatus,
            ).catch(() => {});
          }
        })
        .catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
