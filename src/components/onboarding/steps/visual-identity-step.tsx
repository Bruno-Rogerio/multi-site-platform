"use client";

import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Check, Wand2, Sparkles, ChevronRight } from "lucide-react";
import { useWizard } from "../wizard-context";
import { generateTheme, type VisualTone, type VisualPersonality, type VisualMotion } from "@/lib/onboarding/theme-generator";

/* ─── Swatches ─── */

const COLOR_SWATCHES = [
  { hex: "#3B82F6", name: "Azul" },
  { hex: "#7C5CFF", name: "Roxo" },
  { hex: "#22D3EE", name: "Ciano" },
  { hex: "#10B981", name: "Verde" },
  { hex: "#F59E0B", name: "Âmbar" },
  { hex: "#EF4444", name: "Vermelho" },
  { hex: "#EC4899", name: "Rosa" },
  { hex: "#6B7280", name: "Cinza" },
];

/* ─── Options ─── */

const TONE_OPTIONS: { id: VisualTone; label: string; description: string; previewBg: string; previewText: string }[] = [
  { id: "dark",    label: "Escuro",  description: "Sofisticado e moderno", previewBg: "#0B1020", previewText: "#EAF0FF" },
  { id: "light",   label: "Claro",   description: "Limpo e acessível",     previewBg: "#F8FAFF", previewText: "#1A2040" },
  { id: "neutral", label: "Neutro",  description: "Equilibrado e sóbrio",  previewBg: "#12182B", previewText: "#E8EEFF" },
];

const PERSONALITY_OPTIONS: {
  id: VisualPersonality;
  label: string;
  description: string;
  font: string;
  radius: string;
}[] = [
  { id: "clean",    label: "Limpo",    description: "Direto e profissional", font: "Inter",            radius: "8px"  },
  { id: "bold",     label: "Ousado",   description: "Marcante e impactante", font: "Sora",             radius: "20px" },
  { id: "elegant",  label: "Elegante", description: "Refinado e clássico",   font: "Playfair Display", radius: "0px"  },
  { id: "friendly", label: "Amigável", description: "Caloroso e próximo",    font: "Poppins",          radius: "16px" },
];

const MOTION_OPTIONS: { id: VisualMotion; label: string; description: string }[] = [
  { id: "none",   label: "Sem animação", description: "Estático, carrega mais rápido" },
  { id: "subtle", label: "Suave",        description: "Fade discreto nas seções" },
  { id: "lively", label: "Vivo",         description: "Animações visuais marcantes" },
];

/* ─── Section options ─── */

const SECTION_OPTIONS: {
  id: string;
  label: string;
  description: string;
  emoji: string;
  mandatory?: boolean;
  defaultOn?: boolean;
}[] = [
  { id: "hero",         label: "Hero",             description: "Banner principal",        emoji: "🎯", mandatory: true },
  { id: "services",     label: "Serviços",          description: "O que você oferece",       emoji: "🧩", defaultOn: true },
  { id: "about",        label: "Sobre mim",         description: "Sua história",            emoji: "👤", defaultOn: true },
  { id: "stats",        label: "Números",            description: "Estatísticas e conquistas", emoji: "📊", defaultOn: false },
  { id: "testimonials", label: "Depoimentos",        description: "O que clientes dizem",    emoji: "⭐", defaultOn: true },
  { id: "cta",          label: "CTA",               description: "Chamada para ação",       emoji: "📣", defaultOn: true },
  { id: "contact",      label: "Contato",           description: "Formas de falar com você", emoji: "📞", mandatory: true },
  { id: "blog",         label: "Blog / Artigos",    description: "Conteúdos e posts",       emoji: "📝", defaultOn: false },
  { id: "gallery",      label: "Galeria",           description: "Fotos e portfólio",       emoji: "🖼️", defaultOn: false },
  { id: "faq",          label: "FAQ",               description: "Perguntas frequentes",    emoji: "❓", defaultOn: false },
  { id: "events",       label: "Agenda",            description: "Eventos e datas",         emoji: "📅", defaultOn: false },
];

/* ─── Loading messages ─── */

const LOADING_STEPS = [
  "Analisando suas escolhas...",
  "Gerando paleta de cores...",
  "Definindo tipografia e estilo...",
  "Construindo seu layout...",
];

/* ─── Component ─── */

export function VisualIdentityStep() {
  const { state, dispatch } = useWizard();
  const { visualPrimaryColor, visualTone, visualPersonality, visualMotion } = state;

  const [primaryColor, setPrimaryColor] = useState(visualPrimaryColor || "#3B82F6");
  const [tone, setTone] = useState<VisualTone>(visualTone || "dark");
  const [personality, setPersonality] = useState<VisualPersonality>(visualPersonality || "clean");
  const [motion, setMotion] = useState<VisualMotion>(visualMotion || "subtle");

  // Section selection — initialize from existing wizard state or defaults
  const [selectedSections, setSelectedSections] = useState<string[]>(() => {
    if (state.enabledSections.length > 0) return state.enabledSections;
    return SECTION_OPTIONS.filter(s => s.mandatory || s.defaultOn).map(s => s.id);
  });

  // Loading overlay state
  const [showLoading, setShowLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const preview = generateTheme(primaryColor, tone, personality, motion);

  // Apply on every change so the wizard preview updates live
  function onColorChange(hex: string) {
    setPrimaryColor(hex);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor: hex, tone, personality, motion });
  }
  function onToneChange(t: VisualTone) {
    setTone(t);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor, tone: t, personality, motion });
  }
  function onPersonalityChange(p: VisualPersonality) {
    setPersonality(p);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor, tone, personality: p, motion });
  }
  function onMotionChange(m: VisualMotion) {
    setMotion(m);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor, tone, personality, motion: m });
  }

  function toggleSection(id: string) {
    const isOn = selectedSections.includes(id);
    const newSelected = isOn
      ? selectedSections.filter(s => s !== id)
      : [...selectedSections, id];
    setSelectedSections(newSelected);

    if (isOn) {
      dispatch({ type: "REMOVE_SECTION", sectionType: id });
    } else {
      // Re-insert maintaining canonical SECTION_OPTIONS order so section appears in the right spot in preview
      const canonicalOrder = SECTION_OPTIONS.map(s => s.id);
      const reordered = canonicalOrder.filter(s => newSelected.includes(s));
      dispatch({ type: "REORDER_SECTIONS", sections: reordered });
    }
  }

  function handleContinue() {
    setShowLoading(true);
    setLoadingPhase(0);

    // Sequence: 0ms→phase 0, 1000ms→phase 1, 2000ms→phase 2, 3000ms→phase 3, 4200ms→done
    const phaseDelays = [1000, 2000, 3000, 4200];
    phaseDelays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (i < phaseDelays.length - 1) {
          setLoadingPhase(i + 1);
        } else {
          // Build ordered sections: hero first, non-mandatory in SECTION_OPTIONS order, contact last
          const ordered = [
            "hero",
            ...SECTION_OPTIONS
              .filter(s => !s.mandatory && selectedSections.includes(s.id))
              .map(s => s.id),
            "contact",
          ];
          dispatch({ type: "REORDER_SECTIONS", sections: ordered });
          // Short pause to show "Pronto!" before advancing
          const finalT = setTimeout(() => {
            dispatch({ type: "NEXT_STEP" });
          }, 600);
          timersRef.current.push(finalT);
        }
      }, delay);
      timersRef.current.push(t);
    });
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const allDone = loadingPhase >= LOADING_STEPS.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Identidade visual
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          4 escolhas. Tema completo.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          O sistema gera sua paleta, tipografia e estilo automaticamente a partir das suas preferências.
        </p>
      </div>

      <div className="space-y-8">

        {/* 1. Cor da marca */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            1. Cor da sua marca
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            A cor principal que vai aparecer nos botões e destaques
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {COLOR_SWATCHES.map((s) => (
              <button
                key={s.hex}
                onClick={() => onColorChange(s.hex)}
                title={s.name}
                className="relative h-9 w-9 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: s.hex,
                  borderColor: primaryColor === s.hex ? "#fff" : "transparent",
                  boxShadow: primaryColor === s.hex ? `0 0 0 2px ${s.hex}` : "none",
                }}
              >
                {primaryColor === s.hex && (
                  <Check size={14} strokeWidth={3} className="absolute inset-0 m-auto text-white drop-shadow" />
                )}
              </button>
            ))}

            {/* Native color picker */}
            <label
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-white/30 transition hover:border-white/60"
              title="Escolher cor personalizada"
              style={{
                backgroundColor: COLOR_SWATCHES.some((s) => s.hex === primaryColor) ? "transparent" : primaryColor,
              }}
            >
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="sr-only"
              />
              {!COLOR_SWATCHES.some((s) => s.hex === primaryColor) ? (
                <Check size={14} strokeWidth={3} className="text-white drop-shadow" />
              ) : (
                <span className="text-[10px] text-white/60">+</span>
              )}
            </label>

            {/* Hex input */}
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(v)) onColorChange(v);
                else setPrimaryColor(v);
              }}
              maxLength={7}
              className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-[var(--platform-text)] focus:border-[#22D3EE] focus:outline-none"
            />
          </div>
        </section>

        {/* 2. Tom geral */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            2. Tom geral
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            O esquema de fundo e contraste do site
          </p>

          <div className="flex flex-wrap gap-3">
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onToneChange(opt.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  tone === opt.id
                    ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div
                  className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: opt.previewBg, border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="text-[10px] font-bold" style={{ color: opt.previewText }}>Aa</span>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${tone === opt.id ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-[var(--platform-text)]/50">{opt.description}</p>
                </div>
                {tone === opt.id && (
                  <div className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]">
                    <Check size={11} strokeWidth={3} className="text-[#0B1020]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Personalidade */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            3. Personalidade visual
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            Define fonte, forma dos botões e ritmo visual do site
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onPersonalityChange(opt.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  personality === opt.id
                    ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold leading-tight ${
                      personality === opt.id ? "text-[#22D3EE]" : "text-[var(--platform-text)]"
                    }`}
                    style={{ fontFamily: opt.font }}
                  >
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">{opt.description}</p>
                  <p className="mt-1.5 text-[10px] text-[var(--platform-text)]/30">{opt.font}</p>
                </div>
                <div
                  className="shrink-0 rounded px-3 py-1.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: primaryColor, borderRadius: opt.radius }}
                >
                  Botão
                </div>
                {personality === opt.id && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]">
                    <Check size={11} strokeWidth={3} className="text-[#0B1020]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Animações */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            4. Animações
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            Como as seções do site aparecem na tela
          </p>

          <div className="flex flex-wrap gap-3">
            {MOTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onMotionChange(opt.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  motion === opt.id
                    ? "border-[#22D3EE]/50 bg-[#22D3EE]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-left">
                  <p className={`text-sm font-semibold ${motion === opt.id ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-[var(--platform-text)]/50">{opt.description}</p>
                </div>
                {motion === opt.id && (
                  <div className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]">
                    <Check size={11} strokeWidth={3} className="text-[#0B1020]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 5. Seções do site */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            5. Seções do seu site
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            Escolha quais seções aparecem no seu site. As marcadas em cinza são obrigatórias.
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {SECTION_OPTIONS.map((s) => {
              const isSelected = s.mandatory || selectedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={s.mandatory}
                  onClick={() => !s.mandatory && toggleSection(s.id)}
                  className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                    s.mandatory
                      ? "cursor-default border-white/10 bg-white/[0.03] opacity-60"
                      : isSelected
                        ? "border-[#22D3EE]/40 bg-[#22D3EE]/8 cursor-pointer"
                        : "border-white/10 bg-white/[0.01] cursor-pointer hover:border-white/20"
                  }`}
                >
                  {/* Checkbox indicator */}
                  <div className={`absolute right-2.5 top-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    isSelected
                      ? s.mandatory
                        ? "border-white/20 bg-white/10"
                        : "border-[#22D3EE] bg-[#22D3EE]"
                      : "border-white/20 bg-transparent"
                  }`}>
                    {isSelected && <Check size={10} strokeWidth={3} className={s.mandatory ? "text-white/50" : "text-[#0B1020]"} />}
                  </div>

                  <span className="text-base leading-none">{s.emoji}</span>
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-[var(--platform-text)]" : "text-[var(--platform-text)]/50"}`}>
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/40 leading-tight">
                      {s.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] text-[var(--platform-text)]/30">
            {selectedSections.filter(s => !["hero", "contact"].includes(s)).length + 2} seções selecionadas
            {" · "}Você pode adicionar mais depois no painel
          </p>
        </section>

        {/* Live preview summary */}
        <Motion.div layout className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 size={16} className="text-[#A78BFA]" />
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">
              Tema gerado automaticamente
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.primaryColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.accentColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.backgroundColor }} />
              <span className="text-xs text-[var(--platform-text)]/50 ml-1">Cores</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold text-[var(--platform-text)]"
                style={{ fontFamily: preview.fontFamily }}
              >
                {preview.fontFamily.split(",")[0]}
              </span>
              <span className="text-xs text-[var(--platform-text)]/50">Fonte</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 text-[10px] font-bold text-white"
                style={{
                  backgroundColor: preview.primaryColor,
                  borderRadius: preview["--site-radius"],
                }}
              >
                CTA
              </div>
              <span className="text-xs text-[var(--platform-text)]/50">Botão</span>
            </div>
          </div>
        </Motion.div>
      </div>

      {/* Continue button */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="text-sm text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]/70"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#0B1020] shadow-lg transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: primaryColor, boxShadow: `0 4px 20px ${primaryColor}40` }}
        >
          <Sparkles size={15} />
          Gerar meu site
          <ChevronRight size={15} />
        </button>
      </div>

      {/* ─── Loading overlay ─── */}
      <AnimatePresence>
        {showLoading && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#06080F]"
          >
            {/* Background orbs using user's chosen color */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full blur-[120px]"
                style={{ backgroundColor: `${primaryColor}18` }}
              />
              <div
                className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full blur-[140px]"
                style={{ backgroundColor: `${primaryColor}10` }}
              />
              <div className="absolute left-[50%] top-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/8 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm px-6">
              {/* Icon */}
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-8 flex justify-center"
              >
                {allDone ? (
                  <Motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${primaryColor}20`, border: `2px solid ${primaryColor}60` }}
                  >
                    <Check size={32} strokeWidth={2.5} style={{ color: primaryColor }} />
                  </Motion.div>
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${primaryColor}15`, border: `1px solid ${primaryColor}30` }}
                  >
                    <Sparkles size={28} style={{ color: primaryColor }} className="animate-pulse" />
                  </div>
                )}
              </Motion.div>

              {/* Title */}
              <AnimatePresence mode="wait">
                {allDone ? (
                  <Motion.div
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                  >
                    <h2 className="text-2xl font-black text-[var(--platform-text)]">
                      Pronto! 🎉
                    </h2>
                    <p className="mt-1 text-sm text-[var(--platform-text)]/60">
                      Seu tema foi gerado com sucesso
                    </p>
                  </Motion.div>
                ) : (
                  <Motion.div
                    key="building"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                  >
                    <h2 className="text-xl font-black text-[var(--platform-text)]">
                      Construindo seu site…
                    </h2>
                    <p className="mt-1 text-sm text-[var(--platform-text)]/50">
                      Isso vai levar só um instante
                    </p>
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Steps list */}
              <div className="space-y-3">
                {LOADING_STEPS.map((step, i) => {
                  const isDone = loadingPhase > i;
                  const isActive = loadingPhase === i;

                  return (
                    <Motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                        isDone
                          ? "bg-white/[0.04]"
                          : isActive
                            ? "bg-white/[0.06]"
                            : "opacity-30"
                      }`}
                    >
                      {/* Status icon */}
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                          isDone
                            ? "bg-[#10B981]"
                            : isActive
                              ? "border border-white/20 bg-white/10"
                              : "border border-white/10 bg-white/5"
                        }`}
                      >
                        {isDone ? (
                          <Check size={13} strokeWidth={3} className="text-white" />
                        ) : isActive ? (
                          <div
                            className="h-2.5 w-2.5 rounded-full animate-pulse"
                            style={{ backgroundColor: primaryColor }}
                          />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/20" />
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={`flex-1 text-sm font-medium ${
                          isDone
                            ? "text-[var(--platform-text)]/60 line-through"
                            : isActive
                              ? "text-[var(--platform-text)]"
                              : "text-[var(--platform-text)]/30"
                        }`}
                      >
                        {step}
                      </span>

                      {/* Active progress bar */}
                      {isActive && (
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                          <Motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: primaryColor }}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.95, ease: "linear" }}
                          />
                        </div>
                      )}
                    </Motion.div>
                  );
                })}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
