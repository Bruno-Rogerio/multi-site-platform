"use client";

import { CheckCircle2, Crown, Loader2, Sparkles, X, Zap, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/admin/toast-provider";

type TargetPlan = "basico" | "premium";

type Props = {
  selectedPlan: string;
  siteId: string;
  starterPrice?: number;
  basicoPrice?: number;
  premiumPrice?: number;
};

const PLAN_LABELS: Record<string, string> = {
  starter:        "Starter",
  basico:         "Básico",
  construir:      "Básico",
  "premium-full": "Premium Full",
};

type UpgradeOption = {
  targetPlan: TargetPlan;
  name: string;
  price: string;
  highlight?: boolean;
  badge?: string;
  benefits: string[];
};

export function PlanUpgradeSection({
  selectedPlan,
  starterPrice = 29.9,
  basicoPrice = 59.9,
  premiumPrice = 109.8,
}: Props) {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const { toast } = useToast();

  const [confirmTarget, setConfirmTarget] = useState<TargetPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const isPremium = selectedPlan === "premium-full" || selectedPlan === "construir";
  const isStarter = selectedPlan === "starter";
  const isBasico  = !isPremium && !isStarter;

  // Build upgrade options based on current plan
  const upgradeOptions: UpgradeOption[] = [];

  if (isStarter) {
    upgradeOptions.push({
      targetPlan: "basico",
      name: "Básico",
      price: `${fmt(basicoPrice)}/mês`,
      benefits: [
        "20 templates disponíveis",
        "Todas as 7 seções incluídas",
        "Serviços ilimitados",
        "CTA flutuante desbloqueado",
        "Suporte em até 24h",
      ],
    });
  }

  if (isStarter || isBasico) {
    upgradeOptions.push({
      targetPlan: "premium",
      name: "Premium Full",
      price: `${fmt(premiumPrice)}/mês`,
      highlight: true,
      badge: "Recomendado",
      benefits: [
        "Tudo do plano Básico",
        "Personalização visual completa",
        "Blog, Galeria e Eventos",
        "FAQ e Depoimentos ilimitados",
        "SEO avançado",
        "Sem branding BuildSphere",
        "Prioridade no suporte",
      ],
    });
  }

  async function handleConfirm() {
    if (!confirmTarget) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upgrade-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPlan: confirmTarget }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        toast(
          `Upgrade para ${confirmTarget === "premium" ? "Premium" : "Básico"} realizado! Recarregando...`,
          "success",
        );
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast(data?.error ?? "Erro ao fazer upgrade.", "error");
        setConfirmTarget(null);
      }
    } finally {
      setLoading(false);
    }
  }

  /* ── Premium máximo ──────────────────────────────────────────────────────── */
  if (isPremium) {
    return (
      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Crown size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">Você está no plano máximo ✓</p>
            <p className="text-xs text-[var(--platform-text)]/50">{fmt(premiumPrice)}/mês · Premium Full</p>
          </div>
        </div>
        <ul className="space-y-2">
          {[
            "Personalização visual completa",
            "Blog, Galeria e Eventos",
            "SEO avançado",
            "Sem branding BuildSphere",
            "Prioridade no suporte",
          ].map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-xs font-semibold text-[var(--platform-text)]">{b}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* ── Plano atual + opções de upgrade ────────────────────────────────────── */
  return (
    <>
      {/* Confirmation modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12182B] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--platform-text)]">
                  Confirmar upgrade para {confirmTarget === "premium" ? "Premium Full" : "Básico"}
                </h3>
                <p className="mt-1 text-xs text-[var(--platform-text)]/60">
                  Acesso liberado imediatamente. Novo valor cobrado na próxima renovação.
                </p>
              </div>
              <button
                onClick={() => setConfirmTarget(null)}
                className="text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-3 text-center">
                <Zap size={16} className="mx-auto mb-1.5 text-emerald-400" />
                <p className="text-[11px] font-bold text-emerald-300">Acesso imediato</p>
                <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/40">
                  Recursos liberados agora
                </p>
              </div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-3 text-center">
                <Sparkles size={16} className="mx-auto mb-1.5 text-amber-400" />
                <p className="text-[11px] font-bold text-amber-300">Próxima renovação</p>
                <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/40">
                  {confirmTarget === "premium" ? fmt(premiumPrice) : fmt(basicoPrice)} cobrado
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmTarget(null)}
                disabled={loading}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-[var(--platform-text)]/70 transition hover:bg-white/[0.04]"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleConfirm()}
                disabled={loading}
                className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    Confirmando...
                  </span>
                ) : (
                  "Confirmar upgrade"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current plan */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
          Plano atual
        </p>
        <p className="mt-1 text-lg font-bold text-[var(--platform-text)]">
          {PLAN_LABELS[selectedPlan] ?? "Básico"}
          <span className="ml-2 text-sm font-normal text-[var(--platform-text)]/50">
            — {isStarter ? `${fmt(starterPrice)}/mês` : isBasico ? `${fmt(basicoPrice)}/mês` : `${fmt(premiumPrice)}/mês`}
          </span>
        </p>
        <p className="mt-2 text-xs text-[var(--platform-text)]/40">
          Sem fidelidade — cancele quando quiser.
        </p>
      </section>

      {/* Upgrade options */}
      <div className={`mt-4 grid gap-4 ${upgradeOptions.length > 1 ? "md:grid-cols-2" : ""}`}>
        {upgradeOptions.map((option) => (
          <section
            key={option.targetPlan}
            className={`rounded-2xl border p-5 ${
              option.highlight
                ? "border-[#7C5CFF]/40 bg-[linear-gradient(135deg,rgba(59,130,246,0.06),rgba(124,92,255,0.08))]"
                : "border-white/10 bg-[#12182B]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    option.highlight
                      ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]"
                      : "bg-white/[0.06] border border-white/10"
                  }`}
                >
                  {option.highlight ? (
                    <Crown size={18} className="text-white" />
                  ) : (
                    <Star size={18} className="text-[#22D3EE]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--platform-text)]">
                    {option.name}
                    {option.badge && (
                      <span className="ml-2 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        {option.badge}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--platform-text)]/50">{option.price}</p>
                </div>
              </div>
            </div>

            <ul className="mb-4 space-y-1.5">
              {option.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-[var(--platform-text)]/70">
                  <CheckCircle2
                    size={13}
                    className={`mt-0.5 shrink-0 ${option.highlight ? "text-[#22D3EE]" : "text-emerald-400"}`}
                  />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mb-3 flex gap-1.5">
              <span className="flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-500/8 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <Zap size={9} />
                Acesso imediato
              </span>
              <span className="flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-500/8 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                <Sparkles size={9} />
                Cobrado na renovação
              </span>
            </div>

            <button
              type="button"
              onClick={() => setConfirmTarget(option.targetPlan)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                option.highlight
                  ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] text-white hover:brightness-110"
                  : "border border-emerald-500/30 bg-emerald-500/8 text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-500/15"
              }`}
            >
              Fazer upgrade para {option.name}
              <ArrowRight size={14} />
            </button>
          </section>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] text-[var(--platform-text)]/30">
        Sem downgrade — os upgrades são permanentes para o ciclo atual.
      </p>
    </>
  );
}
