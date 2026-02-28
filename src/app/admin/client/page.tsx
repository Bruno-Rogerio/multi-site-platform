import Link from "next/link";
import {
  PenTool,
  Paintbrush,
  Settings,
  ExternalLink,
  Globe,
  Sparkles,
  ArrowUpRight,
  Rocket,
} from "lucide-react";

import { DraftCountdown } from "@/components/admin/draft-countdown";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  theme_settings: Record<string, unknown> | null;
};

const PLAN_LABELS: Record<string, { name: string; badge: string }> = {
  basico: {
    name: "Básico",
    badge: "text-blue-300 border-blue-400/30 bg-blue-500/10",
  },
  construir: {
    name: "Construir",
    badge: "text-violet-300 border-violet-400/30 bg-violet-500/10",
  },
  "premium-full": {
    name: "Premium Full",
    badge: "text-amber-300 border-amber-400/30 bg-amber-500/10",
  },
};

export default async function ClientAdminPage() {
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

  const ts = site?.theme_settings ?? {};
  const isDraft = ts.onboardingDraft === true;
  const selectedPlan = (ts.selectedPlan as string) ?? "basico";
  const planInfo = PLAN_LABELS[selectedPlan] ?? PLAN_LABELS.basico;
  const previewExpiresAt = ts.previewExpiresAt as string | undefined;

  /* ── DRAFT STATE ─────────────────────────────────── */
  if (isDraft) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-[#12182B] p-8 text-center shadow-[0_0_48px_rgba(59,130,246,0.10)]">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]">
              <Rocket size={30} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--platform-text)]">
            Seu site está quase pronto!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--platform-text)]/55">
            Você criou uma demonstração. Publique agora para seu site ficar
            online de verdade, com subdomínio ativo e tudo configurado.
          </p>

          {previewExpiresAt && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--platform-text)]/40">
                Demonstração expira em
              </p>
              <DraftCountdown expiresAt={previewExpiresAt} />
            </div>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-7 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              <Rocket size={15} />
              Publicar agora
            </Link>
            {site && (
              <a
                href={`https://${site.domain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-[var(--platform-text)]/60 transition hover:bg-white/[0.07] hover:text-[var(--platform-text)]"
              >
                <ExternalLink size={14} />
                Ver demonstração
              </a>
            )}
          </div>

          {site && (
            <p className="mt-6 text-xs text-[var(--platform-text)]/35">
              Após publicar, ficará disponível em{" "}
              <span className="font-mono text-[#22D3EE]">{site.domain}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ── ACTIVE STATE ────────────────────────────────── */
  const actions = [
    {
      label: "Editar conteúdo",
      description: "Textos, imagens e seções",
      href: "/admin/client/editor",
      icon: PenTool,
      iconBg: "bg-[#3B82F6]/10",
      iconColor: "text-[#3B82F6]",
      gradientFrom: "from-[#3B82F6]/10",
    },
    {
      label: "Aparência",
      description: "Cores, fontes e estilo visual",
      href: "/admin/client/appearance",
      icon: Paintbrush,
      iconBg: "bg-[#7C5CFF]/10",
      iconColor: "text-[#7C5CFF]",
      gradientFrom: "from-[#7C5CFF]/10",
    },
    {
      label: "Configurações",
      description: "Senha, nome do negócio e subdomínio",
      href: "/admin/client/settings",
      icon: Settings,
      iconBg: "bg-[#22D3EE]/10",
      iconColor: "text-[#22D3EE]",
      gradientFrom: "from-[#22D3EE]/10",
    },
    {
      label: "Ver meu site",
      description: site?.domain ?? "Abrir no navegador",
      href: site ? `https://${site.domain}` : "#",
      icon: Globe,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      gradientFrom: "from-emerald-500/10",
      external: true,
    },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Site header card */}
      <div className="mb-7 rounded-2xl border border-white/10 bg-[#12182B] p-5 shadow-[0_0_24px_rgba(34,211,238,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--platform-text)]">
                {site?.name ?? "Meu site"}
              </h1>
              {site && (
                <a
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-[#22D3EE] hover:underline"
                >
                  {site.domain}
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${planInfo.badge}`}
            >
              <Sparkles size={10} />
              {planInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.iconBg}`}
                >
                  <Icon size={22} className={action.iconColor} />
                </div>
                <ArrowUpRight
                  size={17}
                  className="text-[var(--platform-text)]/20 transition group-hover:text-[var(--platform-text)]/50"
                />
              </div>
              <div className="mt-5">
                <p className="text-base font-bold text-[var(--platform-text)]">
                  {action.label}
                </p>
                <p className="mt-1 text-xs text-[var(--platform-text)]/50">
                  {action.description}
                </p>
              </div>
            </>
          );

          const cls = `group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br ${action.gradientFrom} to-transparent bg-[#12182B] p-5 transition hover:border-white/20 hover:shadow-lg`;

          if ("external" in action && action.external) {
            return (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className={cls}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link key={action.href} href={action.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
