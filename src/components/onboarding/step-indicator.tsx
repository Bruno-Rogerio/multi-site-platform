"use client";

import { useWizard } from "./wizard-context";
import { Check } from "lucide-react";

export function StepIndicator() {
  const { state, steps, dispatch } = useWizard();
  const { currentStep, planConfirmed } = state;

  return (
    <div className="mb-8">
      {/* Mobile: compact indicator */}
      <div className="flex items-center justify-between md:hidden">
        <span className="text-xs font-medium text-[var(--platform-text)]/60">
          Passo {currentStep + 1} de {steps.length}
        </span>
        <span className="text-sm font-semibold text-[var(--platform-text)]">
          {steps[currentStep]?.label}
        </span>
      </div>

      {/* Desktop: full progress bar */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isClickable = isCompleted || (index === 0 && !planConfirmed);

            return (
              <div key={step.id} className="flex items-center gap-2">
                {/* Step circle */}
                <button
                  onClick={() => isClickable && dispatch({ type: "SET_STEP", step: index })}
                  disabled={!isClickable}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
                      : isCompleted
                        ? "bg-[#22D3EE] text-[#0B1020]"
                        : "border border-white/20 bg-white/[0.04] text-[var(--platform-text)]/50"
                  } ${isClickable ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                </button>

                {/* Step label */}
                <div className={`${index === steps.length - 1 ? "" : "min-w-[80px]"}`}>
                  <p
                    className={`text-xs font-semibold ${
                      isActive ? "text-[var(--platform-text)]" : "text-[var(--platform-text)]/50"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-[var(--platform-text)]/40">{step.subtitle}</p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="mx-1 h-[2px] w-6 rounded-full bg-white/10 lg:w-10">
                    <div
                      className={`h-full rounded-full bg-[#22D3EE] transition-all duration-300 ${
                        isCompleted ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar (mobile) */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10 md:hidden">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#3B82F6,#7C5CFF,#22D3EE)] transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
