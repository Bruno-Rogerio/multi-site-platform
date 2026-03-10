import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PipelineBoard, type SiteRow } from "@/components/admin/pipeline-board";

export default async function PlatformPipelinePage() {
  await requireUserProfile(["admin"]);
  const admin = createSupabaseAdminClient();

  let sites: SiteRow[] = [];
  if (admin) {
    const { data } = await admin
      .from("sites")
      .select(`
        id,
        name,
        domain,
        plan,
        theme_settings,
        created_at,
        user_profiles ( email ),
        billing_profiles ( billing_status )
      `)
      .order("created_at", { ascending: false });

    if (data) {
      sites = (data as unknown[]).map((row) => {
        const r = row as {
          id: string;
          name: string;
          domain: string;
          plan: string;
          theme_settings: Record<string, unknown> | null;
          created_at: string;
          user_profiles: { email: string }[] | { email: string } | null;
          billing_profiles: { billing_status: string }[] | { billing_status: string } | null;
        };

        const up = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles;
        const bp = Array.isArray(r.billing_profiles) ? r.billing_profiles[0] : r.billing_profiles;
        const billingStatus = bp?.billing_status ?? null;
        const isDraft = r.theme_settings?.onboardingDraft === true;

        let pipelineStatus: "draft" | "checkout_pending" | "active";
        if (isDraft) {
          pipelineStatus = "draft";
        } else if (!billingStatus || billingStatus === "checkout_pending") {
          pipelineStatus = "checkout_pending";
        } else {
          pipelineStatus = "active";
        }

        return {
          id: r.id,
          name: r.name,
          domain: r.domain,
          plan: r.plan,
          created_at: r.created_at,
          ownerEmail: up?.email ?? null,
          billingStatus,
          pipelineStatus,
        };
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Pipeline de onboarding</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Acompanhe o funil de cadastro dos clientes.
        </p>
      </div>

      <PipelineBoard sites={sites} />
    </div>
  );
}
