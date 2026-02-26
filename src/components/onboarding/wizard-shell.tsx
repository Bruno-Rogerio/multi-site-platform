"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import { WizardProvider, useWizard } from "./wizard-context";
import { StepIndicator } from "./step-indicator";
import { formatPrice } from "@/lib/onboarding/pricing";

// Steps (will be imported once created)
import { LeadCaptureStep } from "./steps/lead-capture-step";
import { PlanSelection } from "./steps/plan-selection";
import { TemplateGallery } from "./steps/template-gallery";
import { TemplateContentEditor } from "./steps/template-content-editor";
import { StylePaletteStep } from "./steps/style-palette-step";
import { SectionBuilderStep } from "./steps/section-builder-step";
import { ContentEditorStep } from "./steps/content-editor-step";
import { FinalizeStep } from "./steps/finalize-step";

// Preview
import { LivePreviewPanel } from "./preview/live-preview-panel";

function WizardContent() {
  const { state, steps, monthlyTotal } = useWizard();
  const { currentStep, selectedPlan } = state;
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const currentStepId = steps[currentStep]?.id;

  const StepComponent = useMemo(() => {
    switch (currentStepId) {
      case "lead-capture":
        return LeadCaptureStep;
      case "plan-selection":
        return PlanSelection;
      case "template-gallery":
        return TemplateGallery;
      case "template-content":
        return TemplateContentEditor;
      case "style-palette":
        return StylePaletteStep;
      case "section-builder":
        return SectionBuilderStep;
      case "content-editor":
        return ContentEditorStep;
      case "finalizar":
        return FinalizeStep;
      default:
        return PlanSelection;
    }
  }, [currentStepId]);

  // Show preview for all steps except lead capture, plan selection, and finalizar
  const showPreview = currentStepId !== "plan-selection" && currentStepId !== "lead-capture" && currentStepId !== "finalizar";

  return (
    <div className="min-h-screen">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#22D3EE]/8 blur-[100px]" />
        <div className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#7C5CFF]/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[40%] h-[350px] w-[350px] rounded-full bg-[#3B82F6]/8 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8">
        {/* Step indicator */}
        <StepIndicator />

        {/* Main layout: wizard + preview */}
        <div className={`grid gap-6 ${showPreview ? "xl:grid-cols-[1fr_400px]" : ""}`}>
          {/* Wizard panel */}
          <div className="min-w-0">
            <div className="rounded-2xl border border-white/10 bg-[#12182B]/80 p-6 backdrop-blur md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <StepComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Preview panel (desktop only) */}
          {showPreview && (
            <div className="hidden xl:block">
              <div className="sticky top-6">
                <LivePreviewPanel />

                {/* Price summary */}
                <div className="mt-4 rounded-xl border border-white/10 bg-[#12182B]/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--platform-text)]/60">Total mensal</span>
                    <span className="text-xl font-bold bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                      {formatPrice(monthlyTotal)}
                    </span>
                  </div>
                  {selectedPlan && (
                    <p className="mt-1 text-xs text-[var(--platform-text)]/40">
                      Plano {selectedPlan === "basico" ? "Básico" : selectedPlan === "construir" ? "Construir" : "Premium Full"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile preview button (shown below xl) */}
        {showPreview && (
          <div className="fixed bottom-6 right-4 z-40 xl:hidden">
            <button
              onClick={() => setMobilePreviewOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#22D3EE] px-4 py-3 text-sm font-bold text-[#0B1020] shadow-lg shadow-[#22D3EE]/30 transition hover:bg-[#06B6D4] active:scale-95"
            >
              <Eye size={16} />
              Ver preview
            </button>
          </div>
        )}

        {/* Mobile preview drawer */}
        <AnimatePresence>
          {mobilePreviewOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 xl:hidden"
                onClick={() => setMobilePreviewOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-2xl border-t border-white/10 bg-[#12182B] xl:hidden"
              >
                {/* Handle bar */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--platform-text)]">Preview do site</span>
                  <button
                    onClick={() => setMobilePreviewOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--platform-text)]/60 transition hover:bg-white/10 hover:text-[var(--platform-text)]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <LivePreviewPanel />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function WizardShell() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
