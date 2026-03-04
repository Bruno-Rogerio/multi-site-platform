import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createNotificationForMany, getAdminUserIds } from "@/lib/notifications";

// ─── POST /api/cron/sla-check ────────────────────────────────────────────────
// Called by Vercel Cron (every 30 min). Finds tickets with SLA ≤ 2h remaining
// and creates a sla_warning notification for admins (once per ticket).
//
// Requires header:  Authorization: Bearer {CRON_SECRET}
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable." }, { status: 500 });
  }

  // Tickets where SLA expires within the next 2 hours and aren't resolved
  const twoHoursFromNow = new Date(Date.now() + 2 * 3_600_000).toISOString();

  const { data: tickets, error: ticketsError } = await supabase
    .from("support_tickets")
    .select("id, subject, sla_deadline")
    .lte("sla_deadline", twoHoursFromNow)
    .neq("status", "resolved");

  if (ticketsError) {
    return NextResponse.json({ error: ticketsError.message }, { status: 500 });
  }

  if (!tickets || tickets.length === 0) {
    return NextResponse.json({ ok: true, checked: 0, warned: 0 });
  }

  // Check which tickets already have a sla_warning notification
  const ticketIds = tickets.map((t) => t.id as string);
  const { data: existingWarnings } = await supabase
    .from("notifications")
    .select("ticket_id")
    .eq("type", "sla_warning")
    .in("ticket_id", ticketIds);

  const alreadyWarnedIds = new Set((existingWarnings ?? []).map((n) => n.ticket_id as string));
  const toWarn = tickets.filter((t) => !alreadyWarnedIds.has(t.id as string));

  if (toWarn.length === 0) {
    return NextResponse.json({ ok: true, checked: tickets.length, warned: 0 });
  }

  const adminIds = await getAdminUserIds();
  if (adminIds.length === 0) {
    return NextResponse.json({ ok: true, checked: tickets.length, warned: 0 });
  }

  let warned = 0;
  for (const ticket of toWarn) {
    const remaining = Math.max(0, Math.round((new Date(ticket.sla_deadline as string).getTime() - Date.now()) / 60_000));
    const remainingText = remaining > 60
      ? `${Math.floor(remaining / 60)}h ${remaining % 60}m`
      : `${remaining}m`;

    await createNotificationForMany(
      adminIds,
      "sla_warning",
      "⚠️ SLA prestes a vencer",
      `Chamado "${ticket.subject}" vence em ${remainingText}`,
      ticket.id as string,
    );
    warned++;
  }

  return NextResponse.json({ ok: true, checked: tickets.length, warned });
}
