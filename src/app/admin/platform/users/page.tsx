import { Users } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { UsersTable } from "./users-table";

type UserRow = {
  id: string;
  email: string;
  role: string;
  site_id: string | null;
  created_at: string;
};

export default async function PlatformUsersPage() {
  await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();

  let users: UserRow[] = [];
  let sitesMap: Record<string, string> = {};

  if (supabase) {
    const { data: usersData } = await supabase
      .from("user_profiles")
      .select("id,email,role,site_id,created_at")
      .order("created_at", { ascending: false });
    users = (usersData as UserRow[] | null) ?? [];

    // Build site name map for linked users
    const siteIds = [...new Set(users.map((u) => u.site_id).filter(Boolean))] as string[];
    if (siteIds.length > 0) {
      const { data: sitesData } = await supabase
        .from("sites")
        .select("id,name")
        .in("id", siteIds);
      if (sitesData) {
        for (const site of sitesData as Array<{ id: string; name: string }>) {
          sitesMap[site.id] = site.name;
        }
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Usuários</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Todos os usuários da plataforma ({users.length}).
        </p>
      </div>

      <UsersTable users={users} sitesMap={sitesMap} />
    </div>
  );
}
