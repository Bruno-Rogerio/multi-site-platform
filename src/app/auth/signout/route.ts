import { NextResponse } from "next/server";

import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createSupabaseServerAuthClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
