"use client";

import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Check, Wand2, Sparkles, ChevronRight } from "lucide-react";
import { useWizard } from "../wizard-context";
import { generateTheme, type VisualTone, type VisualPersonality, type VisualMotion } from "@/lib/onboarding/theme-generator";

/* ─── Color groups (16 swatches) ─── */

const COLOR_GROUPS: { label: string; colors: { hex: string; name: string }[] }[] = [
  {
    label: "Frios",
    colors: [
      { hex: "#3B82F6", name: "Azul" },
      { hex: "#6366F1", name: "Índigo" },
      { hex: "#7C5CFF", name: "Roxo" },
      { hex: "#22D3EE", name: "Ciano" },
      { hex: "#0EA5E9", name: "Sky" },
      { hex: "#14B8A6", name: "Teal" },
    ],
  },
  {
    label: "Quentes",
    colors: [
      { hex: "#F59E0B", name: "Âmbar" },
      { hex: "#F97316", name: "Laranja" },
      { hex: "#EF4444", name: "Vermelho" },
      { hex: "#EC4899", name: "Rosa" },
      { hex: "#D946EF", name: "Magenta" },
      { hex: "#10B981", name: "Verde" },
    ],
  },
  {
    label: "Neutros",
    colors: [
      { hex: "#64748B", name: "Ardósia" },
      { hex: "#6B7280", name: "Cinza" },
      { hex: "#78716C", name: "Stone" },
      { hex: "#374151", name: "Chumbo" },
    ],
  },
];

const ALL_SWATCHES = COLOR_GROUPS.flatMap((g) => g.colors);

/* ─── Visual styles (tone + personality unified) ─── */

type VisualStyleId =
  | "dark-modern"
  | "dark-bold"
  | "dark-elegant"
  | "dark-friendly"
  | "light-clean"
  | "light-bold"
  | "light-elegant"
  | "light-friendly";

interface VisualStyle {
  id: VisualStyleId;
  label: string;
  description: string;
  tone: VisualTone;
  personality: VisualPersonality;
  font: string;
  radius: string;
  bg: string;
  text: string;
}

const VISUAL_STYLES: VisualStyle[] = [
  { id: "dark-modern",    label: "Dark Moderno",      description: "Profissional e direto",  tone: "dark",    personality: "clean",    font: "Inter",            radius: "8px",  bg: "#0B1020", text: "#EAF0FF" },
  { id: "dark-bold",      label: "Dark Ousado",       description: "Marcante e impactante",  tone: "dark",    personality: "bold",     font: "Sora",             radius: "20px", bg: "#0B1020", text: "#EAF0FF" },
  { id: "dark-elegant",   label: "Dark Elegante",     description: "Refinado e sofisticado", tone: "neutral", personality: "elegant",  font: "Playfair Display", radius: "0px",  bg: "#12182B", text: "#E8EEFF" },
  { id: "dark-friendly",  label: "Dark Amigável",     description: "Caloroso e próximo",     tone: "dark",    personality: "friendly", font: "Poppins",          radius: "16px", bg: "#0B1020", text: "#EAF0FF" },
  { id: "light-clean",    label: "Claro Minimalista", description: "Limpo e acessível",      tone: "light",   personality: "clean",    font: "Inter",            radius: "8px",  bg: "#F8FAFF", text: "#1A2040" },
  { id: "light-bold",     label: "Claro Ousado",      description: "Vibrante e moderno",     tone: "light",   personality: "bold",     font: "Sora",             radius: "20px", bg: "#F8FAFF", text: "#1A2040" },
  { id: "light-elegant",  label: "Claro Elegante",    description: "Clássico e premium",     tone: "light",   personality: "elegant",  font: "Playfair Display", radius: "0px",  bg: "#F8FAFF", text: "#1A2040" },
  { id: "light-friendly", label: "Claro Amigável",    description: "Alegre e convidativo",   tone: "light",   personality: "friendly", font: "Poppins",          radius: "16px", bg: "#F8FAFF", text: "#1A2040" },
];

function deriveStyleId(tone: VisualTone | undefined, personality: VisualPersonality | undefined): VisualStyleId {
  const t = tone || "dark";
  const p = personality || "clean";
  if (t === "light") {
    if (p === "bold")     return "light-bold";
    if (p === "elegant")  return "light-elegant";
    if (p === "friendly") return "light-friendly";
    return "light-clean";
  }
  if (p === "bold")     return "dark-bold";
  if (p === "elegant")  return "dark-elegant";
  if (p === "friendly") return "dark-friendly";
  return "dark-modern";
}

/* ─── Motion options ─── */

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
  { id: "hero",         label: "Hero",          description: "Banner principal",          emoji: "🎯", mandatory: true },
  { id: "services",     label: "Serviços",       description: "O que você oferece",        emoji: "🧩", defaultOn: true },
  { id: "about",        label: "Sobre mim",      description: "Sua história",              emoji: "👤", defaultOn: true },
  { id: "stats",        label: "Números",        description: "Estatísticas e conquistas", emoji: "📊" },
  { id: "testimonials", label: "Depoimentos",    description: "O que clientes dizem",      emoji: "⭐", defaultOn: true },
  { id: "cta",          label: "CTA",            description: "Chamada para ação",         emoji: "📣", defaultOn: true },
  { id: "contact",      label: "Contato",        description: "Formas de falar com você",  emoji: "📞", mandatory: true },
  { id: "blog",         label: "Blog / Artigos", description: "Conteúdos e posts",         emoji: "📝" },
  { id: "gallery",      label: "Galeria",        description: "Fotos e portfólio",         emoji: "🖼️" },
  { id: "faq",          label: "FAQ",            description: "Perguntas frequentes",      emoji: "❓" },
  { id: "events",       label: "Agenda",         description: "Eventos e datas",           emoji: "📅" },
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
  const [selectedStyleId, setSelectedStyleId] = useState<VisualStyleId>(() =>
    deriveStyleId(visualTone, visualPersonality)
  );
  const [motion, setMotion] = useState<VisualMotion>(visualMotion || "subtle");

  const [selectedSections, setSelectedSections] = useState<string[]>(() => {
    if (state.enabledSections.length > 0) return state.enabledSections;
    return SECTION_OPTIONS.filter((s) => s.mandatory || s.defaultOn).map((s) => s.id);
  });

  const [showLoading, setShowLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedStyle = VISUAL_STYLES.find((s) => s.id === selectedStyleId) ?? VISUAL_STYLES[0];
  const preview = generateTheme(primaryColor, selectedStyle.tone, selectedStyle.personality, motion);
  const isCustomColor = !ALL_SWATCHES.some((s) => s.hex === primaryColor);

  function onColorChange(hex: string) {
    setPrimaryColor(hex);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor: hex, tone: selectedStyle.tone, personality: selectedStyle.personality, motion });
  }

  function onStyleChange(styleId: VisualStyleId) {
    setSelectedStyleId(styleId);
    const s = VISUAL_STYLES.find((v) => v.id === styleId)!;
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor, tone: s.tone, personality: s.personality, motion });
  }

  function onMotionChange(m: VisualMotion) {
    setMotion(m);
    dispatch({ type: "SET_VISUAL_IDENTITY", primaryColor, tone: selectedStyle.tone, personality: selectedStyle.personality, motion: m });
  }

  function toggleSection(id: string) {
    const isOn = selectedSections.includes(id);
    const newSelected = isOn ? selectedSections.filter((s) => s !== id) : [...selectedSections, id];
    setSelectedSections(newSelected);
    if (isOn) {
      dispatch({ type: "REMOVE_SECTION", sectionType: id });
    } else {
      const canonicalOrder = SECTION_OPTIONS.map((s) => s.id);
      const reordered = canonicalOrder.filter((s) => newSelected.includes(s));
      dispatch({ type: "REORDER_SECTIONS", sections: reordered });
    }
  }

  function handleContinue() {
    setShowLoading(true);
    setLoadingPhase(0);
    const phaseDelays = [1000, 2000, 3000, 4200];
    phaseDelays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (i < phaseDelays.length - 1) {
          setLoadingPhase(i + 1);
        } else {
          const ordered = [
            "hero",
            ...SECTION_OPTIONS
              .filter((s) => !s.mandatory && selectedSections.includes(s.id))
              .map((s) => s.id),
            "contact",
          ];
          dispatch({ type: "REORDER_SECTIONS", sections: ordered });
          const finalT = setTimeout(() => dispatch({ type: "NEXT_STEP" }), 600);
          timersRef.current.push(finalT);
        }
      }, delay);
      timersRef.current.push(t);
    });
  }

  useEffect(() => {
    return () => { timersRef.current.forEach((t) => clearTimeout(t)); };
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
          Personalize o visual do seu site
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Escolha a cor da sua marca, o estilo visual e como as animações se comportam.
        </p>
      </div>

      <div className="space-y-8">

        {/* 1. Cor da marca */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-[var(--platform-text)]">1. Cor da sua marca</h3>
          <p className="mb-5 text-xs text-[var(--platform-text)]/50">
            A cor principal que aparece nos botões e destaques do site
          </p>

          <div className="space-y-4">
            {COLOR_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--platform-text)]/30">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.colors.map((s) => (
                    <button
                      key={s.hex}
                      onClick={() => onColorChange(s.hex)}
                      title={s.name}
                      className="relative h-8 w-8 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: s.hex,
                        borderColor: primaryColor === s.hex ? "#fff" : "transparent",
                        boxShadow: primaryColor === s.hex ? `0 0 0 2px ${s.hex}` : "none",
                      }}
                    >
                      {primaryColor === s.hex && (
                        <Check size={13} strokeWidth={3} className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom */}
            <div className="flex items-center gap-3 pt-1">
              <label
                className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition hover:border-white/60"
                title="Escolher cor personalizada"
                style={{
                  backgroundColor: isCustomColor ? primaryColor : "transparent",
                  borderColor: isCustomColor ? "#fff" : "rgba(255,255,255,0.3)",
                  borderStyle: isCustomColor ? "solid" : "dashed",
                  boxShadow: isCustomColor ? `0 0 0 2px ${primaryColor}` : "none",
                }}
              >
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="sr-only"
                />
                {isCustomColor ? (
                  <Check size={13} strokeWidth={3} className="text-white drop-shadow" />
                ) : (
                  <span className="text-[11px] text-white/60">+</span>
                )}
              </label>
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
              <span className="text-xs text-[var(--platform-text)]/40">Cor personalizada</span>
            </div>
          </div>
        </section>

        {/* 2. Estilo visual */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-[var(--platform-text)]">2. Estilo visual</h3>
          <p className="mb-5 text-xs text-[var(--platform-text)]/50">
            Define o fundo, tipografia, formato dos botões e ritmo visual do site
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {VISUAL_STYLES.map((style) => {
              const isSelected = selectedStyleId === style.id;
              const btnRadius = style.radius === "0px" ? "1px" : style.radius === "20px" ? "20px" : "4px";

              return (
                <button
                  key={style.id}
                  onClick={() => onStyleChange(style.id)}
                  className={`overflow-hidden rounded-xl border p-0 text-left transition-all ${
                    isSelected
                      ? "border-[#22D3EE]/60 ring-1 ring-[#22D3EE]/30"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Mini site preview */}
                  <div className="relative w-full" style={{ backgroundColor: style.bg, height: "96px" }}>
                    {/* Navbar */}
                    <div
                      className="flex items-center justify-between px-2 py-1.5"
                      style={{ borderBottom: `1px solid ${style.text}18` }}
                    >
                      <div className="h-1.5 w-6 rounded-sm" style={{ backgroundColor: `${style.text}55` }} />
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-1 w-4 rounded-sm" style={{ backgroundColor: `${style.text}25` }} />
                        ))}
                      </div>
                    </div>
                    {/* Hero content */}
                    <div className="px-3 pt-2.5">
                      <div className="mb-1.5 h-2.5 w-4/5 rounded-sm" style={{ backgroundColor: `${style.text}65` }} />
                      <div className="mb-3 h-1.5 w-3/5 rounded-sm" style={{ backgroundColor: `${style.text}28` }} />
                      <div
                        className="inline-block px-2.5 py-1 text-[7px] font-bold leading-none text-white"
                        style={{ backgroundColor: primaryColor, borderRadius: btnRadius }}
                      >
                        Botão
                      </div>
                    </div>
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3EE]">
                        <Check size={9} strokeWidth={3.5} className="text-[#0B1020]" />
                      </div>
                    )}
                  </div>
                  {/* Label row */}
                  <div
                    className="px-3 py-2.5"
                    style={{
                      borderTop: `1px solid ${style.text}12`,
                      backgroundColor: `${style.bg}`,
                    }}
                  >
                    <p className={`text-xs font-bold leading-tight ${isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}>
                      {style.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[var(--platform-text)]/40">
                      {style.font}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Animações */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-[var(--platform-text)]">3. Animações</h3>
          <p className="mb-4 text-xs text-[var(--platform-text)]/50">Como as seções do site aparecem na tela</p>

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

        {/* 4. Seções do site */}
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-[var(--platform-text)]">4. Seções do seu site</h3>
          <p className="mb-4 text-xs text-[var(--platform-text)]/50">
            Escolha quais seções aparecem. As marcadas em cinza são obrigatórias.
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {SECTION_OPTIONS.map((s) => {
              const isSelected = !!s.mandatory || selectedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!!s.mandatory}
                  onClick={() => !s.mandatory && toggleSection(s.id)}
                  className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                    s.mandatory
                      ? "cursor-default border-white/10 bg-white/[0.03] opacity-60"
                      : isSelected
                        ? "cursor-pointer border-[#22D3EE]/40 bg-[#22D3EE]/8"
                        : "cursor-pointer border-white/10 bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div
                    className={`absolute right-2.5 top-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                      isSelected
                        ? s.mandatory
                          ? "border-white/20 bg-white/10"
                          : "border-[#22D3EE] bg-[#22D3EE]"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <Check size={10} strokeWidth={3} className={s.mandatory ? "text-white/50" : "text-[#0B1020]"} />
                    )}
                  </div>
                  <span className="text-base leading-none">{s.emoji}</span>
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-[var(--platform-text)]" : "text-[var(--platform-text)]/50"}`}>
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[var(--platform-text)]/40">
                      {s.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] text-[var(--platform-text)]/30">
            {selectedSections.filter((s) => !["hero", "contact"].includes(s)).length + 2} seções selecionadas
            {" · "}Você pode adicionar mais depois no painel
          </p>
        </section>

        {/* Live preview summary */}
        <Motion.div layout className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Wand2 size={16} className="text-[#A78BFA]" />
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">Tema gerado automaticamente</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.primaryColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.accentColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.backgroundColor }} />
              <span className="ml-1 text-xs text-[var(--platform-text)]/50">Cores</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--platform-text)]" style={{ fontFamily: preview.fontFamily }}>
                {preview.fontFamily.split(",")[0]}
              </span>
              <span className="text-xs text-[var(--platform-text)]/50">Fonte</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: preview.primaryColor, borderRadius: preview["--site-radius"] }}
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

              <AnimatePresence mode="wait">
                {allDone ? (
                  <Motion.div
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                  >
                    <h2 className="text-2xl font-black text-[var(--platform-text)]">Pronto! 🎉</h2>
                    <p className="mt-1 text-sm text-[var(--platform-text)]/60">Seu tema foi gerado com sucesso</p>
                  </Motion.div>
                ) : (
                  <Motion.div
                    key="building"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                  >
                    <h2 className="text-xl font-black text-[var(--platform-text)]">Construindo seu site…</h2>
                    <p className="mt-1 text-sm text-[var(--platform-text)]/50">Isso vai levar só um instante</p>
                  </Motion.div>
                )}
              </AnimatePresence>

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
                        isDone ? "bg-white/[0.04]" : isActive ? "bg-white/[0.06]" : "opacity-30"
                      }`}
                    >
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
                          <div className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/20" />
                        )}
                      </div>

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
