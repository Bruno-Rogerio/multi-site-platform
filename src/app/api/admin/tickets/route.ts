import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  sendNewTicketEmail,
} from "@/lib/email";
import { createNotificationForMany, getAdminUserIds } from "@/lib/notifications";

// ─── SLA helpers ─────────────────────────────────────────────────────────────

async function lazyUpdateSlaBreached() {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // Mark past-deadline tickets as breached
  try {
    await admin
      .from("support_tickets")
      .update({ sla_breached: true })
      .lt("sla_deadline", new Date().toISOString())
      .eq("sla_breached", false)
      .neq("status", "resolved");
  } catch { /* ignore */ }

  // Send sla_warning notifications for tickets expiring within 2 hours
  const twoHoursAhead = new Date(Date.now() + 2 * 3_600_000).toISOString();

  const { data: nearDeadline } = await admin
    .from("support_tickets")
    .select("id, subject")
    .gt("sla_deadline", new Date().toISOString())
    .lt("sla_deadline", twoHoursAhead)
    .neq("status", "resolved");

  for (const ticket of nearDeadline ?? []) {
    const { count } = await admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("ticket_id", ticket.id)
      .eq("type", "sla_warning");

    if (!count) {
      const adminIds = await getAdminUserIds();
      await createNotificationForMany(
        adminIds,
        "sla_warning",
        "SLA próximo do limite",
        `Ticket "${ticket.subject}" expira em menos de 2h.`,
        ticket.id,
      ).catch(() => {});
    }
  }
}

// ─── GET /api/admin/tickets ──────────────────────────────────────────────────
export async function GET() {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Lazy SLA update (fire-and-forget — admins only to avoid double runs)
  if (profile.role === "admin") {
    lazyUpdateSlaBreached().catch(() => {});
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  let query = supabase
    .from("support_tickets")
    .select("*, ticket_messages(count)")
    .order("updated_at", { ascending: false });

  if (profile.role === "client") {
    if (!profile.site_id) {
      return NextResponse.json({ tickets: [] });
    }
    query = query.eq("site_id", profile.site_id) as typeof query;
  } else {
    // admin: join site name
    query = supabase
      .from("support_tickets")
      .select("*, sites(name), ticket_messages(count)")
      .order("sla_deadline", { ascending: true }) as typeof query;
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tickets: data ?? [] });
}

// ─── POST /api/admin/tickets ─────────────────────────────────────────────────
export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (profile.role !== "client" || !profile.site_id) {
    return NextResponse.json({ error: "Client account required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    category?: string;
    body?: string;
    attachments?: unknown[];
  } | null;

  const subject = body?.subject?.trim();
  const category = body?.category?.trim();
  const messageBody = body?.body?.trim();
  const attachments = body?.attachments ?? [];

  if (!subject || subject.length < 3) {
    return NextResponse.json({ error: "Assunto deve ter pelo menos 3 caracteres." }, { status: 400 });
  }
  if (!["suporte", "duvida", "faturamento", "sugestao"].includes(category ?? "")) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }
  if (!messageBody || messageBody.length < 10) {
    return NextResponse.json({ error: "Mensagem deve ter pelo menos 10 caracteres." }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  // Fetch site to determine plan → SLA
  const { data: site } = await supabase
    .from("sites")
    .select("id, name, theme_settings")
    .eq("id", profile.site_id)
    .maybeSingle();

  if (!site) {
    return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  }

  const selectedPlan = (site.theme_settings as Record<string, unknown>)?.selectedPlan as string | undefined;
  const slaHours = selectedPlan === "premium-full" ? 2 : 24;
  const slaDeadline = new Date(Date.now() + slaHours * 3_600_000).toISOString();

  // Insert ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({
      site_id: profile.site_id,
      owner_id: profile.id,
      subject,
      category,
      sla_deadline: slaDeadline,
    })
    .select()
    .single();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: ticketError?.message ?? "Erro ao criar chamado." }, { status: 400 });
  }

  // Insert first message
  const { error: msgError } = await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_role: "client",
    sender_id: profile.id,
    body: messageBody,
    attachments,
  });

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 400 });
  }

  // Return ticketId + sla_deadline so client can update optimistic state
  const ticketResponse = { ticketId: ticket.id, sla_deadline: slaDeadline };

  // Notify admins: email + in-app (fire-and-forget)
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data: adminProfiles } = await adminClient
      .from("user_profiles")
      .select("id, email")
      .eq("role", "admin");

    if (adminProfiles?.length) {
      await Promise.all(
        adminProfiles.map((ap) =>
          sendNewTicketEmail(ap.email, {
            id: ticket.id,
            subject,
            category: category!,
            businessName: site.name ?? "Cliente",
          }),
        ),
      );

      const adminIds = adminProfiles.map((ap) => ap.id as string);
      createNotificationForMany(
        adminIds,
        "ticket_new",
        "Novo chamado aberto",
        `${site.name ?? "Cliente"}: ${subject}`,
        ticket.id,
      ).catch(() => {});
    }
  }

  return NextResponse.json(ticketResponse, { status: 201 });
}
