import { redirect } from "next/navigation";
import Image from "next/image";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { PlatformBrandingEditor } from "@/components/admin/platform-branding-editor";
import { Brand } from "@/components/platform/brand";
import { requireUserProfile } from "@/lib/auth/session";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

type MetricCard = {
  label: string;
  value: number;
  hint: string;
};

const modules = [
  {
    title: "Gestao de equipe interna",
    description: "Criar admins, delegar acessos e evoluir para perfis de permissao.",
  },
  {
    title: "Branding da plataforma",
    description: "Logo, imagens institucionais e identidade visual do SaaS.",
  },
  {
    title: "Billing & MRR",
    description: "Acompanhar funil de checkout e assinaturas ativas da operacao.",
  },
  {
    title: "Operacao multi-tenant",
    description: "Visibilidade de tenants, status e saude geral da plataforma.",
  },
];

export default async function PlatformAdminPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();
  const platformBranding = await getPlatformBrandingSettings();

  let metrics: MetricCard[] = [];
  let recentSites: Array<{ id: string; name: string; domain: string }> = [];
  let recentDrafts: Array<{ id: string; status: string }> = [];

  if (supabase) {
    const [
      sitesCountResult,
      clientsCountResult,
      adminsCountResult,
      draftsCountResult,
      billingActiveResult,
      recentSitesResult,
      recentDraftsResult,
    ] = await Promise.all([
      supabase.from("sites").select("id", { count: "exact", head: true }),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "admin"),
      supabase
        .from("onboarding_drafts")
        .select("id", { count: "exact", head: true })
        .in("status", ["draft", "checkout_pending"]),
      supabase
        .from("billing_profiles")
        .select("id", { count: "exact", head: true })
        .eq("billing_status", "active"),
      supabase.from("sites").select("id,name,domain").order("created_at", { ascending: false }).limit(5),
      supabase.from("onboarding_drafts").select("id,status").order("created_at", { ascending: false }).limit(5),
    ]);

    metrics = [
      { label: "Sites ativos", value: sitesCountResult.count ?? 0, hint: "Tenants cadastrados" },
      { label: "Clientes", value: clientsCountResult.count ?? 0, hint: "Usuarios finais" },
      { label: "Admins", value: adminsCountResult.count ?? 0, hint: "Equipe interna" },
      { label: "Onboarding pendente", value: draftsCountResult.count ?? 0, hint: "Draft/checkout pendente" },
      { label: "Assinaturas ativas", value: billingActiveResult.count ?? 0, hint: "billing_status=active" },
    ];

    recentSites = recentSitesResult.data ?? [];
    recentDrafts = recentDraftsResult.data ?? [];
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <Brand compact settings={platformBranding} />
      {platformBranding.dashboard_banner_url ? (
        <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#12182B]">
          <div className="relative h-40 w-full md:h-52">
            <Image
              src={platformBranding.dashboard_banner_url}
              alt="Banner da plataforma"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020]/85 via-[#0B1020]/40 to-transparent" />
            <div className="absolute inset-0 flex items-end p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">BuildSphere Ops</p>
                <p className="mt-1 text-sm text-[var(--platform-text)]/85 md:text-base">
                  Painel central da operacao e crescimento da plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">/admin/platform</p>
      <h1 className="mt-3 text-3xl font-bold text-[var(--platform-text)]">Painel da plataforma</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--platform-text)]/75">
        Bem-vindo, <strong>{profile.email}</strong>. Aqui voce administra equipe, branding e operacao do SaaS.
      </p>

      <form className="mt-4" action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.08]"
        >
          Sair
        </button>
      </form>

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <h2 className="text-lg font-semibold text-[var(--platform-text)]">Dashboard executivo</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/60">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-[var(--platform-text)]">{metric.value}</p>
              <p className="mt-2 text-xs text-[var(--platform-text)]/60">{metric.hint}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">Tenants recentes</h3>
            <ul className="mt-3 space-y-2">
              {recentSites.map((site) => (
                <li key={site.id} className="rounded-lg border border-white/10 bg-[#12182B] px-3 py-2 text-xs">
                  <p className="font-semibold text-[var(--platform-text)]">{site.name}</p>
                  <p className="text-[var(--platform-text)]/70">{site.domain}</p>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">Onboarding recente</h3>
            <ul className="mt-3 space-y-2">
              {recentDrafts.map((draft) => (
                <li key={draft.id} className="rounded-lg border border-white/10 bg-[#12182B] px-3 py-2 text-xs">
                  <p className="font-semibold uppercase tracking-[0.1em] text-[#22D3EE]">{draft.status}</p>
                  <p className="text-[var(--platform-text)]/65">Draft: {draft.id}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <h2 className="text-lg font-semibold text-[var(--platform-text)]">Admins da equipe</h2>
        <p className="mt-2 text-sm text-[var(--platform-text)]/75">
          Crie acessos internos para operacao da plataforma (nao relacionado aos tenants de clientes).
        </p>
        <CreateUserForm sites={[]} mode="internal" />
      </section>

      <PlatformBrandingEditor />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
            <h2 className="text-lg font-semibold text-[var(--platform-text)]">{module.title}</h2>
            <p className="mt-2 text-sm text-[var(--platform-text)]/75">{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
