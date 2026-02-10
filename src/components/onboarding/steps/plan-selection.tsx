"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Layout } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { planDefinitions, type PlanDefinition } from "@/lib/onboarding/plans";

const planIcons = {
  basico: Layout,
  construir: Zap,
  "premium-full": Sparkles,
};

function PlanCard({ plan, isSelected, onSelect }: { plan: PlanDefinition; isSelected: boolean; onSelect: () => void }) {
  const Icon = planIcons[plan.id];

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-2xl border p-6 text-left transition-all ${
        isSelected
          ? "border-[#22D3EE]/50 bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(124,92,255,0.1))] shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {/* Recommended badge */}
      {plan.recommended && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <Sparkles size={10} />
          Recomendado
        </span>
      )}

      {/* Selection indicator */}
      <div
        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
          isSelected
            ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B1020]"
            : "border-white/20"
        }`}
      >
        {isSelected && <Check size={14} strokeWidth={3} />}
      </div>

      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          isSelected
            ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)]"
            : "bg-white/[0.06] border border-white/10"
        }`}
      >
        <Icon size={24} className={isSelected ? "text-white" : "text-[var(--platform-text)]/60"} />
      </div>

      {/* Name & tagline */}
      <h3 className="mt-4 text-lg font-bold text-[var(--platform-text)]">{plan.name}</h3>
      <p className="text-xs text-[#22D3EE]">{plan.tagline}</p>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-black text-[var(--platform-text)]">{plan.price}</span>
        <span className="text-sm text-[var(--platform-text)]/50">{plan.priceNote}</span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-[var(--platform-text)]/60">{plan.description}</p>

      {/* Highlights */}
      <ul className="mt-4 space-y-2">
        {plan.highlights.map((highlight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--platform-text)]/70">
            <Check size={14} className="mt-0.5 shrink-0 text-[#22D3EE]" />
            {highlight}
          </li>
        ))}
      </ul>
    </motion.button>
  );
}

export function PlanSelection() {
  const { state, dispatch } = useWizard();
  const { selectedPlan } = state;

  function handleSelectPlan(planId: PlanDefinition["id"]) {
    dispatch({ type: "SET_PLAN", plan: planId });
  }

  function handleProceed() {
    if (selectedPlan) {
      // Always re-dispatch SET_PLAN to ensure visual configs are reset
      // even if user navigated back without re-clicking a plan card
      dispatch({ type: "SET_PLAN", plan: selectedPlan });
      dispatch({ type: "CONFIRM_PLAN" });
      dispatch({ type: "NEXT_STEP" });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Passo 1
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Como você quer criar seu site?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Escolha o modo que melhor se adapta ao seu momento. Você pode começar com um
          template pronto ou construir do zero com total liberdade.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {planDefinitions.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={!!selectedPlan} onSubmit={handleProceed} />
    </div>
  );
}
