import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FiscalPayload = {
  legalName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
};

export async function PATCH(request: Request) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (profile.role !== "client" || !profile.site_id) {
    return NextResponse.json({ error: "Client account required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as FiscalPayload | null;
  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin indisponível." }, { status: 500 });
  }

  const { error } = await admin
    .from("billing_profiles")
    .update({
      legal_name: body.legalName?.trim() || null,
      address: body.address?.trim() || null,
      postal_code: body.postalCode?.trim() || null,
      city: body.city?.trim() || null,
      state: body.state?.trim() || null,
    })
    .eq("site_id", profile.site_id);

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível salvar os dados fiscais.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
