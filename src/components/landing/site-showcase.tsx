"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NichoMockup = {
  id: string;
  label: string;
  name: string;
  role: string;
  tagline: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
  services: string[];
  ctaLabel: string;
};

const NICHOS: NichoMockup[] = [
  {
    id: "psicologa",
    label: "Psicóloga",
    name: "Dra. Ana Lima",
    role: "Psicóloga Clínica · CRP 06/12345",
    tagline: "Cuidando da sua saúde mental com acolhimento e ciência.",
    primary: "#9333EA",
    accent: "#A855F7",
    bg: "#faf5ff",
    text: "#3b0764",
    services: ["Terapia Individual", "Terapia de Casal", "Orientação Familiar"],
    ctaLabel: "Agendar consulta",
  },
  {
    id: "advogado",
    label: "Advogado",
    name: "Dr. Carlos Ramos",
    role: "Advogado · OAB/SP 123.456",
    tagline: "Soluções jurídicas com excelência e comprometimento.",
    primary: "#1E40AF",
    accent: "#3B82F6",
    bg: "#eff6ff",
    text: "#1e3a5f",
    services: ["Direito Civil", "Direito Trabalhista", "Direito de Família"],
    ctaLabel: "Consulta gratuita",
  },
  {
    id: "personal",
    label: "Personal",
    name: "Marcos Silva",
    role: "Personal Trainer · CREF 123456",
    tagline: "Transforme seu corpo e sua mentalidade com treinos personalizados.",
    primary: "#EA580C",
    accent: "#F97316",
    bg: "#1a1008",
    text: "#fff7ed",
    services: ["Treino Funcional", "Musculação", "Emagrecimento"],
    ctaLabel: "Começar agora",
  },
  {
    id: "fotografa",
    label: "Fotógrafa",
    name: "Júlia Santos",
    role: "Fotógrafa · @juliasantos.foto",
    tagline: "Momentos eternizados com olhar artístico e sensível.",
    primary: "#BE185D",
    accent: "#EC4899",
    bg: "#fff1f8",
    text: "#500724",
    services: ["Ensaio Feminino", "Casamentos", "Newborn"],
    ctaLabel: "Ver portfólio",
  },
];

function SiteMockup({ nicho }: { nicho: NichoMockup }) {
  const isDark = nicho.bg.startsWith("#1");
  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-2xl"
      style={{ borderColor: `${nicho.primary}30`, backgroundColor: nicho.bg }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: `${nicho.primary}20`, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
        <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
        <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
        <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
        <span className="ml-2 flex-1 rounded-md border px-2 py-0.5 text-[10px]" style={{ borderColor: `${nicho.primary}20`, color: `${nicho.text}60`, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
          {nicho.name.toLowerCase().replace(/\s/g, "-").replace(/[^a-z-]/g, "")}.buildsphere.app
        </span>
      </div>

      {/* Site content */}
      <div className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: `${nicho.primary}15` }}>
          <span className="text-xs font-bold" style={{ color: nicho.text }}>{nicho.name}</span>
          <div className="flex gap-3">
            {["Serviços", "Sobre", "Contato"].map((item) => (
              <span key={item} className="text-[10px]" style={{ color: `${nicho.text}70` }}>{item}</span>
            ))}
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: nicho.primary }}>
              {nicho.ctaLabel}
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="px-5 py-6">
          <div className="h-1 w-8 rounded-full mb-2" style={{ backgroundColor: nicho.accent }} />
          <p className="text-[11px] font-bold leading-snug md:text-xs" style={{ color: nicho.text }}>
            {nicho.role}
          </p>
          <h3 className="mt-1 text-base font-black leading-snug md:text-lg" style={{ color: nicho.text }}>
            {nicho.tagline}
          </h3>
          <button
            className="mt-4 rounded-lg px-4 py-2 text-xs font-bold text-white"
            style={{ backgroundColor: nicho.primary }}
          >
            {nicho.ctaLabel} →
          </button>
        </div>

        {/* Services */}
        <div className="border-t px-4 pb-5 pt-4" style={{ borderColor: `${nicho.primary}12` }}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: `${nicho.text}60` }}>
            Serviços
          </p>
          <div className="grid grid-cols-3 gap-2">
            {nicho.services.map((service) => (
              <div
                key={service}
                className="rounded-lg border p-2.5 text-center"
                style={{
                  borderColor: `${nicho.primary}20`,
                  backgroundColor: `${nicho.primary}08`,
                }}
              >
                <div className="mx-auto mb-1.5 h-4 w-4 rounded-md" style={{ backgroundColor: `${nicho.primary}30` }} />
                <p className="text-[9px] font-semibold leading-snug" style={{ color: nicho.text }}>
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div
          className="px-4 py-3 text-center text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${nicho.primary}, ${nicho.accent})` }}
        >
          {nicho.ctaLabel} — sem compromisso
        </div>
      </div>
    </div>
  );
}

export function SiteShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((cur) => (cur + 1) % NICHOS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const active = NICHOS[activeIndex];

  return (
    <section id="exemplos" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
            Feito com a BuildSphere
          </p>
          <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
            Sites incríveis para qualquer segmento
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
            Em menos de 5 minutos você tem um site com essa qualidade, no seu nicho.
          </p>
        </div>

        <div
          className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Tabs / nicho selector */}
          <div className="flex flex-row flex-wrap justify-center gap-3 lg:flex-col lg:justify-start">
            {NICHOS.map((nicho, i) => (
              <button
                key={nicho.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 lg:w-full ${
                  activeIndex === i
                    ? "border-opacity-100 shadow-lg"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
                style={
                  activeIndex === i
                    ? {
                        borderColor: nicho.primary,
                        backgroundColor: `${nicho.primary}12`,
                        boxShadow: `0 4px 20px ${nicho.primary}25`,
                      }
                    : {}
                }
              >
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: activeIndex === i ? nicho.primary : "rgba(255,255,255,0.2)" }}
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: activeIndex === i ? nicho.primary : "var(--platform-text)" }}
                  >
                    {nicho.label}
                  </p>
                  {activeIndex === i && (
                    <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">{nicho.name}</p>
                  )}
                </div>
                {activeIndex === i && (
                  <div className="ml-auto hidden lg:block">
                    {/* Progress bar */}
                    <div className="h-0.5 w-12 overflow-hidden rounded-full bg-white/10">
                      {!isPaused && (
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: nicho.primary }}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 4, ease: "linear" }}
                          key={`${activeIndex}-progress`}
                        />
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Mockup display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <SiteMockup nicho={active} />
              </motion.div>
            </AnimatePresence>

            {/* Glow behind mockup */}
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl blur-3xl transition-all duration-700"
              style={{ backgroundColor: `${active.primary}15` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
