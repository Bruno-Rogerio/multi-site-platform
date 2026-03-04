import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { requireUserProfile } from "@/lib/auth/session";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ToastProvider } from "@/components/admin/toast-provider";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await requireUserProfile(["admin", "client"]);
  const branding = await getPlatformBrandingSettings();

  const supabase = await createSupabaseServerAuthClient();

  // Fetch pending drafts count for sidebar badge (admin only)
  let pendingDrafts = 0;
  if (profile.role === "admin" && supabase) {
    const { count } = await supabase
      .from("onboarding_drafts")
      .select("id", { count: "exact", head: true })
      .in("status", ["draft", "checkout_pending"]);
    pendingDrafts = count ?? 0;
  }

  // Fetch open tickets count for client sidebar badge
  let openTicketsCount = 0;
  if (profile.role === "client" && profile.site_id && supabase) {
    const { count } = await supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("site_id", profile.site_id)
      .in("status", ["open", "in_progress"]);
    openTicketsCount = count ?? 0;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#0B1020]">
        <AdminSidebar
          role={profile.role}
          brandName={branding.brand_name || "BuildSphere"}
          logoUrl={branding.logo_url || ""}
          pendingDrafts={pendingDrafts}
          openTicketsCount={openTicketsCount}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar email={profile.email} role={profile.role} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
