"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Layout, Zap, ArrowRight, Star } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { planDefinitions, type PlanDefinition } from "@/lib/onboarding/plans";

/* ─── Per-plan visual tokens ─────────────────────────────────────────────── */

const PLAN_STYLES = {
  starter: {
    icon: Zap,
    gradient: "linear-gradient(135deg, #059669, #10B981, #34D399)",
    glow: "rgba(16,185,129,0.25)",
    border: "rgba(16,185,129,0.35)",
    borderSelected: "rgba(52,211,153,0.6)",
    badgeColor: "#10B981",
    accentText: "text-emerald-400",
    priceBg: "linear-gradient(135deg,#059669,#22D3EE)",
    tag: "Menor preço",
    tagBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    orbLeft: "rgba(16,185,129,0.12)",
    orbRight: "rgba(34,211,238,0.08)",
  },
  basico: {
    icon: Layout,
    gradient: "linear-gradient(135deg, #2563EB, #3B82F6, #22D3EE)",
    glow: "rgba(59,130,246,0.25)",
    border: "rgba(59,130,246,0.3)",
    borderSelected: "rgba(34,211,238,0.6)",
    badgeColor: "#3B82F6",
    accentText: "text-blue-400",
    priceBg: "linear-gradient(135deg,#2563EB,#22D3EE)",
    tag: "Mais completo",
    tagBg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    orbLeft: "rgba(59,130,246,0.12)",
    orbRight: "rgba(34,211,238,0.08)",
  },
  premium: {
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #7C3AED, #7C5CFF, #A855F7)",
    glow: "rgba(124,92,255,0.35)",
    border: "rgba(124,92,255,0.4)",
    borderSelected: "rgba(168,85,247,0.7)",
    badgeColor: "#A855F7",
    accentText: "text-violet-400",
    priceBg: "linear-gradient(135deg,#7C3AED,#22D3EE)",
    tag: "Recomendado",
    tagBg: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    orbLeft: "rgba(124,92,255,0.18)",
    orbRight: "rgba(168,85,247,0.10)",
  },
} as const;

/* ─── Comparison rows shown at the bottom ─────────────────────────────────── */

const COMPARISON = [
  { label: "Templates",       starter: "8",           basico: "20",          premium: "20" },
  { label: "Seções",          starter: "4 fixas",     basico: "7 seções",    premium: "7 seções" },
  { label: "Cards de serviço",starter: "até 3",       basico: "ilimitado",   premium: "ilimitado" },
  { label: "CTA flutuante",   starter: "—",           basico: "✓",           premium: "✓" },
  { label: "SEO",             starter: "—",           basico: "básico",      premium: "avançado" },
  { label: "Blog / Galeria",  starter: "—",           basico: "—",           premium: "✓" },
  { label: "Sem branding",    starter: "—",           basico: "—",           premium: "✓" },
  { label: "Suporte",         starter: "até 48h",     basico: "até 24h",     premium: "prioritário" },
];

/* ─── Plan card ─────────────────────────────────────────────────────────────── */

function PlanCard({
  plan,
  isSelected,
  price,
  onSelect,
}: {
  plan: PlanDefinition;
  isSelected: boolean;
  price: string;
  onSelect: () => void;
}) {
  const s = PLAN_STYLES[plan.id];
  const Icon = s.icon;
  const isPremium = plan.id === "premium";

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.015, y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative w-full overflow-hidden rounded-2xl text-left"
      style={{
        border: `1px solid ${isSelected ? s.borderSelected : s.border}`,
        boxShadow: isSelected
          ? `0 0 0 1px ${s.borderSelected}, 0 8px 40px ${s.glow}`
          : `0 4px 20px rgba(0,0,0,0.2)`,
        background: isSelected
          ? `radial-gradient(ellipse at top left, ${s.orbLeft}, transparent 65%), radial-gradient(ellipse at bottom right, ${s.orbRight}, transparent 65%), #0D1326`
          : "#0D1326",
        transition: "all 0.3s ease",
      }}
    >
      {/* Recommended ribbon for Premium */}
      {isPremium && (
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: s.gradient }}
        />
      )}

      {/* Content */}
      <div className="p-6">
        {/* Top row: icon + tag */}
        <div className="mb-5 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: s.gradient,
              boxShadow: `0 6px 20px ${s.glow}`,
            }}
          >
            <Icon size={22} className="text-white" />
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${s.tagBg}`}
          >
            {plan.id === "starter" && <Zap size={9} />}
            {plan.id === "premium" && <Star size={9} fill="currentColor" />}
            {s.tag}
          </span>
        </div>

        {/* Name + tagline */}
        <h3 className="text-xl font-black text-[#EAF0FF]">{plan.name}</h3>
        <p className={`mt-0.5 text-xs font-semibold ${s.accentText}`}>{plan.tagline}</p>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-1">
          <span
            className="text-3xl font-black"
            style={{
              background: s.priceBg,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {price}
          </span>
          <span className="text-sm text-[#EAF0FF]/40">/mês</span>
        </div>

        {/* Divider */}
        <div
          className="my-4 h-px w-full"
          style={{ background: `linear-gradient(90deg, ${s.border}, transparent)` }}
        />

        {/* Highlights */}
        <ul className="space-y-2">
          {plan.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#EAF0FF]/70">
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: s.gradient }}
              >
                ✓
              </span>
              {h}
            </li>
          ))}
        </ul>

        {/* CTA row */}
        <div
          className={`mt-5 flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
            isSelected ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `${s.glow}`,
            border: `1px solid ${s.borderSelected}`,
          }}
        >
          <span className="text-xs font-bold text-[#EAF0FF]">Plano selecionado</span>
          <Check size={14} className="text-[#EAF0FF]" />
        </div>

        {!isSelected && (
          <div className="mt-5 flex items-center justify-end gap-1 text-xs text-[#EAF0FF]/30">
            Escolher
            <ArrowRight size={12} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function PlanSelection() {
  const { state, dispatch, planPrices } = useWizard();
  const { selectedPlan } = state;

  function handleSelectPlan(planId: PlanDefinition["id"]) {
    dispatch({ type: "SET_PLAN", plan: planId });
  }

  function handleProceed() {
    if (selectedPlan) {
      dispatch({ type: "SET_PLAN", plan: selectedPlan });
      dispatch({ type: "CONFIRM_PLAN" });
      dispatch({ type: "NEXT_STEP" });
    }
  }

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Escolha seu plano
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Qual plano combina com você?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Comece simples e evolua quando quiser — sem fidelidade, sem taxa de setup.
          Você pode fazer upgrade a qualquer momento pelo painel.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {planDefinitions.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            price={fmt(planPrices[plan.id as "starter" | "basico" | "premium"])}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        <div className="grid grid-cols-4 border-b border-white/8 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#EAF0FF]/40">
          <span>Recurso</span>
          <span className="text-center text-emerald-400">Starter</span>
          <span className="text-center text-blue-400">Básico</span>
          <span className="text-center text-violet-400">Premium</span>
        </div>
        {COMPARISON.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-4 items-center px-4 py-2.5 text-xs ${
              i % 2 === 0 ? "bg-white/[0.015]" : ""
            } ${selectedPlan ? "" : ""}`}
          >
            <span className="text-[#EAF0FF]/50">{row.label}</span>
            <span
              className={`text-center font-semibold ${
                row.starter === "—"
                  ? "text-[#EAF0FF]/20"
                  : selectedPlan === "starter"
                  ? "text-emerald-400"
                  : "text-[#EAF0FF]/60"
              }`}
            >
              {row.starter}
            </span>
            <span
              className={`text-center font-semibold ${
                row.basico === "—"
                  ? "text-[#EAF0FF]/20"
                  : selectedPlan === "basico"
                  ? "text-blue-400"
                  : "text-[#EAF0FF]/60"
              }`}
            >
              {row.basico}
            </span>
            <span
              className={`text-center font-semibold ${
                row.premium === "—"
                  ? "text-[#EAF0FF]/20"
                  : selectedPlan === "premium"
                  ? "text-violet-400"
                  : "text-[#EAF0FF]/60"
              }`}
            >
              {row.premium}
            </span>
          </div>
        ))}
        <div className="border-t border-white/8 px-4 py-2 text-center text-[10px] text-[#EAF0FF]/25">
          Sem taxa de setup · Cancele quando quiser · Upgrade disponível a qualquer hora
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={!!selectedPlan} onSubmit={handleProceed} />
    </div>
  );
}
