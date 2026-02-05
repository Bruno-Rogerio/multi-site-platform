"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ProductMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className="relative mt-12">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#7C5CFF]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#22D3EE]/10 blur-[100px]" />

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#0A0F1E] p-1 shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.12)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 rounded-t-xl bg-[#0D1325] px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
          <span className="ml-4 flex-1 rounded-lg bg-white/[0.06] px-4 py-1.5 text-xs text-[var(--platform-text)]/40">
            dra-ana-silva.buildsphere.app
          </span>
        </div>

        {/* Site content */}
        <div className="space-y-4 rounded-b-xl bg-gradient-to-b from-[#0B1020] to-[#0F162A] p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[linear-gradient(135deg,#7C5CFF,#22D3EE)]" />
              <span className="text-sm font-semibold text-[var(--platform-text)]">
                Dra. Ana Silva
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-xs text-[var(--platform-text)]/50">Sobre</span>
              <span className="text-xs text-[var(--platform-text)]/50">Servicos</span>
              <span className="text-xs text-[var(--platform-text)]/50">Contato</span>
            </div>
          </div>

          {/* Hero */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#22D3EE]">
                Psicologia Clinica
              </p>
              <p className="text-lg font-bold leading-tight text-[var(--platform-text)]">
                Cuidado emocional para viver com mais clareza
              </p>
              <p className="text-xs leading-relaxed text-[var(--platform-text)]/55">
                Atendimento humanizado para adultos e adolescentes. Acolhimento
                profissional em cada sessao.
              </p>
              <div className="h-8 w-28 rounded-lg bg-[linear-gradient(135deg,#7C5CFF,#22D3EE)] pt-1.5 text-center text-[10px] font-semibold text-white">
                Agendar consulta
              </div>
            </div>
            <div className="hidden rounded-xl bg-[linear-gradient(135deg,rgba(124,92,255,0.15),rgba(34,211,238,0.12),rgba(59,130,246,0.1))] md:block" />
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-3 gap-3">
            {["Terapia individual", "Terapia de casal", "Orientacao parental"].map(
              (service) => (
                <div
                  key={service}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center"
                >
                  <div className="mx-auto h-8 w-8 rounded-lg bg-[#7C5CFF]/15" />
                  <p className="mt-2 text-[10px] font-semibold text-[var(--platform-text)]/80">
                    {service}
                  </p>
                </div>
              )
            )}
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-[linear-gradient(135deg,#7C5CFF,#3B82F6,#22D3EE)] p-4 text-center">
            <p className="text-sm font-bold text-white">
              Pronta para dar o proximo passo?
            </p>
            <p className="mt-1 text-[10px] text-white/70">
              Agende sua primeira sessao com desconto especial
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
