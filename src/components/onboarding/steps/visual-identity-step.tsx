"use client";

import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Check, Wand2 } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
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

/* ─── Component ─── */

export function VisualIdentityStep() {
  const { state, dispatch } = useWizard();
  const { visualPrimaryColor, visualTone, visualPersonality, visualMotion } = state;

  const [primaryColor, setPrimaryColor] = useState(visualPrimaryColor || "#3B82F6");
  const [tone, setTone] = useState<VisualTone>(visualTone || "dark");
  const [personality, setPersonality] = useState<VisualPersonality>(visualPersonality || "clean");
  const [motion, setMotion] = useState<VisualMotion>(visualMotion || "subtle");

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

  const canProceed = true; // always valid — defaults are already set

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
            {/* Swatches */}
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
                {/* Mini preview */}
                <div
                  className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: opt.previewBg, border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: opt.previewText }}
                  >
                    Aa
                  </span>
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
                {/* Button preview */}
                <div
                  className="shrink-0 rounded px-3 py-1.5 text-[10px] font-semibold text-white"
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: opt.radius,
                  }}
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

        {/* Live preview summary */}
        <Motion.div
          layout
          className="rounded-xl border border-white/10 bg-[#12182B] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wand2 size={16} className="text-[#A78BFA]" />
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">
              Tema gerado automaticamente
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Color chips */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.primaryColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.accentColor }} />
              <div className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: preview.backgroundColor }} />
              <span className="text-xs text-[var(--platform-text)]/50 ml-1">Cores</span>
            </div>

            {/* Font */}
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold text-[var(--platform-text)]"
                style={{ fontFamily: preview.fontFamily }}
              >
                {preview.fontFamily.split(",")[0]}
              </span>
              <span className="text-xs text-[var(--platform-text)]/50">Fonte</span>
            </div>

            {/* Button style */}
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

      <StepNavigation canProceed={canProceed} />
    </div>
  );
}
