"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useWizard } from "./wizard-context";
import { formatPrice } from "@/lib/onboarding/pricing";
import type { SectionPremiumId } from "@/lib/onboarding/premium-gate";

const LABELS: Record<SectionPremiumId, string> = {
  "premium-paleta": "Premium Paleta",
  "premium-tipografia": "Premium Tipografia",
  "premium-variantes": "Premium Variantes",
  "premium-canais": "Premium Canais",
  "premium-cards": "Premium Cards",
};

const DESCRIPTIONS: Record<SectionPremiumId, { on: string; off: string }> = {
  "premium-paleta": { on: "Cores personalizadas desbloqueadas", off: "Desbloqueie cores personalizadas" },
  "premium-tipografia": { on: "Fontes premium desbloqueadas", off: "Desbloqueie fontes exclusivas" },
  "premium-variantes": { on: "Variantes premium desbloqueadas", off: "Desbloqueie layouts premium" },
  "premium-canais": { on: "Canais extras desbloqueados", off: "Desbloqueie mais canais e botão flutuante" },
  "premium-cards": { on: "Cards extras desbloqueados", off: "Desbloqueie mais cards e ícones premium" },
};

const PRICES: Record<SectionPremiumId, number> = {
  "premium-paleta": 9.9,
  "premium-tipografia": 9.9,
  "premium-variantes": 14.9,
  "premium-canais": 14.9,
  "premium-cards": 14.9,
};

export function SectionPremiumToggle({ sectionId }: { sectionId: SectionPremiumId }) {
  const { state, dispatch } = useWizard();

  // Only show for "construir" plan
  if (state.selectedPlan !== "construir") return null;

  const isActive = state.addonsSelected.includes(sectionId);
  const desc = DESCRIPTIONS[sectionId];

  function handleToggle() {
    dispatch({ type: "TOGGLE_SECTION_PREMIUM", sectionId });
  }

  return (
    <div className="mb-4">
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
          isActive
            ? "border-[#A78BFA]/40 bg-[linear-gradient(135deg,rgba(124,92,255,0.08),rgba(59,130,246,0.08))]"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            isActive ? "bg-[#7C5CFF]/30" : "bg-white/10"
          }`}>
            <Sparkles size={14} className={isActive ? "text-[#A78BFA]" : "text-[var(--platform-text)]/40"} />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isActive ? "text-[#A78BFA]" : "text-[var(--platform-text)]"}`}>
              {LABELS[sectionId]}
            </p>
            <p className="text-[10px] text-[var(--platform-text)]/50">
              {isActive ? desc.on : desc.off}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold ${isActive ? "text-[#A78BFA]" : "text-[var(--platform-text)]/60"}`}>
            +{formatPrice(PRICES[sectionId])}/mês
          </span>
          <button
            onClick={handleToggle}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              isActive ? "bg-[#7C5CFF]" : "bg-white/15"
            }`}
          >
            <motion.div
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md"
              animate={{ left: isActive ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook for locked items: shows hint toast when clicking a locked item */
export function usePremiumHint() {
  const [hint, setHint] = useState(false);

  const showHint = useCallback(() => {
    setHint(true);
    setTimeout(() => setHint(false), 2500);
  }, []);

  return { hint, showHint };
}
