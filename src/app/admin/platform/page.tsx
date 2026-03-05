import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Users,
  Shield,
  Clock,
  CreditCard,
  MessageSquare,
  Kanban,
  Palette,
  Settings,
  ArrowUpRight,
  TicketCheck,
} from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

const PLAN_LABELS: Record<string, string> = {
  basico:       "Básico",
  construir:    "Construir",
  "premium-full": "Premium",
  landing:      "Landing",
  pro:          "Pro",
};

const STATUS_LABELS: Record<string, string> = {
  open:           "Aberto",
  in_progress:    "Em andamento",
  waiting_client: "Aguardando",
  resolved:       "Resolvido",
};

function formatRelative(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "agora mesmo";
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

export default async function PlatformAdminPage() {
  const profile = await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();
  const platformBranding = await getPlatformBrandingSettings();

  type MetricItem = { label: string; value: number; hint: string; icon: typeof Globe; color: string; bg: string; href: string };
  let metrics: MetricItem[] = [];
  let recentSites:   Array<{ id: string; name: string; domain: string; theme_settings: Record<string, unknown> | null; created_at: string }> = [];
  let recentTickets: Array<{ id: string; subject: string; status: string; created_at: string; sites: { name: string } | null }> = [];

  if (supabase) {
    const [
      sitesCount,
      clientsCount,
      adminsCount,
      draftsCount,
      billingCount,
      ticketsCount,
      recentSitesResult,
      recentTicketsResult,
    ] = await Promise.all([
      supabase.from("sites").select("id", { count: "exact", head: true }),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("onboarding_drafts").select("id", { count: "exact", head: true }).in("status", ["draft", "checkout_pending"]),
      supabase.from("billing_profiles").select("id", { count: "exact", head: true }).eq("billing_status", "active"),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
      supabase.from("sites").select("id,name,domain,theme_settings,created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("support_tickets").select("id,subject,status,created_at,sites(name)").in("status", ["open", "in_progress"]).order("created_at", { ascending: false }).limit(5),
    ]);

    metrics = [
      { label: "Sites ativos",         value: sitesCount.count    ?? 0, hint: "Total de tenants",          icon: Globe,         color: "text-blue-400",    bg: "bg-blue-500/10",    href: "/admin/platform/sites" },
      { label: "Clientes",             value: clientsCount.count  ?? 0, hint: "Usuários finais",           icon: Users,         color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/platform/users" },
      { label: "Admins",               value: adminsCount.count   ?? 0, hint: "Equipe interna",            icon: Shield,        color: "text-purple-400",  bg: "bg-purple-500/10",  href: "/admin/platform/users" },
      { label: "Onboarding pendente",  value: draftsCount.count   ?? 0, hint: "Draft / checkout",          icon: Clock,         color: "text-amber-400",   bg: "bg-amber-500/10",   href: "/admin/platform/pipeline" },
      { label: "Assinaturas ativas",   value: billingCount.count  ?? 0, hint: "billing_status = active",   icon: CreditCard,    color: "text-cyan-400",    bg: "bg-cyan-500/10",    href: "/admin/platform/sites" },
      { label: "Chamados abertos",     value: ticketsCount.count  ?? 0, hint: "Aberto + Em andamento",     icon: TicketCheck,   color: "text-rose-400",    bg: "bg-rose-500/10",    href: "/admin/platform/messages" },
    ];

    recentSites   = (recentSitesResult.data   ?? []) as typeof recentSites;
    recentTickets = (recentTicketsResult.data  ?? []) as unknown as typeof recentTickets;
  }

  const quickActions = [
    { label: "Usuários",    href: "/admin/platform/users",    icon: Users },
    { label: "Pipeline",    href: "/admin/platform/pipeline", icon: Kanban },
    { label: "Branding",    href: "/admin/platform/branding", icon: Palette },
    { label: "Mensagens",   href: "/admin/platform/messages", icon: MessageSquare },
    { label: "Configurações", href: "/admin/platform/settings", icon: Settings },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Banner */}
      {platformBranding.dashboard_banner_url && (
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
                <p className="mt-1 text-sm text-[var(--platform-text)]/85">Painel central da operação e crescimento da plataforma.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Painel da plataforma</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Bem-vindo, <strong className="text-[var(--platform-text)]/80">{profile.email}</strong>
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className="group rounded-xl border border-white/10 bg-[#12182B] p-4 transition hover:border-white/20 hover:bg-[#12182B]/80"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/50 leading-tight">
                  {m.label}
                </p>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.bg}`}>
                  <Icon size={14} className={m.color} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-[var(--platform-text)]">{m.value}</p>
              <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">{m.hint}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#12182B] px-4 py-2 text-sm font-medium text-[var(--platform-text)]/70 transition hover:border-[#22D3EE]/30 hover:bg-[#22D3EE]/5 hover:text-[var(--platform-text)]"
            >
              <Icon size={15} className="text-[#22D3EE]" />
              {a.label}
              <ArrowUpRight size={13} className="text-[var(--platform-text)]/30" />
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Recent sites */}
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Tenants recentes</h2>
            <Link href="/admin/platform/sites" className="text-xs text-[#22D3EE] hover:underline">
              Ver todos →
            </Link>
          </div>
          {recentSites.length === 0 ? (
            <div className="py-8 text-center">
              <Globe size={28} className="mx-auto text-[var(--platform-text)]/20" />
              <p className="mt-2 text-xs text-[var(--platform-text)]/40">Nenhum site ainda</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentSites.map((site) => {
                const selectedPlan = (site.theme_settings as Record<string, unknown> | null)?.selectedPlan as string | undefined;
                const planLabel = PLAN_LABELS[selectedPlan ?? ""] ?? PLAN_LABELS[site.id] ?? "—";
                return (
                  <li key={site.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0B1020] px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--platform-text)]">{site.name}</p>
                      <p className="truncate text-[10px] text-[#22D3EE]/70">{site.domain}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-medium text-[var(--platform-text)]/50">
                        {planLabel}
                      </span>
                      <span className="text-[9px] text-[var(--platform-text)]/30">{formatRelative(site.created_at)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recent tickets */}
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Chamados abertos</h2>
            <Link href="/admin/platform/messages" className="text-xs text-[#22D3EE] hover:underline">
              Ver todos →
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="py-8 text-center">
              <TicketCheck size={28} className="mx-auto text-[var(--platform-text)]/20" />
              <p className="mt-2 text-xs text-[var(--platform-text)]/40">Nenhum chamado aberto</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentTickets.map((ticket) => (
                <li key={ticket.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0B1020] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[var(--platform-text)]">{ticket.subject}</p>
                    <p className="text-[10px] text-[var(--platform-text)]/50">{ticket.sites?.name ?? "—"}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                      ticket.status === "open" ? "bg-blue-500/10 text-blue-400" :
                      ticket.status === "in_progress" ? "bg-violet-500/10 text-violet-400" :
                      "bg-white/[0.06] text-white/40"
                    }`}>
                      {STATUS_LABELS[ticket.status] ?? ticket.status}
                    </span>
                    <span className="text-[9px] text-[var(--platform-text)]/30">{formatRelative(ticket.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
