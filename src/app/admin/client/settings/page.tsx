import { SettingsTabs } from "@/components/admin/settings-tabs";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { getPlanPrices } from "@/lib/onboarding/get-plan-prices";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  theme_settings: Record<string, unknown> | null;
};

type BillingRow = {
  legal_name: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
};

type Props = {
  searchParams: Promise<{ tab?: string; success?: string }>;
};

const VALID_TABS = ["conta", "dominio", "plano"] as const;
type TabType = (typeof VALID_TABS)[number];

function resolveTab(tab?: string): TabType {
  if (VALID_TABS.includes(tab as TabType)) return tab as TabType;
  return "conta";
}

export default async function ClientSettingsPage({ searchParams }: Props) {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();
  const params = await searchParams;

  let site: SiteRow | null = null;
  let billing: BillingRow | null = null;
  const planPrices = await getPlanPrices();
  if (supabase && profile.site_id) {
    const [siteResult, billingResult] = await Promise.all([
      supabase
        .from("sites")
        .select("id,name,domain,plan,theme_settings")
        .eq("id", profile.site_id)
        .maybeSingle<SiteRow>(),
      supabase
        .from("billing_profiles")
        .select("legal_name,address,postal_code,city,state")
        .eq("site_id", profile.site_id)
        .maybeSingle<BillingRow>(),
    ]);
    site = siteResult.data;
    billing = billingResult.data;
  }

  // Usar sites.plan como fonte da verdade
  const selectedPlan = site?.plan === "pro" ? "premium-full" : site?.plan === "starter" ? "starter" : "basico";
  const initialTab = resolveTab(params.tab);
  const domainSuccess = params.success === "1" && params.tab === "dominio";

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie sua conta, senha, domínio e plano.
        </p>
      </div>

      {site ? (
        <SettingsTabs
          email={profile.email}
          siteName={site.name}
          siteDomain={site.domain}
          siteId={site.id}
          selectedPlan={selectedPlan}
          themeSettings={site.theme_settings ?? {}}
          initialTab={initialTab}
          domainSuccess={domainSuccess}
          billingProfile={billing ?? undefined}
          starterPrice={planPrices.starter}
          basicoPrice={planPrices.basico}
          premiumPrice={planPrices.premium}
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#12182B] p-8 text-center">
          <p className="text-sm text-[var(--platform-text)]/50">
            Nenhum site vinculado a esta conta.
          </p>
        </div>
      )}
    </div>
  );
}
