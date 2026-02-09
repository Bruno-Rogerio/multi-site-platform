"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles } from "lucide-react";
import { useWizard } from "./wizard-context";
import { getFeatureById } from "@/lib/onboarding/premium-gate";
import { formatPrice } from "@/lib/onboarding/pricing";
import { PREMIUM_FULL_TOTAL } from "@/lib/onboarding/plans";

export function PremiumGateModal() {
  const { state, dispatch } = useWizard();
  const modal = state.premiumGateModal;

  if (!modal?.open) return null;

  const feature = getFeatureById(modal.featureId as Parameters<typeof getFeatureById>[0]);

  function handleClose() {
    dispatch({ type: "CLOSE_PREMIUM_GATE" });
  }

  function handleAddAddon() {
    if (feature) {
      dispatch({ type: "TOGGLE_ADDON", addonId: feature.addonId });

      // Special handling: enable the feature after purchasing
      if (feature.id === "floating-cta") {
        dispatch({ type: "SET_FLOATING_CTA", enabled: true });
      }

      // Auto-select the CTA type that triggered the modal
      if (feature.id === "extra-cta-types" && modal?.pendingCtaTypeId) {
        dispatch({ type: "TOGGLE_CTA_TYPE", ctaTypeId: modal.pendingCtaTypeId });
      }
    }
    dispatch({ type: "CLOSE_PREMIUM_GATE" });
  }

  function handleUpgradeToPremium() {
    dispatch({ type: "UPGRADE_TO_PREMIUM" });
  }

  return (
    <AnimatePresence>
      {modal.open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="rounded-2xl border border-white/15 bg-[#12182B] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-lg p-1 text-[var(--platform-text)]/50 transition hover:bg-white/10 hover:text-[var(--platform-text)]"
              >
                <X size={18} />
              </button>

              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.2),rgba(59,130,246,0.2))] border border-[#7C5CFF]/30">
                <Lock size={24} className="text-[#A78BFA]" />
              </div>

              {/* Title */}
              <h3 className="mt-4 text-center text-lg font-bold text-[var(--platform-text)]">
                Recurso Premium
              </h3>

              {/* Feature info */}
              {feature && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-semibold text-[var(--platform-text)]">{feature.label}</p>
                  <p className="mt-1 text-sm text-[var(--platform-text)]/60">{feature.description}</p>
                </div>
              )}

              {/* Options */}
              <div className="mt-6 space-y-3">
                {/* Add to plan */}
                <button
                  onClick={handleAddAddon}
                  className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.08]"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--platform-text)]">
                      Adicionar ao plano
                    </p>
                    <p className="text-xs text-[var(--platform-text)]/50">
                      Apenas este recurso
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#22D3EE]">
                    +{formatPrice(modal.featurePrice)}/mês
                  </span>
                </button>

                {/* Upgrade to Premium Full */}
                <button
                  onClick={handleUpgradeToPremium}
                  className="flex w-full items-center justify-between rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-3 text-left transition hover:brightness-110"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-white" />
                    <div>
                      <p className="text-sm font-semibold text-white">Premium Full</p>
                      <p className="text-xs text-white/70">Tudo desbloqueado</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatPrice(PREMIUM_FULL_TOTAL)}/mês
                  </span>
                </button>
              </div>

              {/* Cancel */}
              <button
                onClick={handleClose}
                className="mt-4 w-full text-center text-sm text-[var(--platform-text)]/50 transition hover:text-[var(--platform-text)]"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
