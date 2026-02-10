"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroAnimatedHeadline() {
  return (
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Text column */}
      <div>
        <motion.p
          className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#22D3EE]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Sparkles size={14} />
          Plataforma para profissionais autônomos
        </motion.p>

        <motion.h1
          className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-[var(--platform-text)] md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Seu site profissional.
          <br />
          <span className="animate-gradient-text bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE,#3B82F6)] bg-clip-text text-transparent">
            Pronto em minutos.
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-[var(--platform-text)]/70 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Crie um site elegante para sua prática profissional. Sem código, sem
          complicação — configure tudo sozinho e tenha presença online em poucos
          minutos.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href="/quero-comecar"
            className="group inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(59,130,246,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(124,92,255,0.5)]"
          >
            Começar agora
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <a
            href="#como-funciona"
            className="rounded-xl border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-[var(--platform-text)] transition-all duration-300 hover:bg-white/[0.08]"
          >
            Ver como funciona
          </a>
        </motion.div>

        <motion.p
          className="mt-5 text-xs text-[var(--platform-text)]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Sem fidelidade. Cancele quando quiser.
        </motion.p>
      </div>

      {/* Product mockup column */}
      <motion.div
        className="hidden xl:block"
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="animate-float rounded-2xl border border-white/15 bg-[#0A0F1E]/90 p-1 shadow-[0_25px_60px_rgba(59,130,246,0.2),0_10px_20px_rgba(0,0,0,0.4)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 rounded-t-xl bg-[#0D1325] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
            <span className="ml-3 flex-1 rounded-md bg-white/[0.06] px-3 py-1 text-[10px] text-[var(--platform-text)]/40">
              ana-silva.buildsphere.app
            </span>
          </div>

          {/* Simulated site */}
          <div className="space-y-3 rounded-b-xl bg-[#0B1020] p-4">
            {/* Site header */}
            <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
              <span className="text-[11px] font-semibold text-[var(--platform-text)]/80">
                Dra. Ana Silva
              </span>
              <div className="flex gap-2">
                <span className="h-1.5 w-8 rounded-full bg-white/20" />
                <span className="h-1.5 w-8 rounded-full bg-white/15" />
                <span className="h-1.5 w-8 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Hero section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="h-1.5 w-20 rounded-full bg-[#22D3EE]/40" />
                <div className="h-2 w-28 rounded-full bg-white/30" />
                <div className="h-1.5 w-24 rounded-full bg-white/15" />
                <div className="mt-2 h-6 w-16 rounded-md bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)]" />
              </div>
              <div className="rounded-xl bg-[linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,92,255,0.2),rgba(34,211,238,0.1))]" />
            </div>

            {/* Services */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-2"
                >
                  <div className="mx-auto h-5 w-5 rounded-md bg-[#7C5CFF]/20" />
                  <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-white/20" />
                  <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-white/10" />
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] p-2.5 text-center text-[10px] font-semibold text-white">
              Agende sua consulta
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
