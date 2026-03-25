"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserCheck, Palette, Globe } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: UserCheck,
    title: "Crie sua conta",
    subtitle: "2 minutos",
    description:
      "Informe seus dados básicos, escolha o nome do seu site e selecione o plano ideal para o seu negócio.",
    highlights: ["Sem cartão de crédito para começar", "Setup guiado passo a passo", "Suporte em tempo real"],
    gradient: "from-[#3B82F6] to-[#7C5CFF]",
    glow: "rgba(59,130,246,0.3)",
    accent: "#3B82F6",
  },
  {
    number: "02",
    icon: Palette,
    title: "Personalize tudo",
    subtitle: "3 minutos",
    description:
      "Adicione suas informações, fotos, serviços e configure a identidade visual com paletas prontas e personalizáveis.",
    highlights: ["Templates profissionais pré-criados", "Logo, identidade visual e estilo", "Preview em tempo real"],
    gradient: "from-[#7C5CFF] to-[#A855F7]",
    glow: "rgba(124,92,255,0.3)",
    accent: "#7C5CFF",
  },
  {
    number: "03",
    icon: Globe,
    title: "Publique e apareça",
    subtitle: "Instantâneo",
    description:
      "Com um clique seu site entra no ar com subdomínio profissional, SSL incluso e visível para todo o Brasil.",
    highlights: ["SSL gratuito automático", "Subdomínio profissional incluso", "Aparece no Google"],
    gradient: "from-[#22D3EE] to-[#3B82F6]",
    glow: "rgba(34,211,238,0.3)",
    accent: "#22D3EE",
  },
];

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `0 0 40px ${step.glow}` }}
      />

      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-7 transition-all duration-500 hover:border-white/20 hover:bg-[#111830]">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at 50% -100%, ${step.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Large step number */}
        <div
          className={`absolute right-4 top-3 bg-gradient-to-br ${step.gradient} bg-clip-text text-[100px] font-black leading-none tracking-tighter text-transparent opacity-10 select-none`}
        >
          {step.number}
        </div>

        <div className="relative">
          {/* Icon */}
          <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg`}
            style={{ boxShadow: `0 8px 24px ${step.glow}` }}>
            <Icon size={24} className="text-white" />
          </div>

          {/* Subtitle pill */}
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ borderColor: `${step.accent}40`, color: step.accent, background: `${step.accent}15` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: step.accent }} />
            {step.subtitle}
          </div>

          <h3 className="text-xl font-black text-[#EAF0FF] md:text-2xl">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#EAF0FF]/55">{step.description}</p>

          {/* Highlights */}
          <ul className="mt-5 space-y-2">
            {step.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-[#EAF0FF]/70">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${step.accent}, ${step.accent}99)` }}
                >
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <div className="mt-12">
      {/* Connecting line (desktop only) */}
      <div className="relative hidden lg:block">
        <div className="absolute left-[16.67%] right-[16.67%] top-[3.5rem] h-px">
          <div className="h-full w-full bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] opacity-20 blur-sm" />
          {/* Dots at connection points */}
          <div className="absolute left-[33%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF] shadow-[0_0_10px_rgba(124,92,255,0.8)]" />
          <div className="absolute right-[33%] top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <Step key={step.number} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
