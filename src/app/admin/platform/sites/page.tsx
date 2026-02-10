import { Globe, ExternalLink } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { SitesTable } from "./sites-table";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  created_at: string;
};

export default async function PlatformSitesPage() {
  await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();

  let sites: SiteRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan,created_at")
      .order("created_at", { ascending: false });
    sites = (data as SiteRow[] | null) ?? [];
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
