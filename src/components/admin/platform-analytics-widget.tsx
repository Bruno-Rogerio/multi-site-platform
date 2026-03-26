import { TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/* ─── helpers ─────────────────────────────────────────── */

function pct(a: number, b: number) {
  if (b === 0) return a > 0 ? 100 : 0;
  return Math.round(((a - b) / b) * 100);
}

function fmtShort(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type DaySlot = { date: string; label: string; count: number };
type PageRow  = { path: string; views: number; pct: number };

/* ─── stat card ───────────────────────────────────────── */

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

/* ─── bar chart (SVG, server-rendered) ───────────────── */

function BarChart({ days }: { days: DaySlot[] }) {
  const max    = Math.max(...days.map((d) => d.count), 1);
  const W      = 560;
  const H      = 88;       // extra height for value labels
  const labelH = 14;       // reserved at top for numbers
  const pad    = 4;
  const barArea = H - labelH - pad;
  const slot   = W / days.length;
  const barW   = Math.max(4, slot - 6);
  const TZ     = "America/Sao_Paulo";
  const today  = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 88 }}
        aria-label="Visitas diárias"
      >
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>

        {days.map((day, i) => {
          const barH  = Math.max(3, (day.count / max) * barArea);
          const x     = i * slot + (slot - barW) / 2;
          const y     = H - pad - barH;
          const cx    = i * slot + slot / 2;
          const isNow = day.date === today;
          return (
            <g key={day.date}>
              <rect
                x={x} y={y}
                width={barW} height={barH}
                rx={3}
                fill={isNow ? "#22D3EE" : "url(#pg)"}
                opacity={isNow ? 1 : 0.65}
              />
              {day.count > 0 && (
                <text
                  x={cx}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="inherit"
                  fill={isNow ? "#22D3EE" : "rgba(234,240,255,0.5)"}
                  fontWeight={isNow ? "700" : "400"}
                >
                  {day.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* date labels — show every other one on narrow */}
      <div className="mt-1 flex w-full">
        {days.map((day, i) => {
          const show = days.length <= 10 || i % 2 === 0;
          return (
            <div
              key={day.date}
              className="flex-1 text-center"
              style={{ fontSize: 9, color: "rgba(234,240,255,0.28)", lineHeight: 1 }}
            >
              {show ? day.label : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── top pages ──────────────────────────────────────── */

function TopPages({ pages }: { pages: PageRow[] }) {
  if (pages.length === 0) return null;
  const max = pages[0].views;

  return (
    <div className="mt-5 border-t border-white/[0.06] pt-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
        Top páginas · 30 dias
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
                style={{ width: `${Math.round((p.views / max) * 100)}%` }}
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

/* ─── main widget ─────────────────────────────────────── */

export async function PlatformAnalyticsWidget() {
  const adminDb = createSupabaseAdminClient();

  let viewsToday    = 0;
  let viewsYest     = 0;
  let views7d       = 0;
  let views7dPrev   = 0;
  let views30d      = 0;
  let views30dPrev  = 0;
  let viewsTotal    = 0;
  let days: DaySlot[] = [];
  let topPages: PageRow[] = [];

  if (adminDb) {
    const now = Date.now();

    // Calendar-day boundaries in Brazil timezone (America/Sao_Paulo = UTC-3, sem DST desde 2019)
    const TZ_OFFSET = "-03:00";
    const brFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
    const todayBR     = brFmt.format(new Date());
    const yesterdayBR = brFmt.format(new Date(now - 86_400_000));
    const tToday = new Date(`${todayBR}T00:00:00${TZ_OFFSET}`).toISOString();
    const tYest  = new Date(`${yesterdayBR}T00:00:00${TZ_OFFSET}`).toISOString();
    const t7d    = new Date(now -   7 * 86_400_000).toISOString();
    const t14d   = new Date(now -  14 * 86_400_000).toISOString();
    const t30d   = new Date(now -  30 * 86_400_000).toISOString();
    const t60d   = new Date(now -  60 * 86_400_000).toISOString();

    const [
      res1d, resYest, res7d, res7dPrev,
      res30d, res30dPrev, resTotal,
      res14dRaw, res30dPaths,
    ] = await Promise.all([
      // today (desde meia-noite)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tToday),
      // yesterday (meia-noite de ontem → meia-noite de hoje)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", tYest).lt("visited_at", tToday),
      // last 7d
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t7d),
      // prev 7d (14d → 7d)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t14d).lt("visited_at", t7d),
      // last 30d
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t30d),
      // prev 30d (60d → 30d)
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }).gte("visited_at", t60d).lt("visited_at", t30d),
      // total
      adminDb.from("platform_page_views").select("id", { count: "exact", head: true }),
      // raw rows for 14d chart
      adminDb.from("platform_page_views").select("visited_at").gte("visited_at", t14d),
      // raw rows for top pages (30d)
      adminDb.from("platform_page_views").select("path").gte("visited_at", t30d),
    ]);

    viewsToday   = res1d.count   ?? 0;
    viewsYest    = resYest.count ?? 0;
    views7d      = res7d.count   ?? 0;
    views7dPrev  = res7dPrev.count  ?? 0;
    views30d     = res30d.count  ?? 0;
    views30dPrev = res30dPrev.count ?? 0;
    viewsTotal   = resTotal.count   ?? 0;

    // Build daily slots (last 14 days) — grouping in Brazil timezone
    const brDateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
    const dayCounts = new Map<string, number>();
    for (const row of (res14dRaw.data ?? []) as { visited_at: string }[]) {
      const d = brDateFmt.format(new Date(row.visited_at));
      dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
    }
    days = Array.from({ length: 14 }, (_, i) => {
      const dt = new Date(now - (13 - i) * 86_400_000);
      const key = brDateFmt.format(dt);
      return {
        date: key,
        label: dt.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" }),
        count: dayCounts.get(key) ?? 0,
      };
    });

    // Build top pages
    const pathMap = new Map<string, number>();
    for (const row of (res30dPaths.data ?? []) as { path: string }[]) {
      pathMap.set(row.path, (pathMap.get(row.path) ?? 0) + 1);
    }
    const total30 = views30d || 1;
    topPages = Array.from(pathMap.entries())
      .map(([path, views]) => ({ path, views, pct: Math.round((views / total30) * 100) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }

  const noData = viewsTotal === 0;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#12182B] p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#22D3EE]/10">
          <Eye size={14} className="text-[#22D3EE]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Visitas ao site</h2>
          <p className="text-[10px] text-[var(--platform-text)]/35">Tráfego nas páginas públicas da plataforma</p>
        </div>
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
            <StatCard label="Hoje"    value={viewsToday}  change={pct(viewsToday, viewsYest)} />
            <StatCard label="7 dias"  value={views7d}     change={pct(views7d, views7dPrev)} />
            <StatCard label="30 dias" value={views30d}    change={pct(views30d, views30dPrev)} />
            <StatCard label="Total"   value={viewsTotal}  sub="desde o início" />
          </div>

          {/* Daily bar chart */}
          <div className="mt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/40">
              Últimos 14 dias
              <span className="ml-2 font-normal normal-case tracking-normal text-[#22D3EE]/70">
                — barra azul = hoje
              </span>
            </p>
            <BarChart days={days} />
          </div>

          {/* Top pages */}
          <TopPages pages={topPages} />
        </>
      )}
    </div>
  );
}
