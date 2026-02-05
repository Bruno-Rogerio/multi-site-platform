"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Star } from "lucide-react";

type Plan = {
  name: string;
  badge?: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  extraNote?: string;
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Essencial",
    price: "R$ 59,90",
    priceNote: "/mes",
    description:
      "Para quem quer um site profissional com layouts prontos ou modo construtor.",
    features: [
      "Site profissional completo",
      "Subdominio personalizado",
      "Painel de edicao intuitivo",
      "Design responsivo",
      "SSL e hospedagem inclusa",
      "Suporte por email",
      "Atualizacoes automaticas",
    ],
    extraNote: "Recursos premium disponiveis como add-ons",
    cta: "Comecar agora",
  },
  {
    name: "Premium Full",
    badge: "Recomendado",
    price: "R$ 109,80",
    priceNote: "/mes",
    description:
      "Todos os recursos premium liberados. A experiencia completa da BuildSphere.",
    features: [
      "Tudo do plano Essencial",
      "Construtor completo desbloqueado",
      "Todas as paletas e estilos",
      "Motion e animacoes premium",
      "Layouts exclusivos",
      "Prioridade no suporte",
      "Recursos futuros inclusos",
    ],
    cta: "Quero o Premium",
    highlighted: true,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2"
    >
      {plans.map((plan, i) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.6,
            delay: 0.15 * i,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="relative"
        >
          {/* Shimmer border wrapper */}
          <div
            className={`rounded-3xl p-[1px] ${
              plan.highlighted
                ? "animate-shimmer bg-[linear-gradient(90deg,#3B82F6,#7C5CFF,#22D3EE,#7C5CFF,#3B82F6)]"
                : "bg-white/10"
            }`}
          >
            <div className="relative rounded-3xl bg-[#0F162A] p-8">
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(124,92,255,0.4)]">
                  <Star size={10} fill="white" />
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-bold text-[var(--platform-text)]">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-black ${
                    plan.highlighted
                      ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent"
                      : "text-[var(--platform-text)]"
                  }`}
                >
                  {plan.price}
                </span>
                <span className="text-sm text-[var(--platform-text)]/50">
                  {plan.priceNote}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--platform-text)]/60">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-[var(--platform-text)]/80"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#22D3EE]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.extraNote && (
                <p className="mt-4 text-xs text-[var(--platform-text)]/40 italic">
                  {plan.extraNote}
                </p>
              )}

              <Link
                href="/quero-comecar"
                className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,92,255,0.4)]"
                    : "border border-white/15 bg-white/[0.04] text-[var(--platform-text)] hover:bg-white/[0.08]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Bottom note */}
      <div className="col-span-full mt-2 text-center">
        <p className="text-xs text-[var(--platform-text)]/45">
          Sem taxa de setup. Sem fidelidade. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}
