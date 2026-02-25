"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { templatePresets, getTemplateBySlug, type TemplatePreset } from "@/lib/onboarding/templates";

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: TemplatePreset;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { previewColors } = template;

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border text-left transition-all ${
        isSelected
          ? "border-[#22D3EE]/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* Preview mockup */}
      <div
        className="h-40 p-3"
        style={{ backgroundColor: previewColors.bg }}
      >
        {/* Mini header */}
        <div className="flex items-center justify-between rounded-lg px-2 py-1" style={{ backgroundColor: `${previewColors.primary}15` }}>
          <div className="h-2 w-12 rounded-full" style={{ backgroundColor: previewColors.primary }} />
          <div className="flex gap-1">
            <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: `${previewColors.text}30` }} />
            <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: `${previewColors.text}20` }} />
          </div>
        </div>

        {/* Mini hero */}
        <div className="mt-2 space-y-1.5 p-2">
          <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: previewColors.accent }} />
          <div className="h-2.5 w-24 rounded-full" style={{ backgroundColor: previewColors.text }} />
          <div className="h-1.5 w-20 rounded-full" style={{ backgroundColor: `${previewColors.text}50` }} />
          <div className="mt-2 h-4 w-14 rounded-md" style={{ backgroundColor: previewColors.primary }} />
        </div>

        {/* Mini services */}
        <div className="mt-2 grid grid-cols-3 gap-1 px-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded-md"
              style={{ backgroundColor: `${previewColors.text}08`, border: `1px solid ${previewColors.text}15` }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-[#12182B]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-[var(--platform-text)]">{template.name}</h3>
            <p className="text-xs text-[#22D3EE]">{template.category}</p>
          </div>
          {/* Selection indicator */}
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
              isSelected
                ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B1020]"
                : "border-white/20"
            }`}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[var(--platform-text)]/50">
          {template.description}
        </p>
      </div>
    </motion.button>
  );
}

export function TemplateGallery() {
  const { state, dispatch } = useWizard();
  const { selectedTemplateSlug } = state;

  function handleSelectTemplate(slug: string) {
    dispatch({ type: "SELECT_TEMPLATE", slug });

    // Apply template visual settings immediately so preview updates
    const template = getTemplateBySlug(slug);
    if (template) {
      dispatch({ type: "SET_PALETTE", id: template.paletteId });
      dispatch({ type: "SET_HERO_VARIANT", variant: template.heroVariant });
      dispatch({ type: "SET_SERVICES_VARIANT", variant: template.servicesVariant });
      dispatch({ type: "SET_CTA_VARIANT", variant: template.ctaVariant });
      dispatch({ type: "SET_FONT", family: template.fontFamily });
      dispatch({ type: "SET_BUTTON_STYLE", style: template.buttonStyle });
      dispatch({ type: "SET_MOTION_STYLE", style: template.motionStyle });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Escolha o template
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Layouts prontos para seu negócio
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Cada template foi criado pensando em um tipo de profissional. Escolha o que
          mais combina com você e personalize o conteúdo.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templatePresets.map((template) => (
          <TemplateCard
            key={template.slug}
            template={template}
            isSelected={selectedTemplateSlug === template.slug}
            onSelect={() => handleSelectTemplate(template.slug)}
          />
        ))}
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={!!selectedTemplateSlug} />
    </div>
  );
}
