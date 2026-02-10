"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PenTool, Rocket, LayoutDashboard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenTool,
    title: "Configure",
    description:
      "Escolha o estilo, cores e estrutura do seu site no nosso assistente visual. Tudo intuitivo, sem código.",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Publique",
    description:
      "Com um clique, seu site está no ar com domínio profissional. Pronto para receber visitantes.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Gerencie",
    description:
      "Edite conteúdo, imagens e informações a qualquer momento pelo painel administrativo.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative mt-12 grid gap-8 md:grid-cols-3">
      {/* Connector line (desktop only) */}
      <div className="pointer-events-none absolute left-0 right-0 top-[60px] z-0 hidden md:block">
        <div className="mx-auto h-[2px] max-w-[70%] overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full bg-[linear-gradient(90deg,#3B82F6,#7C5CFF,#22D3EE)]"
            initial={{ width: "0%" }}
            animate={isInView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          className="relative z-10 rounded-2xl border border-white/10 bg-[#12182B]/80 p-6 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.5,
            delay: 0.15 * i,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {/* Step number */}
          <div className="absolute -left-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] text-xs font-bold text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
            {step.number}
          </div>

          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(124,92,255,0.12))]">
            <step.icon size={24} className="text-[#22D3EE]" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[var(--platform-text)]">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--platform-text)]/65">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
