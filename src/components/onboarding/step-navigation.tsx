"use client";

import { useWizard } from "./wizard-context";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type StepNavigationProps = {
  canProceed?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit?: () => void;
  hideNext?: boolean;
};

export function StepNavigation({
  canProceed = true,
  isSubmitting = false,
  submitLabel,
  onSubmit,
  hideNext = false,
}: StepNavigationProps) {
  const { state, dispatch, steps, totalSteps } = useWizard();
  const { currentStep } = state;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  function handleBack() {
    dispatch({ type: "PREV_STEP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const nextLabel = isLastStep
    ? submitLabel ?? "Finalizar"
    : `Proximo: ${steps[currentStep + 1]?.label ?? ""}`;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
      {/* Back button */}
      <button
        onClick={handleBack}
        disabled={isFirstStep || isSubmitting}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
          isFirstStep || isSubmitting
            ? "cursor-not-allowed text-[var(--platform-text)]/30"
            : "border border-white/15 bg-white/[0.03] text-[var(--platform-text)] hover:bg-white/[0.08]"
        }`}
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      {/* Next/Submit button */}
      {!hideNext && (
        <button
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
            canProceed && !isSubmitting
              ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] text-white shadow-[0_10px_24px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 hover:brightness-110"
              : "cursor-not-allowed bg-white/10 text-[var(--platform-text)]/40"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processando...
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
