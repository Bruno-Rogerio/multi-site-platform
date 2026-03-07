import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type ContactPayload = {
  siteId: string;
  name: string;
  email: string;
  message: string;
};

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  if (!checkRateLimit(getClientIp(request), "contact", 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (
    !body ||
    !isFilledString(body.siteId) ||
    !isFilledString(body.name) ||
    !isFilledString(body.email) ||
    !isFilledString(body.message)
  ) {
    return NextResponse.json(
      { error: "Invalid payload. Required fields: siteId, name, email, message." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      site_id: body.siteId.trim(),
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Could not save contact message.", details: error.message },
        { status: 500 },
      );
    }
  } else {
    console.info("Contact payload received without Supabase configured", body);
  }

  return NextResponse.json({ ok: true });
}
