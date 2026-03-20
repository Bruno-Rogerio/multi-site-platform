"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Star } from "lucide-react";

const PROFESSIONS = [
  "psicólogos",
  "advogados",
  "nutricionistas",
  "coaches",
  "fotógrafos",
  "personal trainers",
  "fisioterapeutas",
  "consultores",
  "terapeutas",
  "professores",
];

const STATS = [
  { value: "500+", label: "Sites publicados", icon: Star },
  { value: "< 5min", label: "Para ficar online", icon: Zap },
  { value: "4.9★", label: "Avaliação média", icon: Sparkles },
];

export function HeroAnimatedHeadline() {
  const [profIndex, setProfIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProfIndex((cur) => (cur + 1) % PROFESSIONS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
      {/* Background graphic elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[15%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#7C5CFF]/15 blur-[100px]" />
        <div className="absolute right-[10%] top-[20%] h-[350px] w-[350px] rounded-full bg-[#22D3EE]/12 blur-[90px]" />
        <div className="absolute bottom-[5%] left-[40%] h-[300px] w-[300px] rounded-full bg-[#3B82F6]/10 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="flex flex-col items-center py-14 text-center md:py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/8 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]"
        >
          <Sparkles size={13} className="animate-pulse" />
          Plataforma para profissionais autônomos
          <span className="ml-1 rounded-full bg-[#22D3EE]/20 px-2 py-0.5 text-[10px]">Novo</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="text-[#EAF0FF]">Seu site</span>
          <br />
          <span className="bg-[linear-gradient(135deg,#3B82F6_0%,#7C5CFF_40%,#22D3EE_100%)] bg-clip-text text-transparent">
            profissional.
          </span>
          <br />
          <span className="text-[#EAF0FF]">Pronto em</span>{" "}
          <span
            className="relative inline-block"
            style={{
              WebkitTextStroke: "2px transparent",
              background: "linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            minutos.
          </span>
        </motion.h1>

        {/* Animated profession */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-3 text-xl text-[#EAF0FF]/60 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span>Feito para</span>
          <span
            className="relative inline-block min-w-[160px] overflow-hidden font-bold sm:min-w-[220px]"
            style={{ height: "1.4em" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={profIndex}
                initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-110%", opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute left-0 top-0 bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent"
              >
                {PROFESSIONS[profIndex]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#EAF0FF]/55 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Configure tudo sozinho em um assistente guiado. Sem código, sem agência,
          sem complicação. Do zero ao site publicado em menos de 5 minutos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/quero-comecar"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-9 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(124,92,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,92,255,0.7)]"
          >
            <span className="relative z-10">Criar meu site grátis</span>
            <ArrowRight
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            />
            <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
          <a
            href="#exemplos"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-9 py-4 text-base font-semibold text-[#EAF0FF]/80 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
          >
            Ver exemplos reais
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {[
            { icon: Shield, text: "Sem taxa de setup" },
            { icon: Zap, text: "Online em minutos" },
            { icon: Star, text: "Cancele quando quiser" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-xs text-[#EAF0FF]/40">
              <Icon size={12} className="text-[#22D3EE]/70" />
              {text}
            </span>
          ))}
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          className="mt-14 grid grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12182B]/80 px-5 py-4 text-center backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.05),rgba(124,92,255,0.05),rgba(34,211,238,0.05))]" />
              <div className="relative">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]">
                    <Icon size={14} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-black text-[#EAF0FF] md:text-3xl">{value}</p>
                <p className="mt-0.5 text-[11px] text-[#EAF0FF]/50">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
