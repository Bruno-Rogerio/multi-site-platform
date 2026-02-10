import { Globe, Sparkles, Mail } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type SiteInfo = {
  id: string;
  name: string;
  domain: string;
  plan: string;
};

export default async function ClientSettingsPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let site: SiteInfo | null = null;
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan")
      .eq("id", profile.site_id)
      .maybeSingle<SiteInfo>();
    site = data;
  }

  const planLabel = site?.plan === "pro" ? "Premium Full" : "Essencial";
  const planPrice = site?.plan === "pro" ? "R$ 109,80/mês" : "R$ 59,90/mês";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Informações da sua conta e do seu site.
        </p>
      </div>

      <div className="space-y-4">
        {/* Account info */}
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <h2 className="text-sm font-semibold text-[var(--platform-text)] mb-4">Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[var(--platform-text)]/40" />
              <div>
                <p className="text-xs text-[var(--platform-text)]/50">Email</p>
                <p className="text-sm text-[var(--platform-text)]">{profile.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Site info */}
        {site && (
          <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
            <h2 className="text-sm font-semibold text-[var(--platform-text)] mb-4">Site</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-[var(--platform-text)]/40" />
                <div>
                  <p className="text-xs text-[var(--platform-text)]/50">Domínio</p>
                  <p className="text-sm font-mono text-[#22D3EE]">{site.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-[var(--platform-text)]/40" />
                <div>
                  <p className="text-xs text-[var(--platform-text)]/50">Plano</p>
                  <p className="text-sm text-[var(--platform-text)]">
                    {planLabel} — <span className="text-[var(--platform-text)]/60">{planPrice}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Support */}
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <h2 className="text-sm font-semibold text-[var(--platform-text)] mb-2">Suporte</h2>
          <p className="text-xs text-[var(--platform-text)]/50">
            Precisa de ajuda? Entre em contato com nossa equipe.
          </p>
          <a
            href="mailto:suporte@buildsphere.com.br"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-[var(--platform-text)]/70 transition hover:border-[#22D3EE]/30 hover:text-[var(--platform-text)]"
          >
            <Mail size={14} className="text-[#22D3EE]" />
            suporte@buildsphere.com.br
          </a>
        </section>
      </div>
    </div>
  );
}
