import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ userId: string }> };

// ─── DELETE /api/admin/users/[userId] ────────────────────────────────────────
// Admin-only: permanently deletes a user (auth + profile via cascade).
export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await params;

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (profile.role !== "admin") {
    return NextResponse.json({ error: "Admin account required." }, { status: 403 });
  }

  if (userId === profile.id) {
    return NextResponse.json({ error: "Não é possível excluir sua própria conta." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível excluir o usuário.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
