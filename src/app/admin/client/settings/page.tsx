import { ClientSettingsForm } from "@/components/admin/client-settings-form";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  theme_settings: Record<string, unknown> | null;
};

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  basico: { name: "Básico", price: "R$ 59,90/mês" },
  construir: { name: "Construir", price: "R$ 79,90/mês" },
  "premium-full": { name: "Premium Full", price: "R$ 109,80/mês" },
};

export default async function ClientSettingsPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let site: SiteRow | null = null;
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan,theme_settings")
      .eq("id", profile.site_id)
      .maybeSingle<SiteRow>();
    site = data;
  }

  const selectedPlan = (site?.theme_settings?.selectedPlan as string) ?? "basico";
  const planInfo = PLAN_LABELS[selectedPlan] ?? PLAN_LABELS.basico;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie sua conta, senha e informações do site.
        </p>
      </div>

      {/* Plan info banner */}
      {site && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#12182B] px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
              Plano atual
            </p>
            <p className="text-sm font-semibold text-[var(--platform-text)]">
              {planInfo.name}{" "}
              <span className="font-normal text-[var(--platform-text)]/50">
                — {planInfo.price}
              </span>
            </p>
          </div>
          <a
            href="mailto:suporte@bsph.com.br?subject=Upgrade de plano"
            className="text-xs font-semibold text-[#22D3EE] hover:underline"
          >
            Fazer upgrade →
          </a>
        </div>
      )}

      {site ? (
        <ClientSettingsForm
          email={profile.email}
          siteName={site.name}
          siteDomain={site.domain}
          siteId={site.id}
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
