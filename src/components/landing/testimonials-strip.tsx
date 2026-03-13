"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Em 3 dias já estava atendendo pacientes vindos do site. Nunca imaginei que fosse tão simples.",
    name: "Dra. Ana Lima",
    role: "Psicóloga · São Paulo, SP",
    initials: "AL",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote: "Meu primeiro cliente premium veio pelo site na primeira semana. O investimento se pagou sozinho.",
    name: "Rafael Santos",
    role: "Coach de Carreira · Belo Horizonte, MG",
    initials: "RS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    quote: "A personalização visual ficou exatamente com a identidade que eu queria para a minha clínica.",
    name: "Dra. Camila Ferreira",
    role: "Nutricionista · Curitiba, PR",
    initials: "CF",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    quote: "Site profissional, rápido e que transmite credibilidade. Meus clientes sempre elogiam.",
    name: "Dr. Bruno Alves",
    role: "Advogado · Rio de Janeiro, RJ",
    initials: "BA",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    quote: "Consegui 15 alunos novos em um mês após publicar o site. A facilidade de editar é incrível.",
    name: "Lucas Martins",
    role: "Personal Trainer · Campinas, SP",
    initials: "LM",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    quote: "A galeria ficou linda e os clientes adoram navegar pelo portfólio antes de contratar.",
    name: "Fernanda Costa",
    role: "Fotógrafa · Porto Alegre, RS",
    initials: "FC",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    quote: "Setup em menos de 10 minutos. Impressionante como é simples com resultado tão profissional.",
    name: "Dr. Marcos Oliveira",
    role: "Fisioterapeuta · Brasília, DF",
    initials: "MO",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    quote: "A identidade visual ficou perfeita para o meu nicho. Recomendo para todos os colegas.",
    name: "Juliana Rocha",
    role: "Terapeuta Holística · Florianópolis, SC",
    initials: "JR",
    gradient: "from-fuchsia-500 to-violet-600",
  },
  {
    quote: "Dobrei a credibilidade percebida pelos meus clientes. O site transmite exatamente o que quero.",
    name: "Pedro Henrique Leal",
    role: "Consultor Financeiro · São Paulo, SP",
    initials: "PH",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    quote: "Finalmente um site à altura do meu trabalho. Funciona impecavelmente no celular.",
    name: "Dra. Isabela Nunes",
    role: "Dermatologista · Recife, PE",
    initials: "IN",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    quote: "Os alunos me encontram pelo Google e já chegam sabendo minha metodologia. Incrível.",
    name: "Thiago Ribeiro",
    role: "Professor Particular · Fortaleza, CE",
    initials: "TR",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    quote: "Achei que seria difícil configurar, mas foi o oposto. Incrível para quem não sabe de código.",
    name: "Amanda Silva",
    role: "Designer Gráfica · Goiânia, GO",
    initials: "AS",
    gradient: "from-orange-500 to-red-600",
  },
  {
    quote: "Em 2 semanas tinha mais de 30 leads vindos do site. Melhor investimento do ano com certeza.",
    name: "Gabriela Pinto",
    role: "Coach de Emagrecimento · Salvador, BA",
    initials: "GP",
    gradient: "from-teal-500 to-green-600",
  },
  {
    quote: "O portfólio ficou impecável. Vários projetos novos vieram de visitantes que encontraram meu site.",
    name: "Carlos Eduardo Mota",
    role: "Arquiteto · Manaus, AM",
    initials: "CE",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    quote: "Meus pacientes conseguem ver minha trajetória antes da consulta. Chegam muito mais confiantes.",
    name: "Dr. Ricardo Lima",
    role: "Ortopedista · Campinas, SP",
    initials: "RL",
    gradient: "from-blue-600 to-violet-600",
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="mx-2 w-[300px] shrink-0 rounded-2xl border border-white/10 bg-[#0E1428] p-5 md:w-[340px]">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[#EAF0FF]/75">&ldquo;{t.quote}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}
        >
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-bold text-[#EAF0FF]">{t.name}</p>
          <p className="text-[11px] text-[#EAF0FF]/45">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof TESTIMONIALS; reverse?: boolean }) {
  return (
    <div className="relative flex overflow-hidden">
      <div
        className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"} gap-0`}
        style={{ animationDuration: "35s" }}
      >
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const half = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, half);
  const row2 = TESTIMONIALS.slice(half);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent" />
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0B1020] to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0B1020] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
            Depoimentos
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#EAF0FF] md:text-4xl">
            Quem já tem o seu site
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#EAF0FF]/55">
            Profissionais autônomos de todo o Brasil que estão crescendo com a BuildSphere.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </motion.div>
    </section>
  );
}
