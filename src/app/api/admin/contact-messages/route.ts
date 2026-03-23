import { NextResponse } from "next/server";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

// PATCH /api/admin/contact-messages
// Body: { id: string } – marks the message as read (scoped to client's own site)
export async function PATCH(req: Request) {
  const profile = await requireUserProfile(["client"]).catch(() => null);
  if (!profile?.site_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const { error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", body.id)
    .eq("site_id", profile.site_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
