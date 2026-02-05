"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-5 py-20 md:px-8 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE,#3B82F6)] bg-[length:300%_300%] animate-gradient-text p-12 text-center md:p-16"
      >
        {/* Grain overlay */}
        <div className="bg-grain pointer-events-none absolute inset-0" />

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white md:text-5xl">
            Pronto para ter seu site profissional?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85">
            Junte-se a centenas de profissionais que ja transformaram sua
            presenca online com a BuildSphere.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quero-comecar"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#0B1020] shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              Comecar agora
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
