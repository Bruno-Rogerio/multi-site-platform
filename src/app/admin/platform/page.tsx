import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Users,
  Shield,
  Clock,
  CreditCard,
  UserPlus,
  Kanban,
  Palette,
  ArrowUpRight,
} from "lucide-react";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { requireUserProfile } from "@/lib/auth/session";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type MetricCard = {
  label: string;
  value: number;
  hint: string;
  icon: typeof Globe;
  color: string;
};

const quickActions = [
  { label: "Convidar usuário", href: "#invite", icon: UserPlus },
  { label: "Ver pipeline", href: "/admin/platform/pipeline", icon: Kanban },
  { label: "Configurar branding", href: "/admin/platform/branding", icon: Palette },
];

export default async function PlatformAdminPage() {
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
      { label: "Sites ativos", value: sitesCountResult.count ?? 0, hint: "Tenants cadastrados", icon: Globe, color: "text-blue-400" },
      { label: "Clientes", value: clientsCountResult.count ?? 0, hint: "Usuários finais", icon: Users, color: "text-emerald-400" },
      { label: "Admins", value: adminsCountResult.count ?? 0, hint: "Equipe interna", icon: Shield, color: "text-purple-400" },
      { label: "Onboarding pendente", value: draftsCountResult.count ?? 0, hint: "Draft/checkout pendente", icon: Clock, color: "text-amber-400" },
      { label: "Assinaturas ativas", value: billingActiveResult.count ?? 0, hint: "billing_status=active", icon: CreditCard, color: "text-cyan-400" },
    ];

    recentSites = recentSitesResult.data ?? [];
    recentDrafts = recentDraftsResult.data ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Banner */}
      {platformBranding.dashboard_banner_url ? (
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#12182B]">
          <div className="relative h-36 w-full md:h-44">
            <Image
              src={platformBranding.dashboard_banner_url}
              alt="Banner da plataforma"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020]/85 via-[#0B1020]/40 to-transparent" />
            <div className="absolute inset-0 flex items-end p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">BuildSphere Ops</p>
                <p className="mt-1 text-sm text-[var(--platform-text)]/85">
                  Painel central da operação e crescimento da plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Painel da plataforma</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Bem-vindo, <strong className="text-[var(--platform-text)]/80">{profile.email}</strong>
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-xl border border-white/10 bg-[#12182B] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/60">
                  {metric.label}
                </p>
                <Icon size={16} className={metric.color} />
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--platform-text)]">{metric.value}</p>
              <p className="mt-1 text-xs text-[var(--platform-text)]/50">{metric.hint}</p>
            </article>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isAnchor = action.href.startsWith("#");
          const Component = isAnchor ? "a" : Link;
          return (
            <Component
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#12182B] px-4 py-2.5 text-sm font-medium text-[var(--platform-text)]/80 transition hover:border-[#22D3EE]/30 hover:bg-[#22D3EE]/5 hover:text-[var(--platform-text)]"
            >
              <Icon size={16} className="text-[#22D3EE]" />
              {action.label}
              <ArrowUpRight size={14} className="text-[var(--platform-text)]/30" />
            </Component>
          );
        })}
      </div>

      {/* Recent data */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Tenants recentes</h2>
            <Link
              href="/admin/platform/sites"
              className="text-xs text-[#22D3EE] hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {recentSites.length === 0 ? (
            <div className="py-8 text-center">
              <Globe size={32} className="mx-auto text-[var(--platform-text)]/20" />
              <p className="mt-2 text-xs text-[var(--platform-text)]/40">Nenhum site ainda</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentSites.map((site) => (
                <li key={site.id} className="rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2.5 text-xs">
                  <p className="font-semibold text-[var(--platform-text)]">{site.name}</p>
                  <p className="text-[var(--platform-text)]/60">{site.domain}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Onboarding recente</h2>
            <Link
              href="/admin/platform/pipeline"
              className="text-xs text-[#22D3EE] hover:underline"
            >
              Ver pipeline
            </Link>
          </div>
          {recentDrafts.length === 0 ? (
            <div className="py-8 text-center">
              <Clock size={32} className="mx-auto text-[var(--platform-text)]/20" />
              <p className="mt-2 text-xs text-[var(--platform-text)]/40">Nenhum onboarding pendente</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentDrafts.map((draft) => (
                <li key={draft.id} className="rounded-lg border border-white/10 bg-[#0B1020] px-3 py-2.5 text-xs">
                  <p className="font-semibold uppercase tracking-[0.1em] text-[#22D3EE]">{draft.status}</p>
                  <p className="text-[var(--platform-text)]/55 truncate">ID: {draft.id.slice(0, 12)}...</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Team management */}
      <section id="invite" className="mt-6 rounded-xl border border-white/10 bg-[#12182B] p-5">
        <h2 className="text-sm font-semibold text-[var(--platform-text)]">Convidar admin</h2>
        <p className="mt-1 text-xs text-[var(--platform-text)]/60">
          Crie acessos internos para a operação da plataforma.
        </p>
        <CreateUserForm sites={[]} mode="internal" />
      </section>
    </div>
  );
}
