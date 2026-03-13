"use client";

import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Check,
  Minus,
  Sparkles,
  Palette,
  BookOpen,
  ImageIcon,
  CalendarDays,
  Search,
  EyeOff,
  Star,
  ArrowRight,
  Shield,
} from "lucide-react";
/* ─── Feature comparison data ──────────────────────────── */

const FEATURES = [
  { label: "Site profissional completo",    basic: true,  premium: true },
  { label: "Subdomínio personalizado",       basic: true,  premium: true },
  { label: "Design responsivo + SSL",        basic: true,  premium: true },
  { label: "Suporte por e-mail",             basic: true,  premium: true },
  { label: "Personalização visual com IA",   basic: false, premium: true },
  { label: "FAQ interativo",                 basic: false, premium: true },
  { label: "Blog / Artigos",                 basic: false, premium: true },
  { label: "Galeria / Portfólio",            basic: false, premium: true },
  { label: "Eventos / Agenda",               basic: false, premium: true },
  { label: "Depoimentos ilimitados",         basic: false, premium: true },
  { label: "SEO configurável",               basic: false, premium: true },
  { label: "Sem branding BuildSphere",       basic: false, premium: true },
  { label: "Prioridade no suporte",          basic: false, premium: true },
];

const DIFFERENTIALS = [
  {
    Icon: Palette,
    title: "Identidade Visual com IA",
    description:
      "4 escolhas estratégicas geram seu tema completo: cor, tom, personalidade e animações. Sem precisar entender de design.",
  },
  {
    Icon: BookOpen,
    title: "Blog, Galeria e Eventos",
    description:
      "Publique artigos, mostre seu portfólio e divulgue seus próximos eventos. Tudo integrado ao seu site.",
  },
  {
    Icon: Search,
    title: "SEO Configurável",
    description:
      "Defina o título e a descrição que aparecem no Google e nas redes sociais. Mais visibilidade para o seu negócio.",
  },
  {
    Icon: EyeOff,
    title: "Sem branding BuildSphere",
    description:
      "Remova o crédito do rodapé e apresente um site 100% com a sua marca. Profissionalismo total.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "O premium valeu cada centavo. Em dois dias já tinha blog, galeria e meu site aparecendo no Google.",
    name: "Dra. Ana Lima",
    role: "Psicóloga",
    initials: "AL",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote:
      "A personalização visual com IA me surpreendeu. Ficou com a cara certa para advocacia sem eu saber nada de design.",
    name: "Dr. Carlos Ramos",
    role: "Advogado",
    initials: "CR",
    gradient: "from-blue-500 to-indigo-600",
  },
];

/* ─── Component ─────────────────────────────────────────── */

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function PremiumPage({ brandElement, basicoPrice = 59.9, premiumPrice = 109.8 }: { brandElement: React.ReactNode; basicoPrice?: number; premiumPrice?: number }) {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#EAF0FF]" style={{ fontFamily: "var(--font-sora, Sora, sans-serif)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {brandElement}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-[#EAF0FF]/60 hover:text-[#EAF0FF] transition">
              Início
            </Link>
            <Link
              href="/quero-comecar?plan=premium"
              className="rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              Começar agora
            </Link>
          </div>
        </div>
      </header>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-[#7C5CFF]/8 blur-[120px]" />
        <div className="absolute right-[5%] top-[40%] h-[400px] w-[400px] rounded-full bg-[#22D3EE]/6 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Hero */}
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">
              <Sparkles size={13} />
              Plano Premium
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Tudo que você precisa para{" "}
              <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                um site incrível
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#EAF0FF]/65">
              Personalização visual com IA, blog, galeria, eventos, SEO e sem branding BuildSphere.
              Por{" "}
              <span className="font-bold text-[#EAF0FF]">{fmt(premiumPrice)}/mês</span>{" "}
              — sem fidelidade, cancele quando quiser.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/quero-comecar?plan=premium"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] transition hover:brightness-110"
              >
                Quero o Premium
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/#pricing"
                className="text-sm font-medium text-[#EAF0FF]/50 hover:text-[#EAF0FF] transition"
              >
                Ver todos os planos →
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Feature comparison */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-black">Comparativo de planos</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_120px] bg-[#12182B] px-6 py-4">
                <div />
                <div className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#EAF0FF]/50">
                  Básico
                  <div className="mt-0.5 text-base font-bold text-[#EAF0FF]">{fmt(basicoPrice)}</div>
                </div>
                <div className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#22D3EE]">
                  Premium ★
                  <div className="mt-0.5 text-base font-bold text-[#EAF0FF]">{fmt(premiumPrice)}</div>
                </div>
              </div>

              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_100px_120px] items-center border-t border-white/[0.06] px-6 py-3.5"
                  style={{ backgroundColor: feature.premium && !feature.basic ? "rgba(34,211,238,0.03)" : undefined }}
                >
                  <span className="text-sm text-[#EAF0FF]/80">{feature.label}</span>
                  <div className="flex justify-center">
                    {feature.basic ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <Minus size={16} className="text-[#EAF0FF]/20" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {feature.premium ? (
                      <Check size={16} className="text-[#22D3EE]" />
                    ) : (
                      <Minus size={16} className="text-[#EAF0FF]/20" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Differentials */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-black">O que só o Premium oferece</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {DIFFERENTIALS.map(({ Icon, title, description }, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] text-white">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#EAF0FF]/60">{description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Testimonials */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-black">Quem já usa o Premium</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {TESTIMONIALS.map(({ quote, name, role, initials, gradient }, i) => (
                <FadeIn key={i} delay={0.1 * i}>
                  <div className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[#EAF0FF]/80">"{quote}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-bold text-white`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{name}</p>
                        <p className="text-xs text-[#EAF0FF]/50">{role}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Final CTA */}
        <FadeIn delay={0.1}>
          <div className="mt-20 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] p-0.5">
            <div className="rounded-[calc(1.5rem-2px)] bg-[#0B1020] px-8 py-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Comece hoje
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                {fmt(premiumPrice)}<span className="text-lg font-normal text-[#EAF0FF]/50">/mês</span>
              </h2>
              <p className="mt-3 text-[#EAF0FF]/60">
                Sem taxa de setup · Sem fidelidade · Cancele quando quiser
              </p>
              <Link
                href="/quero-comecar?plan=premium"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-10 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.35)] transition hover:brightness-110"
              >
                Começar agora <ArrowRight size={18} />
              </Link>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#EAF0FF]/40">
                <Shield size={13} />
                Pagamento seguro · Dados protegidos
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
