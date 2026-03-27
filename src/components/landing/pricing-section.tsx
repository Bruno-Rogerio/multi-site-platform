"use client";

import Link from "next/link";
import { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";

type Plan = {
  name: string;
  badge?: string;
  badgeColor?: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
};

function buildPlans(starterPrice: number, basicoPrice: number, premiumPrice: number): Plan[] {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return [
  {
    name: "Starter",
    badge: "Menor preço",
    badgeColor: "emerald",
    price: fmt(starterPrice),
    priceNote: "/mês",
    description:
      "Comece rápido com o essencial. Quatro seções prontas para você publicar em menos de 5 minutos.",
    features: [
      "8 templates disponíveis",
      "4 seções fixas (Capa, Serviços, CTA, Contato)",
      "Até 3 cards de serviço",
      "Subdomínio personalizado",
      "Design 100% responsivo",
      "SSL e hospedagem inclusa",
      "Suporte em até 48h",
    ],
    cta: "Começar com Starter",
    ctaHref: "/quero-comecar?plan=starter",
  },
  {
    name: "Básico",
    price: fmt(basicoPrice),
    priceNote: "/mês",
    description:
      "Acesso completo: todas as 7 seções, serviços ilimitados e botão flutuante para converter mais.",
    features: [
      "20 templates disponíveis",
      "Todas as 7 seções incluídas",
      "Serviços ilimitados",
      "CTA flutuante desbloqueado",
      "SEO básico",
      "Subdomínio personalizado",
      "Suporte em até 24h",
    ],
    cta: "Começar com Básico",
    ctaHref: "/quero-comecar",
  },
  {
    name: "Premium",
    badge: "Recomendado",
    badgeColor: "gradient",
    price: fmt(premiumPrice),
    priceNote: "/mês",
    description:
      "Personalização visual completa, múltiplas páginas e todos os recursos desbloqueados.",
    features: [
      "Tudo do plano Básico",
      "Personalização visual completa",
      "Blog, Galeria e Eventos",
      "FAQ e Depoimentos ilimitados",
      "SEO avançado",
      "Sem branding BuildSphere",
      "Prioridade no suporte",
    ],
    cta: "Quero o Premium",
    ctaHref: "/quero-comecar?plan=premium",
    highlighted: true,
  },
  ];
}

export function PricingSection({ starterPrice, basicoPrice, premiumPrice }: { starterPrice: number; basicoPrice: number; premiumPrice: number }) {
  const plans = buildPlans(starterPrice, basicoPrice, premiumPrice);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <LazyMotion features={domAnimation}>
    <div
      ref={ref}
      className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3"
    >
      {plans.map((plan, i) => (
        <m.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.6,
            delay: 0.15 * i,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className={`relative ${plan.highlighted ? "drop-shadow-[0_0_40px_rgba(124,92,255,0.35)]" : ""}`}
        >
          {/* Border wrapper */}
          <div
            className={`rounded-3xl p-[1px] ${
              plan.highlighted
                ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]"
                : "bg-white/10"
            }`}
          >
            <div className="relative rounded-3xl bg-[#0F162A] p-8">
              {/* Badge */}
              {plan.badge && plan.badgeColor === "gradient" && (
                <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(124,92,255,0.4)]">
                  <Star size={10} fill="white" />
                  {plan.badge}
                </div>
              )}
              {plan.badge && plan.badgeColor === "emerald" && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#059669,#10B981)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
                  <Zap size={10} fill="white" />
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
                      : plan.badgeColor === "emerald"
                      ? "bg-[linear-gradient(135deg,#059669,#22D3EE)] bg-clip-text text-transparent"
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
                      className={`mt-0.5 shrink-0 ${plan.badgeColor === "emerald" ? "text-emerald-400" : "text-[#22D3EE]"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] text-white shadow-[0_10px_40px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(124,92,255,0.5)]"
                    : plan.badgeColor === "emerald"
                    ? "bg-[linear-gradient(135deg,rgba(5,150,105,0.15),rgba(16,185,129,0.15))] border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:bg-[linear-gradient(135deg,rgba(5,150,105,0.25),rgba(16,185,129,0.25))]"
                    : "border border-white/15 bg-white/[0.04] text-[var(--platform-text)] hover:bg-white/[0.08]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        </m.div>
      ))}

      {/* Bottom note */}
      <div className="col-span-full mt-2 space-y-2 text-center">
        <p className="text-xs text-[var(--platform-text)]/45">
          🔒 Pagamento seguro · Sem taxa de setup · Sem fidelidade · Cancele quando quiser
        </p>
        <Link
          href="/premium"
          className="inline-block text-xs font-semibold text-[#22D3EE] transition hover:underline"
        >
          Ver comparativo completo de recursos →
        </Link>
      </div>
    </div>
    </LazyMotion>
  );
}
