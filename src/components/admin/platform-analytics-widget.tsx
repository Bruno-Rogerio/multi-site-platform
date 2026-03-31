import { TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AnalyticsPeriodSelector } from "./analytics-period-selector";

/* ─── helpers ──────────────────────────────────────────────────── */

function pct(a: number, b: number) {
  if (b === 0) return a > 0 ? 100 : 0;
  return Math.round(((a - b) / b) * 100);
}

function fmtShort(n: number) {
  if (n >= 10_000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1_000)  return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type DaySlot = { date: string; label: string; count: number; isToday: boolean };
type PageRow  = { path: string; views: number; pct: number };

/* ─── stat card ────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  change,
  sub,
}: {
  label: string;
  value: number;
  change?: number;
  sub?: string;
}) {
  const up   = change !== undefined && change > 0;
  const down = change !== undefined && change < 0;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1020] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--platform-text)]">
        {fmtShort(value)}
      </p>
      {change !== undefined ? (
        <div
          className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${
            up ? "text-emerald-400" : down ? "text-rose-400" : "text-[var(--platform-text)]/30"
          }`}
        >
          {up   && <TrendingUp  size={11} />}
          {down && <TrendingDown size={11} />}
          {!up && !down && <Minus size={11} />}
          {up ? "+" : ""}{change}% vs período anterior
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-[var(--platform-text)]/30">{sub ?? "acumulado"}</p>
      )}
    </div>
  );
}

/* ─── bar chart (SVG, server-rendered) ─────────────────────────── */

function BarChart({ days, period }: { days: DaySlot[]; period: number }) {
  const max     = Math.max(...days.map((d) => d.count), 1);
  const maxIdx  = days.reduce((mi, d, i) => d.count > days[mi].count ? i : mi, 0);

  // Layout constants
  const W  = 560;
  const H  = 170;
  const CL = 34;  // left margin for y-axis labels
  const CT = 14;  // top padding for value labels
  const CB = 20;  // bottom padding for x-axis labels
  const CR = 4;   // right margin
  const CW = W - CL - CR;   // 522
  const CH = H - CT - CB;   // 136

  const baseline = CT + CH;  // y of x-axis baseline = 150
  const slot     = CW / days.length;
  const barW     = Math.max(2, Math.min(slot - 4, slot * 0.7));

  // X-axis label skip — always show first, last, today
  const skipN = period <= 7 ? 1 : period <= 14 ? 2 : period <= 30 ? 5 : 15;

  // Value label visibility
  const showValueFor = (i: number, isToday: boolean, count: number) => {
    if (count === 0) return false;
    if (isToday) return true;
    if (period <= 14) return true;
    if (period <= 30) return i === maxIdx;
    return false;
  };

  // Y-axis reference values and positions
  const yRefs = [
    { val: max,           y: CT },
    { val: Math.round(max / 2), y: CT + CH / 2 },
    { val: 0,             y: baseline },
  ];

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 170 }}
        aria-label="Visitas diárias"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yRefs.map(({ y }, gi) => (
          <line
            key={gi}
            x1={CL} y1={y}
            x2={W - CR} y2={y}
            stroke="rgba(234,240,255,0.07)"
            strokeWidth={gi === 2 ? 1 : 0.5}
            strokeDasharray={gi === 2 ? undefined : "3 4"}
          />
        ))}

        {/* Y-axis labels */}
        {yRefs.map(({ val, y }, gi) => (
          <text
            key={gi}
            x={CL - 3}
            y={y + (gi === 2 ? -2 : 3.5)}
            textAnchor="end"
            fontSize={7}
            fontFamily="inherit"
            fill="rgba(234,240,255,0.22)"
          >
            {fmtShort(val)}
          </text>
        ))}

        {/* Bars + value labels */}
        {days.map((day, i) => {
          const barH   = Math.max(2, (day.count / max) * CH);
          const bx     = CL + i * slot + (slot - barW) / 2;
          const by     = baseline - barH;
          const cx     = CL + i * slot + slot / 2;
          const showVal = showValueFor(i, day.isToday, day.count);
          return (
            <g key={day.date}>
              <rect
                x={bx} y={by}
                width={barW} height={barH}
                rx={period <= 30 ? 2 : 1}
                fill={day.isToday ? "#22D3EE" : "url(#barGrad)"}
                opacity={day.isToday ? 1 : 0.72}
              />
              {showVal && (
                <text
                  x={cx}
                  y={by - 3}
                  textAnchor="middle"
                  fontSize={7}
                  fontFamily="inherit"
                  fill={day.isToday ? "#22D3EE" : "rgba(234,240,255,0.5)"}
                  fontWeight={day.isToday ? "700" : "400"}
                >
                  {day.count}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {days.map((day, i) => {
          const show = (i % skipN === 0) || i === days.length - 1 || day.isToday;
          if (!show) return null;
          const cx = CL + i * slot + slot / 2;
          return (
            <text
              key={`xl-${day.date}`}
              x={cx}
              y={baseline + 13}
              textAnchor="middle"
              fontSize={7.5}
              fontFamily="inherit"
              fill={day.isToday ? "#22D3EE" : "rgba(234,240,255,0.28)"}
              fontWeight={day.isToday ? "700" : "400"}
            >
              {day.isToday ? "hoje" : day.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── top pages ─────────────────────────────────────────────────── */

function TopPages({ pages, period }: { pages: PageRow[]; period: number }) {
  if (pages.length === 0) return null;
  const maxViews = pages[0].views;
  const periodLabel = period <= 7 ? "7 dias" : period <= 14 ? "14 dias" : period <= 30 ? "30 dias" : "90 dias";

  return (
    <div className="mt-5 border-t border-white/[0.06] pt-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
        Top páginas · {periodLabel}
      </p>
      <div className="space-y-2.5">
        {pages.map((p, i) => (
          <div key={p.path} className="flex items-center gap-3">
            <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-[var(--platform-text)]/25">
              {i + 1}
            </span>
            <span className="w-36 shrink-0 truncate text-xs font-medium text-[var(--platform-text)]/70">
              {p.path}
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-white/[0.04]" style={{ height: 5 }}>
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#3B82F6,#22D3EE)]"
                style={{ width: `${Math.round((p.views / maxViews) * 100)}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs tabular-nums text-[var(--platform-text)]/50">
              {p.views}
            </span>
            <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-[var(--platform-text)]/30">
              {p.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main widget ──────────────────────────────────────────────── */

export async function PlatformAnalyticsWidget({ period = 14 }: { period?: number }) {
  const adminDb = createSupabaseAdminClient();

  let viewsToday   = 0;
  let viewsYest    = 0;
  let views7d      = 0;
  let views7dPrev  = 0;
  let views30d     = 0;
  let views30dPrev = 0;
  let viewsTotal   = 0;
  let viewsPeriod     = 0;
  let viewsPeriodPrev = 0;
  let days: DaySlot[]  = [];
  let topPages: PageRow[] = [];

  if (adminDb) {
    const now = Date.now();

    // Calendar-day boundaries in Brazil timezone (America/Sao_Paulo = UTC-3, sem DST desde 2019)
    const TZ_OFFSET = "-03:00";
    const brFmt       = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
    const todayBR     = brFmt.format(new Date());
    const yesterdayBR = brFmt.format(new Date(now - 86_400_000));

    const tToday      = new Date(`${todayBR}T00:00:00${TZ_OFFSET}`).toISOString();
    const tYest       = new Date(`${yesterdayBR}T00:00:00${TZ_OFFSET}`).toISOString();
    const t7d         = new Date(now -   7 * 86_400_000).toISOString();
    const t14d        = new Date(now -  14 * 86_400_000).toISOString();
    const t30d        = new Date(now -  30 * 86_400_000).toISOString();
    const t60d        = new Date(now -  60 * 86_400_000).toISOString();
    const tPeriod     = new Date(now -  period * 86_400_000).toISOString();
    const tPeriodPrev = new Date(now -  period * 2 * 86_400_000).toISOString();
    // top pages uses the selected period (min 30d for meaningful data)
    const tTopPages   = new Date(now - Math.max(period, 30) * 86_400_000).toISOString();

    const [
      res1d, resYest,
      res7d, res7dPrev,
      res30d, res30dPrev,
      resTotal,
      resPeriodCount, resPeriodPrevCount,
      resPeriodRaw,
      resTopPaths,
    ] = await Promise.all([
      // today
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tToday),
      // yesterday
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tYest).lt("visited_at", tToday),
      // 7d
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t7d),
      // prev 7d (14d → 7d)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t14d).lt("visited_at", t7d),
      // 30d
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t30d),
      // prev 30d (60d → 30d)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t60d).lt("visited_at", t30d),
      // total
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }),
      // selected period count (for chart comparison)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tPeriod),
      // previous period count
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tPeriodPrev).lt("visited_at", tPeriod),
      // raw rows for chart (selected period)
      adminDb.from("platform_page_views").select("visited_at").gte("visited_at", tPeriod),
      // raw rows for top pages
      adminDb.from("platform_page_views").select("path").gte("visited_at", tTopPages),
    ]);

    viewsToday      = res1d.count          ?? 0;
    viewsYest       = resYest.count        ?? 0;
    views7d         = res7d.count          ?? 0;
    views7dPrev     = res7dPrev.count      ?? 0;
    views30d        = res30d.count         ?? 0;
    views30dPrev    = res30dPrev.count     ?? 0;
    viewsTotal      = resTotal.count       ?? 0;
    viewsPeriod     = resPeriodCount.count ?? 0;
    viewsPeriodPrev = resPeriodPrevCount.count ?? 0;

    // Build daily slots for chart (Brazil timezone)
    const brDateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
    const dayCounts = new Map<string, number>();
    for (const row of (resPeriodRaw.data ?? []) as { visited_at: string }[]) {
      const d = brDateFmt.format(new Date(row.visited_at));
      dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
    }
    days = Array.from({ length: period }, (_, i) => {
      const dt  = new Date(now - (period - 1 - i) * 86_400_000);
      const key = brDateFmt.format(dt);
      return {
        date:    key,
        label:   dt.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" }),
        count:   dayCounts.get(key) ?? 0,
        isToday: key === todayBR,
      };
    });

    // Build top pages
    const pathMap = new Map<string, number>();
    for (const row of (resTopPaths.data ?? []) as { path: string }[]) {
      pathMap.set(row.path, (pathMap.get(row.path) ?? 0) + 1);
    }
    const topTotal = (resTopPaths.data?.length ?? 0) || 1;
    topPages = Array.from(pathMap.entries())
      .map(([path, views]) => ({ path, views, pct: Math.round((views / topTotal) * 100) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }

  const noData       = viewsTotal === 0;
  const periodChange = pct(viewsPeriod, viewsPeriodPrev);
  const pUp          = periodChange > 0;
  const pDown        = periodChange < 0;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#12182B] p-5">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#22D3EE]/10">
            <Eye size={14} className="text-[#22D3EE]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Visitas ao site</h2>
            <p className="text-[10px] text-[var(--platform-text)]/35">Tráfego nas páginas públicas da plataforma</p>
          </div>
        </div>
        <AnalyticsPeriodSelector current={period} />
      </div>

      {noData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp size={28} className="text-[var(--platform-text)]/15" />
          <p className="mt-3 text-xs text-[var(--platform-text)]/30">Nenhuma visita registrada ainda.</p>
          <p className="mt-1 text-[10px] text-[var(--platform-text)]/20">
            Certifique-se de que a migration foi aplicada no Supabase.
          </p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Hoje"    value={viewsToday} change={pct(viewsToday, viewsYest)} />
            <StatCard label="7 dias"  value={views7d}    change={pct(views7d, views7dPrev)} />
            <StatCard label="30 dias" value={views30d}   change={pct(views30d, views30dPrev)} />
            <StatCard label="Total"   value={viewsTotal} sub="desde o início" />
          </div>

          {/* Bar chart with period comparison */}
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
                Últimos {period} dias
              </p>
              <div className={`flex items-center gap-1 text-[11px] font-medium ${
                pUp ? "text-emerald-400" : pDown ? "text-rose-400" : "text-[var(--platform-text)]/30"
              }`}>
                {pUp   && <TrendingUp  size={11} />}
                {pDown && <TrendingDown size={11} />}
                {!pUp && !pDown && <Minus size={11} />}
                {pUp ? "+" : ""}{periodChange}% vs período anterior
              </div>
            </div>
            <BarChart days={days} period={period} />
          </div>

          {/* Top pages */}
          <TopPages pages={topPages} period={period} />
        </>
      )}
    </div>
  );
}
