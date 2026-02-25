"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, Type, MousePointer2, Lock, Pipette } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { SectionPremiumToggle } from "../premium-step-toggle";
import { palettePresets, type PalettePreset } from "@/lib/onboarding/palettes";
import { isFeatureUnlocked } from "@/lib/onboarding/premium-gate";

type FontOption = {
  family: string;
  label: string;
  style: string;
  premium: boolean;
};

const fontOptions: FontOption[] = [
  { family: "Inter", label: "Inter", style: "Moderna e limpa", premium: false },
  { family: "Sora", label: "Sora", style: "Tecnológica e futurista", premium: false },
  { family: "Poppins", label: "Poppins", style: "Amigável e arredondada", premium: true },
  { family: "Playfair Display", label: "Playfair", style: "Elegante e clássica", premium: true },
  { family: "Montserrat", label: "Montserrat", style: "Geométrica e profissional", premium: true },
  { family: "Lora", label: "Lora", style: "Tradicional e confiável", premium: true },
];

const buttonStyles: { id: "rounded" | "pill" | "square"; label: string; preview: string }[] = [
  { id: "rounded", label: "Arredondado", preview: "rounded-lg" },
  { id: "pill", label: "Pill", preview: "rounded-full" },
  { id: "square", label: "Quadrado", preview: "rounded-none" },
];

function PaletteCard({
  palette,
  isSelected,
  onSelect,
}: {
  palette: PalettePreset;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-xl border p-3 transition-all ${
        isSelected
          ? "border-[#22D3EE]/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex gap-1 mb-2">
        <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: palette.primary }} />
        <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: palette.accent }} />
        <div className="h-8 w-8 rounded-lg border border-white/10" style={{ backgroundColor: palette.background }} />
        <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: palette.text }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--platform-text)]">{palette.name}</span>
        {isSelected && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3EE]">
            <Check size={10} strokeWidth={3} className="text-[#0B1020]" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

function CustomColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 rounded cursor-pointer border border-white/10 bg-transparent"
      />
      <div className="flex-1">
        <span className="text-xs text-[var(--platform-text)]/50">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-mono text-[var(--platform-text)] focus:border-[#22D3EE] focus:outline-none"
        />
      </div>
    </div>
  );
}

function usePremiumHint(message: string) {
  const [hint, setHint] = useState("");
  const showHint = useCallback(() => {
    setHint(message);
    setTimeout(() => setHint(""), 2500);
  }, [message]);
  return { hint, showHint };
}

export function StylePaletteStep() {
  const { state, dispatch } = useWizard();
  const { paletteId, fontFamily, buttonStyle, selectedPlan, addonsSelected, customColors } = state;

  const plan = selectedPlan || "construir";
  const hasCustomColors = isFeatureUnlocked("custom-colors", plan, addonsSelected);
  const hasPremiumFonts = isFeatureUnlocked("premium-fonts", plan, addonsSelected);
  const { hint: paletaHint, showHint: showPaletaHint } = usePremiumHint("Ative o Premium Paleta para desbloquear cores personalizadas");
  const { hint: tipoHint, showHint: showTipoHint } = usePremiumHint("Ative o Premium Tipografia para desbloquear esta fonte");

  function handleSelectCustomColors() {
    if (hasCustomColors) {
      dispatch({ type: "SET_PALETTE", id: "custom" });
    } else {
      showPaletaHint();
    }
  }

  function handleSelectFont(font: FontOption) {
    if (!font.premium || hasPremiumFonts) {
      dispatch({ type: "SET_FONT", family: font.family });
    } else {
      showTipoHint();
    }
  }

  const activeHint = paletaHint || tipoHint;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Estilo visual
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Defina a identidade do seu site
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Escolha cores e tipografia que representam seu negócio.
        </p>
      </div>

      {/* Toast hint */}
      <AnimatePresence>
        {activeHint && (
          <motion.div
            key={activeHint}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mb-4 rounded-lg border border-[#A78BFA]/30 bg-[#7C5CFF]/10 px-4 py-2 text-center text-xs text-[#A78BFA]"
          >
            {activeHint}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Color Palette */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/20">
              <Palette size={16} className="text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Paleta de cores
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                As cores e o estilo visual do seu site
              </p>
            </div>
          </div>

          {/* Toggle for palette premium */}
          <SectionPremiumToggle sectionId="premium-paleta" />

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {palettePresets.map((palette) => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                isSelected={paletteId === palette.id}
                onSelect={() => dispatch({ type: "SET_PALETTE", id: palette.id })}
              />
            ))}

            {/* Custom colors option */}
            <motion.button
              onClick={handleSelectCustomColors}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-xl border p-3 transition-all ${
                paletteId === "custom"
                  ? "border-[#22D3EE]/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  : !hasCustomColors
                  ? "border-white/5 opacity-50 hover:opacity-70"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="flex h-8 w-full items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.04]">
                  {!hasCustomColors ? (
                    <Lock size={14} className="text-[#A78BFA]" />
                  ) : (
                    <Pipette size={14} className="text-[var(--platform-text)]/50" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--platform-text)]">
                  Personalizar
                </span>
                {paletteId === "custom" && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3EE]">
                    <Check size={10} strokeWidth={3} className="text-[#0B1020]" />
                  </div>
                )}
              </div>
            </motion.button>
          </div>

          {/* Custom color inputs */}
          {paletteId === "custom" && hasCustomColors && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <CustomColorInput
                label="Primária"
                value={customColors.primary}
                onChange={(val) => dispatch({ type: "SET_CUSTOM_COLOR", key: "primary", value: val })}
              />
              <CustomColorInput
                label="Accent"
                value={customColors.accent}
                onChange={(val) => dispatch({ type: "SET_CUSTOM_COLOR", key: "accent", value: val })}
              />
              <CustomColorInput
                label="Fundo"
                value={customColors.background}
                onChange={(val) => dispatch({ type: "SET_CUSTOM_COLOR", key: "background", value: val })}
              />
              <CustomColorInput
                label="Texto"
                value={customColors.text}
                onChange={(val) => dispatch({ type: "SET_CUSTOM_COLOR", key: "text", value: val })}
              />
            </div>
          )}
        </div>

        {/* Font Family */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22D3EE]/20">
              <Type size={16} className="text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Tipografia
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                A fonte principal do seu site
              </p>
            </div>
          </div>

          {/* Toggle for typography premium */}
          <SectionPremiumToggle sectionId="premium-tipografia" />

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {fontOptions.map((font) => {
              const isLocked = font.premium && !hasPremiumFonts;
              return (
                <button
                  key={font.family}
                  onClick={() => handleSelectFont(font)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    fontFamily === font.family
                      ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                      : isLocked
                      ? "border-white/5 bg-white/[0.01] opacity-50 hover:opacity-70"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div>
                    <p
                      className="font-semibold text-[var(--platform-text)]"
                      style={{ fontFamily: font.family }}
                    >
                      {font.label}
                    </p>
                    <p className="text-xs text-[var(--platform-text)]/50">{font.style}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isLocked && <Lock size={12} className="text-[#A78BFA]" />}
                    {fontFamily === font.family && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22D3EE]">
                        <Check size={12} strokeWidth={3} className="text-[#0B1020]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Button Style */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F472B6]/20">
              <MousePointer2 size={16} className="text-[#F472B6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Estilo dos botões
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                Como seus botões vão aparecer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {buttonStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => dispatch({ type: "SET_BUTTON_STYLE", style: style.id })}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  buttonStyle === style.id
                    ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div
                  className={`h-6 w-16 bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] ${style.preview}`}
                />
                <span className="text-sm font-medium text-[var(--platform-text)]">
                  {style.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={!!(paletteId || paletteId === "custom")} />
    </div>
  );
}
