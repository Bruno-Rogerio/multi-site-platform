"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  Layers,
  Lock,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { SectionPremiumToggle } from "../premium-step-toggle";
import { ImageUpload } from "../builders/image-upload";
import {
  heroVariants,
  servicesVariants,
  ctaVariants,
  motionStyles,
} from "@/lib/onboarding/section-styles";
import { ctaTypes } from "@/lib/onboarding/cta-types";
import type { CtaTypeId, OnboardingPlan } from "@/lib/onboarding/types";
import { basicIconPack, premiumIconPack } from "@/lib/onboarding/icon-packs";
import {
  isFeatureUnlocked,
  getServiceCardsLimit,
  getCtaTypesLimit,
  getFloatingCtaSlotsLimit,
} from "@/lib/onboarding/premium-gate";
import * as LucideIcons from "lucide-react";

/* ─── Premium hint hook ─── */

function usePremiumHint(message: string) {
  const [hint, setHint] = useState("");
  const showHint = useCallback(() => {
    setHint(message);
    setTimeout(() => setHint(""), 2500);
  }, [message]);
  return { hint, showHint };
}

/* ─── Sub-components ─── */

function VariantSelector({
  label,
  variants,
  selectedId,
  onSelect,
  plan,
  addons,
  featureId,
  onLocked,
}: {
  label: string;
  variants: Array<{ id: string; name: string; description?: string; premium?: boolean }>;
  selectedId: string;
  onSelect: (id: string) => void;
  plan: OnboardingPlan | null;
  addons: string[];
  featureId: string;
  onLocked: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="relative">
      <label className="text-xs font-medium text-[var(--platform-text)]/60 mb-1 block">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-[var(--platform-text)] transition hover:border-white/20"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#22D3EE]/10 text-[9px] font-bold text-[#22D3EE]">
            {(selected?.name || "?")[0]}
          </span>
          <div className="text-left">
            <span className="block text-sm leading-tight">{selected?.name || "Selecionar"}</span>
            {selected?.description && (
              <span className="block text-[10px] text-[var(--platform-text)]/40 leading-tight">{selected.description}</span>
            )}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-white/10 bg-[#1A2035] p-1 shadow-xl"
          >
            {variants.map((variant) => {
              const locked = variant.premium && !isFeatureUnlocked(featureId as Parameters<typeof isFeatureUnlocked>[0], plan, addons);
              return (
                <button
                  key={variant.id}
                  onClick={() => {
                    if (locked) {
                      onLocked();
                      setIsOpen(false);
                    } else {
                      onSelect(variant.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left transition ${
                    selectedId === variant.id
                      ? "bg-[#22D3EE]/20"
                      : locked
                      ? "opacity-50 hover:opacity-70 cursor-pointer"
                      : "hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold ${
                      selectedId === variant.id
                        ? "bg-[#22D3EE]/30 text-[#22D3EE]"
                        : "bg-white/10 text-[var(--platform-text)]/60"
                    }`}
                  >
                    {variant.name[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-sm leading-tight ${
                        selectedId === variant.id ? "text-[#22D3EE]" : "text-[var(--platform-text)]"
                      }`}
                    >
                      {variant.name}
                    </span>
                    {variant.description && (
                      <span className="block text-[10px] text-[var(--platform-text)]/40 leading-tight truncate">
                        {variant.description}
                      </span>
                    )}
                  </div>
                  {locked && <Lock size={12} className="shrink-0 text-[#A78BFA]" />}
                  {selectedId === variant.id && (
                    <Check size={14} className="shrink-0 text-[#22D3EE]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CtaTypeSelector({
  selectedTypes,
  onToggle,
  onConfigChange,
  ctaConfig,
  plan,
  addons,
  onLocked,
}: {
  selectedTypes: CtaTypeId[];
  onToggle: (id: CtaTypeId) => void;
  onConfigChange: (id: CtaTypeId, url: string) => void;
  ctaConfig: Partial<Record<CtaTypeId, { label: string; url: string }>>;
  plan: OnboardingPlan | null;
  addons: string[];
  onLocked: () => void;
}) {
  const maxCtas = getCtaTypesLimit(plan, addons);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-[var(--platform-text)]">
            Canais de contato
          </h4>
          <p className="text-xs text-[var(--platform-text)]/50">
            {selectedTypes.length}/{maxCtas} selecionados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ctaTypes.map((cta) => {
          const isSelected = selectedTypes.includes(cta.id);
          const canSelect = isSelected || selectedTypes.length < maxCtas;
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cta.icon];

          return (
            <button
              key={cta.id}
              onClick={() => {
                if (canSelect) {
                  onToggle(cta.id);
                } else {
                  onLocked();
                }
              }}
              className={`flex items-center gap-2 rounded-lg border p-3 transition ${
                isSelected
                  ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                  : canSelect
                  ? "border-white/10 bg-white/[0.02] hover:border-white/20"
                  : "border-white/5 bg-white/[0.01] opacity-50 hover:opacity-70 cursor-pointer"
              }`}
            >
              {Icon && <Icon size={18} className={isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]/60"} />}
              <span className={`text-sm ${isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}>
                {cta.label}
              </span>
              {isSelected && (
                <Check size={14} className="ml-auto text-[#22D3EE]" />
              )}
              {!canSelect && !isSelected && (
                <Lock size={12} className="ml-auto text-[#A78BFA]" />
              )}
            </button>
          );
        })}
      </div>

      {/* CTA Configuration inputs for selected types */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">
            Configure seus canais
          </p>
          {selectedTypes.map((ctaId) => {
            const ctaType = ctaTypes.find((c) => c.id === ctaId);
            if (!ctaType) return null;
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[ctaType.icon];
            const currentValue = ctaConfig[ctaId]?.url || "";

            return (
              <div key={ctaId} className="flex items-center gap-2">
                {Icon && <Icon size={16} className="text-[#22D3EE] shrink-0" />}
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--platform-text)]/40">
                    {ctaType.urlPrefix}
                  </span>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => onConfigChange(ctaId, e.target.value)}
                    placeholder={ctaType.placeholder}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-[140px] pr-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                    style={{ paddingLeft: `${ctaType.urlPrefix.length * 7 + 16}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IconPicker({
  selectedIcon,
  onSelect,
  plan,
  addons,
  onLocked,
}: {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  plan: OnboardingPlan | null;
  addons: string[];
  onLocked: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasPremiumIcons = isFeatureUnlocked("premium-icon-pack", plan, addons);

  const allIcons = hasPremiumIcons
    ? premiumIconPack
    : basicIconPack;

  const SelectedIconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[selectedIcon];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition hover:border-white/20"
      >
        {SelectedIconComponent ? (
          <SelectedIconComponent size={18} className="text-[var(--platform-text)]" />
        ) : (
          <Plus size={18} className="text-[var(--platform-text)]/50" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 z-20 mt-2 w-72 rounded-xl border border-white/10 bg-[#1A2035] p-3 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--platform-text)]/60">
                Escolha um ícone
              </span>
              {!hasPremiumIcons && (
                <button
                  onClick={() => {
                    onLocked();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-[#A78BFA]"
                >
                  <Sparkles size={10} />
                  +60 ícones
                </button>
              )}
            </div>

            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
              {allIcons.map((icon) => {
                const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon.name];
                const isInBasicPack = basicIconPack.some((i) => i.name === icon.name);
                const isPremium = !isInBasicPack && !hasPremiumIcons;

                return (
                  <button
                    key={icon.name}
                    onClick={() => {
                      if (!isPremium) {
                        onSelect(icon.name);
                        setIsOpen(false);
                      }
                    }}
                    disabled={isPremium}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      selectedIcon === icon.name
                        ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                        : isPremium
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-white/[0.06] text-[var(--platform-text)]"
                    }`}
                  >
                    {IconComponent && <IconComponent size={16} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceCardEditor({
  index,
  card,
  plan,
  addons,
  dispatch,
  onLocked,
}: {
  index: number;
  card: { title: string; description: string; iconName: string; icon?: string; imageUrl?: string };
  plan: OnboardingPlan | null;
  addons: string[];
  dispatch: ReturnType<typeof useWizard>["dispatch"];
  onLocked: () => void;
}) {
  const iconKey = card.icon || card.iconName;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 pt-1">
        <GripVertical size={14} className="text-[var(--platform-text)]/30 cursor-grab" />
        <IconPicker
          selectedIcon={iconKey}
          onSelect={(icon) =>
            dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { icon, iconName: icon } })
          }
          plan={plan}
          addons={addons}
          onLocked={onLocked}
        />
      </div>

      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={card.title}
          onChange={(e) =>
            dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { title: e.target.value } })
          }
          placeholder="Título do serviço"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
        <textarea
          value={card.description}
          onChange={(e) =>
            dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { description: e.target.value } })
          }
          placeholder="Descrição breve..."
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
        />

        {/* Inline image upload for service card */}
        <ImageUpload
          label="Imagem (opcional)"
          value={card.imageUrl || ""}
          onChange={(url) =>
            dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { imageUrl: url } })
          }
          slot={`serviceCard-${index}`}
          aspectRatio="16/9"
          description="Imagem para este card de serviço"
        />
      </div>
    </div>
  );
}

/* ─── Main step ─── */

export function SectionBuilderStep() {
  const { state, dispatch } = useWizard();
  const {
    selectedPlan,
    addonsSelected,
    heroVariant,
    servicesVariant,
    ctaVariant,
    motionStyle,
    selectedCtaTypes,
    serviceCards,
    floatingCtaEnabled,
    ctaConfig,
  } = state;

  const plan = selectedPlan || "construir";
  const maxCards = getServiceCardsLimit(plan, addonsSelected);
  const maxFloatingCtas = getFloatingCtaSlotsLimit(plan, addonsSelected);
  const { hint: variantesHint, showHint: showVariantesHint } = usePremiumHint("Ative o Premium Variantes para desbloquear layouts premium");
  const { hint: canaisHint, showHint: showCanaisHint } = usePremiumHint("Ative o Premium Canais para desbloquear mais canais e botão flutuante");
  const { hint: cardsHint, showHint: showCardsHint } = usePremiumHint("Ative o Premium Cards para desbloquear mais cards e ícones premium");
  const activeHint = variantesHint || canaisHint || cardsHint;

  function handleToggleCta(ctaId: CtaTypeId) {
    dispatch({ type: "TOGGLE_CTA_TYPE", ctaTypeId: ctaId });
  }

  function handleCtaConfigChange(ctaId: CtaTypeId, url: string) {
    const ctaType = ctaTypes.find((c) => c.id === ctaId);
    dispatch({
      type: "SET_CTA_CONFIG",
      ctaTypeId: ctaId,
      config: { label: ctaType?.label || ctaId, url },
    });
  }

  function handleAddServiceCard() {
    if (serviceCards.length < maxCards) {
      dispatch({ type: "ADD_SERVICE_CARD" });
    } else {
      showCardsHint();
    }
  }

  function handleRemoveServiceCard(index: number) {
    dispatch({ type: "REMOVE_SERVICE_CARD", index });
  }

  function handleToggleFloatingCta() {
    if (floatingCtaEnabled || isFeatureUnlocked("floating-cta", plan, addonsSelected)) {
      dispatch({ type: "SET_FLOATING_CTA", enabled: !floatingCtaEnabled });
    } else {
      showCanaisHint();
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Seções e componentes
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Monte a estrutura do seu site
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Configure cada seção, escolha os ícones e defina seus canais de contato.
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

      <div className="space-y-6">
        {/* Section Variants */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFF]/20">
              <Layers size={16} className="text-[#A78BFA]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Variantes de seção
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                Escolha o layout de cada seção
              </p>
            </div>
          </div>

          {/* Toggle for variants premium */}
          <SectionPremiumToggle sectionId="premium-variantes" />

          <div className="grid gap-4 sm:grid-cols-2">
            <VariantSelector
              label="Hero"
              variants={heroVariants}
              selectedId={heroVariant}
              onSelect={(id) => dispatch({ type: "SET_HERO_VARIANT", variant: id })}
              plan={plan}
              addons={addonsSelected}
              featureId="premium-hero-variants"
              onLocked={showVariantesHint}
            />
            <VariantSelector
              label="Serviços"
              variants={servicesVariants}
              selectedId={servicesVariant}
              onSelect={(id) => dispatch({ type: "SET_SERVICES_VARIANT", variant: id })}
              plan={plan}
              addons={addonsSelected}
              featureId="premium-services-variants"
              onLocked={showVariantesHint}
            />
            <VariantSelector
              label="Call to Action"
              variants={ctaVariants}
              selectedId={ctaVariant}
              onSelect={(id) => dispatch({ type: "SET_CTA_VARIANT", variant: id })}
              plan={plan}
              addons={addonsSelected}
              featureId="premium-cta-variants"
              onLocked={showVariantesHint}
            />
            <VariantSelector
              label="Animações"
              variants={motionStyles}
              selectedId={motionStyle}
              onSelect={(id) => dispatch({ type: "SET_MOTION_STYLE", style: id })}
              plan={plan}
              addons={addonsSelected}
              featureId="advanced-motion"
              onLocked={showVariantesHint}
            />
          </div>
        </div>

        {/* CTA Types */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">Canais de contato</h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">Defina como seus clientes entram em contato</p>

          {/* Toggle for channels premium */}
          <SectionPremiumToggle sectionId="premium-canais" />

          <CtaTypeSelector
            selectedTypes={selectedCtaTypes}
            onToggle={handleToggleCta}
            onConfigChange={handleCtaConfigChange}
            ctaConfig={ctaConfig}
            plan={plan}
            addons={addonsSelected}
            onLocked={showCanaisHint}
          />

          {/* Floating CTA toggle */}
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--platform-text)]">
                  Botão flutuante
                </p>
                <p className="text-xs text-[var(--platform-text)]/50">
                  Aparece fixo no canto da tela
                  {plan === "premium-full" ? " (até 2)" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isFeatureUnlocked("floating-cta", plan, addonsSelected) && (
                  <Lock size={12} className="text-[#A78BFA]" />
                )}
                <button
                  onClick={handleToggleFloatingCta}
                  className={`relative h-6 w-11 rounded-full transition ${
                    floatingCtaEnabled ? "bg-[#22D3EE]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      floatingCtaEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Floating channel selector (shown when enabled) */}
            {floatingCtaEnabled && selectedCtaTypes.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-[var(--platform-text)]/50 mb-2">
                  Canais no botão flutuante ({state.floatingCtaChannels.length}/{maxFloatingCtas})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCtaTypes.map((ctaId) => {
                    const ctaDef = ctaTypes.find((c) => c.id === ctaId);
                    if (!ctaDef) return null;
                    const isInFloating = state.floatingCtaChannels.includes(ctaId);
                    const canAdd = isInFloating || state.floatingCtaChannels.length < maxFloatingCtas;
                    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[ctaDef.icon];

                    return (
                      <button
                        key={ctaId}
                        onClick={() => {
                          if (isInFloating) {
                            dispatch({
                              type: "SET_FLOATING_CTA_CHANNELS",
                              channels: state.floatingCtaChannels.filter((id) => id !== ctaId),
                            });
                          } else if (canAdd) {
                            dispatch({
                              type: "SET_FLOATING_CTA_CHANNELS",
                              channels: [...state.floatingCtaChannels, ctaId],
                            });
                          }
                        }}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                          isInFloating
                            ? "border-[#22D3EE]/50 bg-[#22D3EE]/10 text-[#22D3EE]"
                            : canAdd
                            ? "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"
                            : "border-white/5 text-[var(--platform-text)]/30 cursor-not-allowed"
                        }`}
                      >
                        {Icon && <Icon size={12} />}
                        {ctaDef.label}
                        {isInFloating && <Check size={10} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Cards */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          {/* Toggle for cards premium */}
          <SectionPremiumToggle sectionId="premium-cards" />

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Cards de serviço
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                {serviceCards.length}/{maxCards} cards
              </p>
            </div>
            <button
              onClick={handleAddServiceCard}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--platform-text)] transition hover:bg-white/[0.08]"
            >
              <Plus size={14} />
              Adicionar
              {serviceCards.length >= maxCards && (
                <Lock size={10} className="ml-1 text-[#A78BFA]" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {serviceCards.map((card, index) => (
              <div key={index} className="relative">
                <ServiceCardEditor
                  index={index}
                  card={card}
                  plan={plan}
                  addons={addonsSelected}
                  dispatch={dispatch}
                  onLocked={showCardsHint}
                />
                {serviceCards.length > 1 && (
                  <button
                    onClick={() => handleRemoveServiceCard(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition hover:bg-red-500/30"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={selectedCtaTypes.length > 0} />
    </div>
  );
}
