import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

const allowedOtpTypes: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function isOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && allowedOtpTypes.includes(value as EmailOtpType));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type");
  const nextPath = requestUrl.searchParams.get("next");

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=supabase_missing", requestUrl.origin));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=callback_failed", requestUrl.origin));
    }
  } else if (tokenHash && isOtpType(otpType)) {
    const { error } = await supabase.auth.verifyOtp({
      type: otpType,
      token_hash: tokenHash,
    });

    if (error) {
      return NextResponse.redirect(new URL("/login?error=otp_failed", requestUrl.origin));
    }
  } else {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", requestUrl.origin));
  }

  if (otpType === "invite" || otpType === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

  const safeNextPath = nextPath && nextPath.startsWith("/") ? nextPath : "/admin";
  return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
}
