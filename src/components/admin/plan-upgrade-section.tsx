"use client";

import { CheckCircle2, Crown, Loader2, Paintbrush, Search, Sparkles, Star, X, Zap } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/admin/toast-provider";

type Props = {
  selectedPlan: string;
  siteId: string;
  basicoPrice?: number;
  premiumPrice?: number;
};

const PLAN_LABELS: Record<string, string> = {
  basico:         "Básico",
  construir:      "Construir",
  "premium-full": "Premium",
};

const PREMIUM_BENEFITS = [
  {
    icon: Paintbrush,
    label: "Editor visual completo",
    desc: "13 paletas de cores, fontes e estilos personalizados",
  },
  {
    icon: Search,
    label: "SEO avançado",
    desc: "Título e descrição customizados para o Google",
  },
  {
    icon: Star,
    label: "Remover branding BuildSphere",
    desc: "Site sem créditos no rodapé",
  },
  {
    icon: Zap,
    label: "Suporte prioritário",
    desc: "Atendimento mais ágil nos chamados",
  },
] as const;

export function PlanUpgradeSection({ selectedPlan, siteId: _siteId, basicoPrice = 59.9, premiumPrice = 109.8 }: Props) {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const planPriceLabel: Record<string, string> = {
    basico:         `${fmt(basicoPrice)}/mês`,
    construir:      `${fmt(basicoPrice)}/mês`,
    "premium-full": `${fmt(premiumPrice)}/mês`,
  };
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPremium = selectedPlan === "premium-full";

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upgrade-plan", { method: "POST" });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        toast("Upgrade para Premium realizado! Recarregando...", "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast(data?.error ?? "Erro ao fazer upgrade.", "error");
        setShowModal(false);
      }
    } finally {
      setLoading(false);
    }
  }

  /* ── Já premium ─────────────────────────────────────────────────────────── */
  if (isPremium) {
    return (
      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Crown size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">Você está no plano Premium ✓</p>
            <p className="text-xs text-[var(--platform-text)]/50">{planPriceLabel["premium-full"]}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {PREMIUM_BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li
                key={b.label}
                className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5"
              >
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-[var(--platform-text)]">{b.label}</p>
                  <p className="text-[10px] text-[var(--platform-text)]/40">{b.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  /* ── Não premium ────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12182B] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--platform-text)]">
                  Confirmar upgrade para Premium
                </h3>
                <p className="mt-1 text-xs text-[var(--platform-text)]/60">
                  Seu plano será atualizado imediatamente.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Highlights */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-3 text-center">
                <Zap size={16} className="mx-auto mb-1.5 text-emerald-400" />
                <p className="text-[11px] font-bold text-emerald-300">Acesso imediato</p>
                <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/40">
                  Todos os recursos Premium agora
                </p>
              </div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-3 text-center">
                <Sparkles size={16} className="mx-auto mb-1.5 text-amber-400" />
                <p className="text-[11px] font-bold text-amber-300">Próxima renovação</p>
                <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/40">
                  Cobrança de {fmt(premiumPrice)} na renovação
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-[var(--platform-text)]/70 transition hover:bg-white/[0.04]"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleUpgrade()}
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

      {/* Current plan info */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
          Plano atual
        </p>
        <p className="mt-1 text-lg font-bold text-[var(--platform-text)]">
          {PLAN_LABELS[selectedPlan] ?? "Básico"}
          <span className="ml-2 text-sm font-normal text-[var(--platform-text)]/50">
            — {planPriceLabel[selectedPlan] ?? "R$ 59,90/mês"}
          </span>
        </p>
      </section>

      {/* Upgrade card */}
      <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/5 to-violet-500/5 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]">
            <Crown size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--platform-text)]">Upgrade para Premium</p>
            <p className="text-xs text-[var(--platform-text)]/50">{fmt(premiumPrice)}/mês</p>
          </div>
        </div>

        {/* Highlights badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <Zap size={11} />
            Acesso imediato
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={11} />
            Cobrança na próxima renovação
          </span>
        </div>

        {/* Benefits */}
        <ul className="mb-5 space-y-2">
          {PREMIUM_BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li
                key={b.label}
                className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5"
              >
                <Icon size={13} className="mt-0.5 shrink-0 text-[#22D3EE]" />
                <div>
                  <p className="text-xs font-semibold text-[var(--platform-text)]">{b.label}</p>
                  <p className="text-[10px] text-[var(--platform-text)]/40">{b.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
        >
          Fazer upgrade agora
        </button>

        <p className="mt-3 text-center text-[10px] text-[var(--platform-text)]/30">
          Sem downgrade — ao ativar o Premium, ele não pode ser revertido.
        </p>
      </section>
    </>
  );
}
