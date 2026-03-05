import { Globe } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { SitesTable } from "./sites-table";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  theme_settings: Record<string, unknown> | null;
  billing_status: string | null;
  created_at: string;
};

export default async function PlatformSitesPage() {
  await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();

  let sites: SiteRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan,theme_settings,created_at,billing_profiles(billing_status)")
      .order("created_at", { ascending: false });

    const raw = (data ?? []) as Array<{
      id: string;
      name: string;
      domain: string;
      plan: string;
      theme_settings: Record<string, unknown> | null;
      created_at: string;
      billing_profiles: Array<{ billing_status: string }> | { billing_status: string } | null;
    }>;

    sites = raw.map((r) => ({
      id: r.id,
      name: r.name,
      domain: r.domain,
      plan: r.plan,
      theme_settings: r.theme_settings,
      billing_status: Array.isArray(r.billing_profiles)
        ? (r.billing_profiles[0]?.billing_status ?? null)
        : ((r.billing_profiles as { billing_status: string } | null)?.billing_status ?? null),
      created_at: r.created_at,
    }));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Sites</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Todos os sites da plataforma ({sites.length}).
        </p>
      </div>

      <SitesTable sites={sites} />
    </div>
  );
}
