"use client";

import { Star } from "lucide-react";
import { AnimatedSection } from "./animated-section";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Criei meu site em 8 minutos. Meus pacientes adoram a página de FAQ — economizo tempo em cada atendimento.",
    name: "Dra. Ana Lima",
    role: "Psicóloga Clínica",
    initials: "AL",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote:
      "O visual ficou incrível com a personalização automática. Recebi elogios dos clientes no primeiro dia.",
    name: "Marcos Ferreira",
    role: "Personal Trainer",
    initials: "MF",
    gradient: "from-orange-500 to-red-500",
  },
  {
    quote:
      "Finalmente tenho uma presença online que representa meu trabalho de verdade. Vale muito o investimento.",
    name: "Júlia Santos",
    role: "Fotógrafa",
    initials: "JS",
    gradient: "from-pink-500 to-rose-600",
  },
];

export function TestimonialsStrip() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
            Depoimentos
          </p>
          <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
            Quem já usa a BuildSphere
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
            Profissionais reais, resultados reais.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#12182B] p-6">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Opening quote */}
                <div
                  className="mb-3 text-4xl font-black leading-none"
                  style={{
                    background: "linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  "
                </div>

                {/* Quote text */}
                <p className="flex-1 text-sm leading-relaxed text-[var(--platform-text)]/80">
                  {t.quote}
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--platform-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--platform-text)]/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
