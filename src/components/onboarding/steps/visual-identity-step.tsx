"use client";

import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ChevronRight } from "lucide-react";
import { useWizard } from "../wizard-context";
import { palettePresets, type PalettePreset } from "@/lib/onboarding/palettes";
import type { VisualMotion } from "@/lib/onboarding/theme-generator";

/* ─── Per-palette style mapping ─── */

const PALETTE_HEADER: Record<string, "blur" | "solid" | "minimal" | "gradient" | "dark"> = {
  "buildsphere":     "blur",
  "midnight-violet": "blur",
  "aurora-soft":     "blur",
  "warm-premium":    "gradient",
  "forest-trust":    "blur",
  "mono-pro":        "solid",
  "solar-pop":       "solid",
  "mint-cloud":      "blur",
  "rose-luxe":       "gradient",
  "ocean-deep":      "blur",
  "editorial-dark":  "minimal",
  "corporate-navy":  "solid",
  "dark-tech":       "dark",
};

const PALETTE_DIVIDER: Record<string, "wave" | "diagonal" | "curve" | "line" | "none"> = {
  "buildsphere":     "line",
  "midnight-violet": "diagonal",
  "aurora-soft":     "curve",
  "warm-premium":    "wave",
  "forest-trust":    "curve",
  "mono-pro":        "line",
  "solar-pop":       "diagonal",
  "mint-cloud":      "curve",
  "rose-luxe":       "wave",
  "ocean-deep":      "line",
  "editorial-dark":  "none",
  "corporate-navy":  "line",
  "dark-tech":       "line",
};

function buttonStyleFromRadius(radius: string): "rounded" | "pill" | "square" {
  const r = parseInt(radius);
  if (r === 0) return "square";
  if (r >= 16) return "pill";
  return "rounded";
}

/* ─── Fonts ─── */

const FONT_OPTIONS: { family: string; description: string }[] = [
  { family: "Inter",              description: "Limpo e profissional" },
  { family: "Sora",               description: "Moderno e arredondado" },
  { family: "Poppins",            description: "Amigável e suave" },
  { family: "DM Sans",            description: "Minimal e elegante" },
  { family: "Space Grotesk",      description: "Geométrico e técnico" },
  { family: "Montserrat",         description: "Forte e marcante" },
  { family: "Playfair Display",   description: "Clássico e refinado" },
  { family: "Cormorant Garamond", description: "Luxo e sofisticação" },
];

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Sora:wght@400;700;900&family=Poppins:wght@400;700;900&family=DM+Sans:wght@400;700;900&family=Space+Grotesk:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@400;700;900&display=swap";

/* ─── Motion ─── */

const MOTION_OPTIONS: { id: VisualMotion; label: string; description: string }[] = [
  { id: "none",   label: "Estático",  description: "Sem animações — carrega mais rápido" },
  { id: "subtle", label: "Suave",     description: "Fade discreto nas seções" },
  { id: "lively", label: "Animado",   description: "Animações marcantes ao rolar" },
];

/* ─── Sections ─── */

const SECTION_OPTIONS: {
  id: string; label: string; description: string; emoji: string; mandatory?: boolean; defaultOn?: boolean;
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

const LOADING_STEPS = [
  "Analisando suas escolhas...",
  "Gerando paleta de cores...",
  "Definindo tipografia e estilo...",
  "Construindo seu layout...",
];

/* ─── Palette card ─── */

function PaletteCard({
  palette,
  isSelected,
  font,
  onClick,
}: {
  palette: PalettePreset;
  isSelected: boolean;
  font: string;
  onClick: () => void;
}) {
  const btnRadius =
    palette.borderRadius === "0px" ? "2px"
    : parseInt(palette.borderRadius) >= 16 ? "999px"
    : "6px";

  return (
    <Motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative overflow-hidden rounded-2xl text-left focus:outline-none"
      style={{
        backgroundColor: palette.background,
        boxShadow: isSelected
          ? `0 0 0 2px ${palette.accent}, 0 8px 32px ${palette.primary}35`
          : `0 2px 8px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Primary glow orb */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-40%",
          left: "-15%",
          width: "70%",
          paddingBottom: "70%",
          borderRadius: "50%",
          background: `${palette.primary}50`,
          filter: "blur(28px)",
        }}
      />
      {/* Accent glow orb */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-30%",
          right: "-10%",
          width: "55%",
          paddingBottom: "55%",
          borderRadius: "50%",
          background: `${palette.accent}40`,
          filter: "blur(24px)",
        }}
      />

      <div className="relative flex flex-col gap-2.5 p-3.5" style={{ minHeight: "168px" }}>
        {/* Color dots + gradient strip */}
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: palette.primary }} />
          <div className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: palette.accent }} />
          <div className="ml-auto h-1.5 w-12 rounded-full opacity-70" style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})` }} />
        </div>

        {/* Typography preview */}
        <div className="flex-1">
          <p
            className="text-[28px] font-black leading-none"
            style={{ color: palette.text, fontFamily: `'${font}', sans-serif` }}
          >
            Aa
          </p>
          <p
            className="mt-1 text-[10px] font-medium leading-tight opacity-50"
            style={{ color: palette.text }}
          >
            Título · Subtítulo
          </p>
        </div>

        {/* Button preview */}
        <div
          className="inline-flex items-center self-start px-3 py-1 text-[10px] font-bold"
          style={{
            background: palette.primary,
            color: "#fff",
            borderRadius: btnRadius,
          }}
        >
          Botão
        </div>

        {/* Palette name */}
        <div className="flex items-center justify-between">
          <p
            className="text-[10px] font-semibold leading-tight"
            style={{ color: palette.text, opacity: 0.55 }}
          >
            {palette.name}
          </p>
          {isSelected && (
            <div
              className="flex h-4 w-4 items-center justify-center rounded-full"
              style={{ background: palette.accent }}
            >
              <Check size={9} strokeWidth={3.5} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </Motion.button>
  );
}

/* ─── Component ─── */

export function VisualIdentityStep() {
  const { state, dispatch } = useWizard();
  const { paletteId: statePaletteId, fontFamily: stateFontFamily, motionStyle: stateMotionStyle } = state;

  // Derive initial font family (strip fallback stack)
  const initFont = (() => {
    const f = stateFontFamily?.split(",")[0]?.replace(/['"]/g, "").trim();
    return FONT_OPTIONS.some((o) => o.family === f) ? f : "Sora";
  })();

  const [selectedPaletteId, setSelectedPaletteId] = useState(
    palettePresets.some((p) => p.id === statePaletteId) ? statePaletteId : "buildsphere"
  );
  const [selectedFont, setSelectedFont] = useState(initFont);
  const [motion, setMotion] = useState<VisualMotion>(
    (stateMotionStyle?.replace("motion-", "") as VisualMotion) || "subtle"
  );
  const [selectedSections, setSelectedSections] = useState<string[]>(() => {
    if (state.enabledSections.length > 0) return state.enabledSections;
    return SECTION_OPTIONS.filter((s) => s.mandatory || s.defaultOn).map((s) => s.id);
  });

  const [showLoading, setShowLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const palette = palettePresets.find((p) => p.id === selectedPaletteId) ?? palettePresets[0];
  const allDone = loadingPhase >= LOADING_STEPS.length;

  // Load fonts
  useEffect(() => {
    const id = "wizard-fonts-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  function applyTheme(pid: string, font: string, m: VisualMotion) {
    const p = palettePresets.find((x) => x.id === pid) ?? palettePresets[0];
    dispatch({
      type: "SET_PALETTE_THEME",
      paletteId: pid,
      customColors: { primary: p.primary, accent: p.accent, background: p.background, text: p.text },
      fontFamily: `'${font}', sans-serif`,
      motionStyle: `motion-${m}`,
      buttonStyle: buttonStyleFromRadius(p.borderRadius),
      headerStyle: PALETTE_HEADER[pid] ?? "blur",
      dividerStyle: PALETTE_DIVIDER[pid] ?? "line",
    });
  }

  function onPaletteSelect(pid: string) {
    setSelectedPaletteId(pid);
    applyTheme(pid, selectedFont, motion);
  }

  function onFontSelect(font: string) {
    setSelectedFont(font);
    applyTheme(selectedPaletteId, font, motion);
  }

  function onMotionChange(m: VisualMotion) {
    setMotion(m);
    applyTheme(selectedPaletteId, selectedFont, m);
  }

  function toggleSection(id: string) {
    const isOn = selectedSections.includes(id);
    const newSelected = isOn ? selectedSections.filter((s) => s !== id) : [...selectedSections, id];
    setSelectedSections(newSelected);
    if (isOn) {
      dispatch({ type: "REMOVE_SECTION", sectionType: id });
    } else {
      const reordered = SECTION_OPTIONS.map((s) => s.id).filter((s) => newSelected.includes(s));
      dispatch({ type: "REORDER_SECTIONS", sections: reordered });
    }
  }

  function handleContinue() {
    // Ensure latest theme is dispatched
    applyTheme(selectedPaletteId, selectedFont, motion);
    setShowLoading(true);
    setLoadingPhase(0);
    const delays = [1000, 2000, 3000, 4200];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (i < delays.length - 1) {
          setLoadingPhase(i + 1);
        } else {
          const ordered = [
            "hero",
            ...SECTION_OPTIONS.filter((s) => !s.mandatory && selectedSections.includes(s.id)).map((s) => s.id),
            "contact",
          ];
          dispatch({ type: "REORDER_SECTIONS", sections: ordered });
          const ft = setTimeout(() => dispatch({ type: "NEXT_STEP" }), 600);
          timersRef.current.push(ft);
        }
      }, delay);
      timersRef.current.push(t);
    });
  }

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Identidade visual
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Qual é a vibe do seu site?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Escolha uma paleta, a fonte e o ritmo visual. Tudo muda em tempo real no preview.
        </p>
      </div>

      <div className="space-y-10">

        {/* ── 1. Paleta ── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--platform-text)]">1. Paleta de cores</h3>
              <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
                Cada paleta é um tema completo — cores, sombras e bordas já configurados
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
              style={{ borderColor: `${palette.accent}50`, background: `${palette.primary}12` }}
            >
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: palette.primary }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: palette.accent }} />
              <span className="text-[10px] font-semibold text-[var(--platform-text)]/60">
                {palette.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {palettePresets.map((p) => (
              <PaletteCard
                key={p.id}
                palette={p}
                isSelected={selectedPaletteId === p.id}
                font={selectedFont}
                onClick={() => onPaletteSelect(p.id)}
              />
            ))}
          </div>
        </section>

        {/* ── 2. Tipografia ── */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[var(--platform-text)]">2. Tipografia</h3>
            <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
              A fonte define a personalidade e a leitura do site
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {FONT_OPTIONS.map((f) => {
              const isSelected = selectedFont === f.family;
              return (
                <Motion.button
                  key={f.family}
                  onClick={() => onFontSelect(f.family)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden rounded-xl p-4 text-left transition-all"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${palette.primary}18, ${palette.accent}12)`
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? palette.accent + "60" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isSelected ? `0 0 20px ${palette.primary}20` : "none",
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ background: palette.accent }}
                    >
                      <Check size={9} strokeWidth={3.5} className="text-white" />
                    </div>
                  )}
                  <p
                    className="text-2xl font-black leading-none"
                    style={{
                      fontFamily: `'${f.family}', serif`,
                      color: isSelected ? palette.primary : "var(--platform-text)",
                    }}
                  >
                    Aa
                  </p>
                  <p
                    className="mt-2 text-xs font-semibold leading-tight"
                    style={{ color: isSelected ? palette.accent : "var(--platform-text)" }}
                  >
                    {f.family}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-[var(--platform-text)]/40">
                    {f.description}
                  </p>
                </Motion.button>
              );
            })}
          </div>
        </section>

        {/* ── 3. Animações ── */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[var(--platform-text)]">3. Animações</h3>
            <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
              Como as seções aparecem ao rolar a página
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {MOTION_OPTIONS.map((opt) => {
              const isSelected = motion === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onMotionChange(opt.id)}
                  className="rounded-xl border p-4 text-left transition-all"
                  style={{
                    background: isSelected ? `${palette.primary}15` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? palette.primary + "50" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p className="text-sm font-bold" style={{ color: isSelected ? palette.primary : "var(--platform-text)" }}>
                    {opt.label}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-[var(--platform-text)]/50">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 4. Seções ── */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[var(--platform-text)]">4. Seções do seu site</h3>
            <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
              Escolha quais seções aparecem. As em cinza são obrigatórias.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {SECTION_OPTIONS.map((s) => {
              const isSelected = !!s.mandatory || selectedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!!s.mandatory}
                  onClick={() => !s.mandatory && toggleSection(s.id)}
                  className="relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all"
                  style={{
                    background: s.mandatory
                      ? "rgba(255,255,255,0.03)"
                      : isSelected
                        ? `${palette.primary}12`
                        : "rgba(255,255,255,0.01)",
                    border: `1px solid ${
                      s.mandatory
                        ? "rgba(255,255,255,0.08)"
                        : isSelected
                          ? palette.primary + "40"
                          : "rgba(255,255,255,0.08)"
                    }`,
                    opacity: s.mandatory ? 0.6 : 1,
                    cursor: s.mandatory ? "default" : "pointer",
                  }}
                >
                  <div
                    className="absolute right-2.5 top-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all"
                    style={{
                      background: isSelected && !s.mandatory ? palette.primary : "transparent",
                      borderColor: isSelected ? (s.mandatory ? "rgba(255,255,255,0.2)" : palette.primary) : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {isSelected && (
                      <Check size={10} strokeWidth={3} className={s.mandatory ? "text-white/50" : "text-white"} />
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
            {selectedSections.filter((s) => !["hero", "contact"].includes(s)).length + 2} seções · Você pode alterar depois no painel
          </p>
        </section>

        {/* ── Tema gerado ── */}
        <Motion.div
          layout
          className="overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}18, ${palette.accent}10)`,
            border: `1px solid ${palette.primary}25`,
          }}
        >
          <div className="flex items-center gap-4 p-5">
            {/* Mini palette visual */}
            <div className="flex shrink-0 flex-col gap-1">
              <div className="flex gap-1">
                <div className="h-5 w-5 rounded-md ring-1 ring-white/10" style={{ background: palette.primary }} />
                <div className="h-5 w-5 rounded-md ring-1 ring-white/10" style={{ background: palette.accent }} />
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-5 rounded-md ring-1 ring-white/10" style={{ background: palette.background }} />
                <div className="h-5 w-5 rounded-md ring-1 ring-white/10" style={{ background: palette.text }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--platform-text)]">{palette.name}</p>
              <p className="mt-0.5 text-[10px] text-[var(--platform-text)]/50">
                {selectedFont} · {["Estático","Suave","Animado"][["none","subtle","lively"].indexOf(motion)]}
              </p>
            </div>

            <div
              className="shrink-0 px-3 py-1.5 text-xs font-bold text-white"
              style={{
                background: palette.primary,
                borderRadius: buttonStyleFromRadius(palette.borderRadius) === "square" ? "2px" : buttonStyleFromRadius(palette.borderRadius) === "pill" ? "999px" : "8px",
              }}
            >
              {palette.name.split(" ")[0]}
            </div>
          </div>
        </Motion.div>
      </div>

      {/* Continue */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="text-sm text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]/70"
        >
          ← Voltar
        </button>
        <Motion.button
          type="button"
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            boxShadow: `0 4px 24px ${palette.primary}50`,
          }}
        >
          <Sparkles size={15} />
          Gerar meu site
          <ChevronRight size={15} />
        </Motion.button>
      </div>

      {/* ── Loading overlay ── */}
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
                style={{ backgroundColor: `${palette.primary}20` }}
              />
              <div
                className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full blur-[140px]"
                style={{ backgroundColor: `${palette.accent}15` }}
              />
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
                    style={{ background: `${palette.primary}25`, border: `2px solid ${palette.primary}60` }}
                  >
                    <Check size={32} strokeWidth={2.5} style={{ color: palette.primary }} />
                  </Motion.div>
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: `${palette.primary}15`, border: `1px solid ${palette.primary}30` }}
                  >
                    <Sparkles size={28} style={{ color: palette.primary }} className="animate-pulse" />
                  </div>
                )}
              </Motion.div>

              <AnimatePresence mode="wait">
                {allDone ? (
                  <Motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-[var(--platform-text)]">Pronto! 🎉</h2>
                    <p className="mt-1 text-sm text-[var(--platform-text)]/60">Seu tema foi gerado com sucesso</p>
                  </Motion.div>
                ) : (
                  <Motion.div key="building" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
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
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all ${isDone ? "bg-white/[0.04]" : isActive ? "bg-white/[0.06]" : "opacity-30"}`}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-[#10B981]" : isActive ? "border border-white/20 bg-white/10" : "border border-white/10 bg-white/5"}`}>
                        {isDone ? (
                          <Check size={13} strokeWidth={3} className="text-white" />
                        ) : isActive ? (
                          <div className="h-2.5 w-2.5 animate-pulse rounded-full" style={{ background: palette.primary }} />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/20" />
                        )}
                      </div>
                      <span className={`flex-1 text-sm font-medium ${isDone ? "text-[var(--platform-text)]/60 line-through" : isActive ? "text-[var(--platform-text)]" : "text-[var(--platform-text)]/30"}`}>
                        {step}
                      </span>
                      {isActive && (
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                          <Motion.div
                            className="h-full rounded-full"
                            style={{ background: palette.primary }}
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
