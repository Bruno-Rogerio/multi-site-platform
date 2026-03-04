import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFileName(raw: string): string {
  const ext = raw.includes(".") ? (raw.split(".").pop() ?? "bin") : "bin";
  const base = raw.replace(/\.[^/.]+$/, "");
  const safeBase = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${safeBase || "file"}.${ext.toLowerCase()}`;
}

// ─── POST /api/admin/tickets/upload ─────────────────────────────────────────
export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const ticketId = formData.get("ticketId");
  const fileEntry = formData.get("file");

  if (typeof ticketId !== "string" || !ticketId) {
    return NextResponse.json({ error: "Missing ticketId." }, { status: 400 });
  }

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (fileEntry.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande. Máximo 10MB." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  }

  // Resolve siteId from ticket (admin client bypasses RLS)
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("site_id")
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket) {
    return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 });
  }

  // Client access check
  if (profile.role === "client" && profile.site_id !== ticket.site_id) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const bucket = process.env.SUPABASE_ASSETS_BUCKET ?? "site-assets";
  const safeName = sanitizeFileName(fileEntry.name);
  const path = `tickets/${ticket.site_id}/${ticketId}/${Date.now()}-${safeName}`;
  const buffer = await fileEntry.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: fileEntry.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    url: publicData.publicUrl,
    name: fileEntry.name,
    size: fileEntry.size,
    type: fileEntry.type,
  });
}
