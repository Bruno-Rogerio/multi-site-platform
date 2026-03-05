import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ userId: string }> };

// ─── POST /api/admin/users/[userId]/reset-password ───────────────────────────
// Admin-only: sends a password recovery email to the given user.
export async function POST(request: Request, { params }: Params) {
  const { userId } = await params;

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (profile.role !== "admin") {
    return NextResponse.json({ error: "Admin account required." }, { status: 403 });
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable." }, { status: 500 });
  }

  // Fetch target user's email
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();

  if (!userProfile?.email) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const redirectTo = `${origin}/auth/callback?next=/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(userProfile.email, {
    redirectTo,
  });

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível enviar o email de reset.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, email: userProfile.email });
}
