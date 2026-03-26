import Link from "next/link";
import {
  DollarSign, Users, TrendingUp, Zap,
  ArrowUpRight, Globe, TicketCheck, Activity,
} from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatBRL } from "@/lib/onboarding/get-plan-prices";

/* ─── helpers ──────────────────────────────────────────── */

function pct(a: number, total: number) {
  if (!total) return 0;
  return Math.round((a / total) * 100);
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function relativeTime(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "agora mesmo";
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

/* ─── sub-components ───────────────────────────────────── */

function MetricCard({
  label, value, sub, icon: Icon, color, bg,
}: {
  label: string; value: string; sub: string;
  icon: typeof DollarSign; color: string; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
          {label}
        </p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
          <Icon size={15} className={color} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-[var(--platform-text)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--platform-text)]/40">{sub}</p>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────── */

export default async function PlatformAnalyticsPage() {
  await requireUserProfile(["admin"]);
  const adminDb = createSupabaseAdminClient();

  if (!adminDb) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <p className="text-sm text-[var(--platform-text)]/50">Serviço indisponível.</p>
      </div>
    );
  }

  const now = Date.now();
  const since30d = new Date(now - 30 * 86_400_000).toISOString();
  const since7d  = new Date(now -  7 * 86_400_000).toISOString();
  const brFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
  const thisMonthBR = brFmt.format(new Date(now)).slice(0, 7) + "-01"; // "YYYY-MM-01"
  const thisMonthStart = new Date(`${thisMonthBR}T00:00:00-03:00`);

  const [
    activeBillingsRes,
    newClientsRes,
    platformViews30dRes,
    premiumViews30dRes,
    allDraftsRes,
    checkoutDraftsRes,
    activeDraftsRes,
    drafts30dRes,
    checkouts30dRes,
    activations30dRes,
    allSitesRes,
    traffic30dRes,
    traffic7dRes,
    allClientsRes,
    openTicketsRes,
    billingByClientRes,
    recentEventsRes,
  ] = await Promise.all([
    // Revenue
    adminDb.from("billing_profiles").select("monthly_amount").eq("billing_status", "active"),
    adminDb.from("billing_profiles").select("id", { count: "exact", head: true })
      .eq("billing_status", "active").gte("created_at", thisMonthStart.toISOString()),

    // Funnel (last 30 days)
    adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", since30d),
    adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).eq("path", "/premium").gte("visited_at", since30d),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }).in("status", ["checkout_pending", "active", "archived"]),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }).eq("status", "active"),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }).gte("created_at", since30d),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }).gte("created_at", since30d).in("status", ["checkout_pending", "active", "archived"]),
    adminDb.from("onboarding_drafts").select("id", { count: "exact", head: true }).gte("created_at", since30d).eq("status", "active"),

    // Sites
    adminDb.from("sites").select("id, name, domain, plan, theme_settings, created_at").order("created_at", { ascending: false }),

    // Traffic
    adminDb.from("page_view_logs").select("site_id").gte("visited_at", since30d),
    adminDb.from("page_view_logs").select("site_id").gte("visited_at", since7d),

    // Client health
    adminDb.from("user_profiles").select("id, email, site_id, created_at").eq("role", "client").order("created_at", { ascending: false }),
    adminDb.from("support_tickets").select("site_id, status").in("status", ["open", "in_progress"]),
    adminDb.from("billing_profiles").select("site_id, billing_status, monthly_amount"),

    // Recent activity feed (last 7 days)
    Promise.all([
      adminDb.from("user_profiles").select("email, created_at").eq("role", "client").gte("created_at", since7d).order("created_at", { ascending: false }).limit(5),
      adminDb.from("sites").select("name, domain, created_at").gte("created_at", since7d).order("created_at", { ascending: false }).limit(5),
      adminDb.from("support_tickets").select("subject, created_at, sites(name)").gte("created_at", since7d).order("created_at", { ascending: false }).limit(5),
    ]),
  ]);

  /* ── Revenue ────────────────────────────────────────── */
  const billings      = (activeBillingsRes.data ?? []) as { monthly_amount: number | null }[];
  const mrr           = billings.reduce((s, b) => s + (b.monthly_amount ?? 0), 0);
  const activeClients = billings.length;
  const arpu          = activeClients > 0 ? mrr / activeClients : 0;
  const newThisMonth  = newClientsRes.count ?? 0;

  /* ── Plan distribution ──────────────────────────────── */
  const allSites = (allSitesRes.data ?? []) as {
    id: string; name: string; domain: string; plan: string;
    theme_settings: Record<string, unknown> | null; created_at: string;
  }[];

  const planMap = new Map<string, number>();
  for (const s of allSites) {
    const p = ((s.theme_settings ?? {}) as Record<string, unknown>).selectedPlan as string | undefined ?? s.plan;
    planMap.set(p, (planMap.get(p) ?? 0) + 1);
  }
  const planDist = [
    { label: "Starter",      key: "starter",       color: "#10B981" },
    { label: "Básico",       key: "basico",        color: "#3B82F6" },
    { label: "Premium Full", key: "premium-full",  color: "#7C5CFF" },
    { label: "Pro",          key: "pro",            color: "#22D3EE" },
    { label: "Landing",      key: "landing",        color: "#6B7280" },
  ]
    .map((d) => ({ ...d, count: planMap.get(d.key) ?? 0 }))
    .filter((d) => d.count > 0);
  const planTotal = planDist.reduce((s, d) => s + d.count, 0) || 1;

  const premiumViews30d = premiumViews30dRes.count ?? 0;

  /* ── Conversion funnel ──────────────────────────────── */
  const funnelSteps = [
    { label: "Visitaram o site",    count: platformViews30dRes.count ?? 0,   sub: "platform_page_views" },
    { label: "Iniciaram o wizard",  count: drafts30dRes.count        ?? 0,   sub: "onboarding_drafts" },
    { label: "Chegaram ao checkout",count: checkouts30dRes.count     ?? 0,   sub: "status ≥ checkout" },
    { label: "Viraram clientes",    count: activations30dRes.count   ?? 0,   sub: "status = active" },
  ];
  const funnelMax = funnelSteps[0].count || 1;

  /* ── All-time funnel (secondary) ───────────────────── */
  const allTimeFunnel = [
    { label: "Total de drafts",     count: allDraftsRes.count    ?? 0 },
    { label: "Chegaram ao checkout",count: checkoutDraftsRes.count ?? 0 },
    { label: "Ativos hoje",         count: activeDraftsRes.count  ?? 0 },
  ];

  /* ── Top sites by traffic ───────────────────────────── */
  const traffic30 = new Map<string, number>();
  const traffic7  = new Map<string, number>();
  for (const r of (traffic30dRes.data ?? []) as { site_id: string }[]) {
    traffic30.set(r.site_id, (traffic30.get(r.site_id) ?? 0) + 1);
  }
  for (const r of (traffic7dRes.data ?? []) as { site_id: string }[]) {
    traffic7.set(r.site_id, (traffic7.get(r.site_id) ?? 0) + 1);
  }
  const topSites = Array.from(traffic30.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([siteId, views30]) => {
      const s = allSites.find((x) => x.id === siteId);
      return { siteId, views30, views7: traffic7.get(siteId) ?? 0, name: s?.name ?? "—", domain: s?.domain ?? "" };
    });
  const topMax = topSites[0]?.views30 || 1;

  /* ── Client health ──────────────────────────────────── */
  const openTickets = new Map<string, number>();
  for (const t of (openTicketsRes.data ?? []) as { site_id: string; status: string }[]) {
    openTickets.set(t.site_id, (openTickets.get(t.site_id) ?? 0) + 1);
  }
  const billingBySite = new Map<string, { billing_status: string; monthly_amount: number | null }>();
  for (const b of (billingByClientRes.data ?? []) as { site_id: string; billing_status: string; monthly_amount: number | null }[]) {
    if (b.site_id) billingBySite.set(b.site_id, b);
  }

  const clientRows = ((allClientsRes.data ?? []) as { id: string; email: string; site_id: string | null; created_at: string }[])
    .map((c) => {
      const site = allSites.find((s) => s.id === c.site_id);
      const views = traffic30.get(c.site_id ?? "") ?? 0;
      const tickets = openTickets.get(c.site_id ?? "") ?? 0;
      const billing = billingBySite.get(c.site_id ?? "");
      const status = billing?.billing_status ?? "none";
      const health =
        status === "canceled" || status === "past_due" ? "red"
        : tickets >= 2 ? "yellow"
        : views === 0   ? "yellow"
        : "green";
      return { ...c, site, views, tickets, billing, health };
    })
    .slice(0, 30);

  /* ── Activity feed ──────────────────────────────────── */
  const [newUsersRes, newSitesRes, newTicketsRes] = recentEventsRes as [
    { data: { email: string; created_at: string }[] | null },
    { data: { name: string; domain: string; created_at: string }[] | null },
    { data: { subject: string; created_at: string; sites: { name: string } | null }[] | null },
  ];

  type FeedItem = { type: "user" | "site" | "ticket"; label: string; sub: string; time: string };
  const feed: FeedItem[] = [
    ...(newUsersRes.data  ?? []).map((r) => ({ type: "user"   as const, label: "Novo cliente",       sub: r.email,                                           time: r.created_at })),
    ...(newSitesRes.data  ?? []).map((r) => ({ type: "site"   as const, label: "Site criado",         sub: r.domain,                                          time: r.created_at })),
    ...(newTicketsRes.data ?? []).map((r) => ({ type: "ticket" as const, label: "Novo chamado",         sub: r.subject,                                         time: r.created_at })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 12);

  const HEALTH_COLORS: Record<string, string> = {
    green:  "bg-emerald-400",
    yellow: "bg-amber-400",
    red:    "bg-rose-500",
  };
  const BILLING_LABELS: Record<string, string> = {
    active:           "Ativo",
    past_due:         "Vencido",
    canceled:         "Cancelado",
    checkout_pending: "Aguardando",
    none:             "—",
  };
  const BILLING_COLORS: Record<string, string> = {
    active:           "text-emerald-400",
    past_due:         "text-amber-400",
    canceled:         "text-rose-400",
    checkout_pending: "text-[var(--platform-text)]/40",
    none:             "text-[var(--platform-text)]/30",
  };

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">Plataforma</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--platform-text)]">Analytics & Negócio</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/50">
          Visão estratégica da operação — receita, conversão, tráfego e saúde dos clientes.
        </p>
      </div>

      {/* ── Revenue cards ── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
          Receita
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="MRR"            value={formatBRL(mrr)}        sub="receita mensal recorrente" icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
          <MetricCard label="ARPU"           value={formatBRL(arpu)}       sub="receita por cliente"       icon={TrendingUp} color="text-blue-400"    bg="bg-blue-500/10"    />
          <MetricCard label="Clientes ativos" value={String(activeClients)} sub="assinaturas ativas"        icon={Users}      color="text-purple-400"  bg="bg-purple-500/10"  />
          <MetricCard label="Novos este mês"  value={String(newThisMonth)}  sub="ativações no mês atual"    icon={Zap}        color="text-amber-400"   bg="bg-amber-500/10"   />
        </div>
      </section>

      {/* ── Plan distribution + All-time funnel ── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Plan dist */}
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <h2 className="mb-4 text-sm font-semibold text-[var(--platform-text)]">Distribuição de planos</h2>
          {planDist.length === 0 ? (
            <p className="py-6 text-center text-xs text-[var(--platform-text)]/30">Nenhum site ainda.</p>
          ) : (
            <div className="space-y-3">
              {planDist.map((d) => (
                <div key={d.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--platform-text)]/80">{d.label}</span>
                    <span className="tabular-nums text-[var(--platform-text)]/50">{d.count} · {pct(d.count, planTotal)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct(d.count, planTotal)}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All-time funnel overview */}
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <h2 className="mb-1 text-sm font-semibold text-[var(--platform-text)]">Funil geral (acumulado)</h2>
          <p className="mb-4 text-[10px] text-[var(--platform-text)]/35">Todos os leads desde o início da plataforma.</p>
          <div className="space-y-4">
            {allTimeFunnel.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold text-[var(--platform-text)]/40">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[var(--platform-text)]/80">{step.label}</p>
                    <p className="text-xs font-bold tabular-nums text-[var(--platform-text)]">{fmtShort(step.count)}</p>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#3B82F6,#22D3EE)]"
                      style={{ width: `${pct(step.count, allTimeFunnel[0].count || 1)}%` }}
                    />
                  </div>
                </div>
                {i < allTimeFunnel.length - 1 && (
                  <div className="shrink-0 text-[10px] tabular-nums text-[var(--platform-text)]/30">
                    {pct(allTimeFunnel[i + 1].count, step.count || 1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Monthly conversion funnel ── */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Funil de conversão · últimos 30 dias</h2>
            <p className="text-[10px] text-[var(--platform-text)]/35">Do primeiro acesso ao site até a ativação.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Premium page visits highlight */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#7C5CFF]/20 bg-[#7C5CFF]/[0.06] px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
              <span className="text-[10px] font-semibold text-[#A78BFA]">{fmtShort(premiumViews30d)} visitas /premium</span>
            </div>
            <Activity size={15} className="text-[#22D3EE]" />
          </div>
        </div>
        <div className="space-y-3">
          {funnelSteps.map((step, i) => {
            const w = pct(step.count, funnelMax);
            const dropoff = i > 0 ? pct(step.count, funnelSteps[i - 1].count || 1) : 100;
            return (
              <div key={step.label} className="flex items-center gap-4">
                <div className="w-44 shrink-0">
                  <p className="text-xs font-medium text-[var(--platform-text)]/80 leading-tight">{step.label}</p>
                  <p className="text-[9px] text-[var(--platform-text)]/30">{step.sub}</p>
                </div>
                <div className="flex-1 overflow-hidden rounded-full bg-white/[0.04]" style={{ height: 10 }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${w}%`,
                      background: `linear-gradient(90deg, #3B82F6 ${100 - w}%, #22D3EE)`,
                    }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right">
                  <p className="text-sm font-bold tabular-nums text-[var(--platform-text)]">{fmtShort(step.count)}</p>
                  {i > 0 && (
                    <p className={`text-[9px] tabular-nums ${dropoff < 20 ? "text-rose-400" : dropoff < 50 ? "text-amber-400" : "text-emerald-400"}`}>
                      {dropoff}% conv.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Top sites + Activity feed ── */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* Top sites */}
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Top sites por tráfego · 30 dias</h2>
            <Globe size={14} className="text-[var(--platform-text)]/30" />
          </div>
          {topSites.length === 0 ? (
            <p className="py-8 text-center text-xs text-[var(--platform-text)]/30">Nenhuma visita registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {topSites.map((s, i) => (
                <div key={s.siteId} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-[var(--platform-text)]/25">
                    {i + 1}
                  </span>
                  <div className="w-32 shrink-0">
                    <p className="truncate text-xs font-semibold text-[var(--platform-text)]">{s.name}</p>
                    <p className="truncate text-[9px] text-[#22D3EE]/60">{s.domain}</p>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/[0.04]" style={{ height: 6 }}>
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#3B82F6,#22D3EE)]"
                      style={{ width: `${pct(s.views30, topMax)}%` }}
                    />
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <p className="text-xs font-bold tabular-nums text-[var(--platform-text)]">{s.views30}</p>
                    <p className="text-[9px] tabular-nums text-[var(--platform-text)]/30">{s.views7} / 7d</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity feed */}
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <h2 className="mb-4 text-sm font-semibold text-[var(--platform-text)]">Atividade recente</h2>
          {feed.length === 0 ? (
            <p className="py-8 text-center text-xs text-[var(--platform-text)]/30">Nenhuma atividade nos últimos 7 dias.</p>
          ) : (
            <div className="space-y-1">
              {feed.map((item, i) => {
                const dot =
                  item.type === "user"   ? "bg-emerald-400" :
                  item.type === "site"   ? "bg-blue-400"    :
                  "bg-amber-400";
                return (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-white/[0.02]">
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--platform-text)]/80">{item.label}</p>
                      <p className="truncate text-[10px] text-[var(--platform-text)]/40">{item.sub}</p>
                    </div>
                    <p className="ml-auto shrink-0 text-[9px] tabular-nums text-[var(--platform-text)]/25">
                      {relativeTime(item.time)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Client health table ── */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Saúde dos clientes</h2>
            <p className="text-[10px] text-[var(--platform-text)]/35">
              Verde = saudável · Amarelo = atenção · Vermelho = risco
            </p>
          </div>
          <TicketCheck size={14} className="text-[var(--platform-text)]/30" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["", "Cliente", "Site", "Tráfego 30d", "Chamados", "Billing", "Desde"].map((h) => (
                  <th key={h} className="pb-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/30 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientRows.map((c, i) => (
                <tr key={c.id} className={`border-b border-white/[0.04] transition hover:bg-white/[0.02] ${i % 2 === 0 ? "" : ""}`}>
                  <td className="py-2.5 pr-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${HEALTH_COLORS[c.health]}`} />
                  </td>
                  <td className="py-2.5 pr-4">
                    <p className="truncate max-w-[140px] font-medium text-[var(--platform-text)]/80">{c.email}</p>
                  </td>
                  <td className="py-2.5 pr-4">
                    {c.site ? (
                      <Link
                        href={`https://${c.site.domain}`}
                        target="_blank"
                        className="flex items-center gap-1 text-[#22D3EE]/70 hover:text-[#22D3EE] transition"
                      >
                        <span className="truncate max-w-[120px]">{c.site.name}</span>
                        <ArrowUpRight size={10} className="shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-[var(--platform-text)]/25">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums">
                    <span className={c.views > 0 ? "text-[var(--platform-text)]/80" : "text-[var(--platform-text)]/25"}>
                      {c.views > 0 ? fmtShort(c.views) : "0"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums">
                    <span className={c.tickets > 0 ? "text-amber-400" : "text-[var(--platform-text)]/25"}>
                      {c.tickets > 0 ? c.tickets : "—"}
                    </span>
                  </td>
                  <td className={`py-2.5 pr-4 font-medium ${BILLING_COLORS[c.billing?.billing_status ?? "none"]}`}>
                    {BILLING_LABELS[c.billing?.billing_status ?? "none"]}
                  </td>
                  <td className="py-2.5 text-[var(--platform-text)]/30">
                    {new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                </tr>
              ))}
              {clientRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[var(--platform-text)]/30">
                    Nenhum cliente ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
