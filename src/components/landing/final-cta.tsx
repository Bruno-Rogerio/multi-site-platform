"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield, Zap, Star, Clock } from "lucide-react";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] p-px">
            <div className="h-full w-full rounded-3xl bg-[#080D1C]" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 text-center md:py-20">
            {/* Background elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[20%] top-[-20%] h-[400px] w-[400px] rounded-full bg-[#7C5CFF]/20 blur-[100px]" />
              <div className="absolute right-[20%] top-[-10%] h-[300px] w-[300px] rounded-full bg-[#22D3EE]/15 blur-[80px]" />
              <div className="absolute bottom-[-20%] left-[40%] h-[300px] w-[300px] rounded-full bg-[#3B82F6]/15 blur-[80px]" />
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">
                <Zap size={11} />
                Comece hoje mesmo
              </span>

              <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                <span className="text-[#EAF0FF]">Seu site profissional</span>
                <br />
                <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                  a um clique de distância
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#EAF0FF]/55 md:text-lg">
                Junte-se a centenas de profissionais que já têm presença online profissional. Configure
                em minutos, sem código e sem complicação.
              </p>

              {/* Trust stats */}
              <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
                {[
                  { icon: Zap, value: "< 5 min", label: "Para publicar" },
                  { icon: Star, value: "4.9★", label: "Avaliação" },
                  { icon: Clock, value: "24/7", label: "Disponível" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                    <Icon size={16} className="mx-auto mb-1 text-[#22D3EE]" />
                    <p className="text-sm font-bold text-[#EAF0FF]">{value}</p>
                    <p className="text-[11px] text-[#EAF0FF]/45">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/quero-comecar"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-10 py-4 text-base font-bold text-white shadow-[0_0_50px_rgba(124,92,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_70px_rgba(124,92,255,0.6)]"
                >
                  Criar meu site agora
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-10 py-4 text-base font-semibold text-[#EAF0FF]/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Ver planos →
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {[
                  { icon: Shield, text: "Sem taxa de setup" },
                  { icon: Zap, text: "Cancele quando quiser" },
                  { icon: Star, text: "Sem fidelidade" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs text-[#EAF0FF]/35">
                    <Icon size={12} className="text-[#22D3EE]/60" />
                    {text}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
