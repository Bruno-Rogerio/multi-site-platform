import { redirect } from "next/navigation";

import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "client";

export type UserProfile = {
  id: string;
  email: string;
  role: AppRole;
  site_id: string | null;
};

export type ProfileResolutionReason =
  | "ok"
  | "supabase_missing"
  | "auth_user_error"
  | "no_user"
  | "profile_query_error"
  | "profile_not_found";

type ProfileResolution = {
  profile: UserProfile | null;
  reason: ProfileResolutionReason;
};

export async function getCurrentUserProfileResolution(): Promise<ProfileResolution> {
  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return { profile: null, reason: "supabase_missing" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { profile: null, reason: "auth_user_error" };
  }

  if (!user) {
    return { profile: null, reason: "no_user" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,email,role,site_id")
    .eq("id", user.id)
    .maybeSingle<UserProfile>();

  if (profileError) {
    return { profile: null, reason: "profile_query_error" };
  }

  if (!profile) {
    return { profile: null, reason: "profile_not_found" };
  }

  return { profile, reason: "ok" };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const { profile } = await getCurrentUserProfileResolution();
  return profile;
}

export async function requireUserProfile(allowedRoles?: AppRole[]) {
  const { profile, reason } = await getCurrentUserProfileResolution();
  if (!profile) {
    redirect(`/login?error=auth_required&reason=${reason}`);
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect("/login?error=forbidden");
  }

  return profile;
}
