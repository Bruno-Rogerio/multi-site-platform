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
  ArrowRight,
  Shield,
  Zap,
  Star,
  Crown,
  MessageSquare,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */

const FEATURES = [
  // ── Incluso em ambos ──
  { label: "Site profissional completo",         basic: true,  premium: true },
  { label: "Subdomínio personalizado",           basic: true,  premium: true },
  { label: "Design responsivo",                  basic: true,  premium: true },
  { label: "SSL gratuito automático",            basic: true,  premium: true },
  { label: "Edição pelo painel",                 basic: true,  premium: true },
  { label: "Logo personalizada",                 basic: true,  premium: true },
  { label: "Suporte por e-mail",                 basic: true,  premium: true },
  // ── Só no Premium ──
  { label: "Personalização visual com IA",       basic: false, premium: true },
  { label: "13 paletas + cores + fontes",        basic: false, premium: true },
  { label: "Blog / Artigos",                     basic: false, premium: true },
  { label: "Galeria / Portfólio",                basic: false, premium: true },
  { label: "Eventos / Agenda",                   basic: false, premium: true },
  { label: "FAQ interativo",                     basic: false, premium: true },
  { label: "SEO configurável",                   basic: false, premium: true },
  { label: "Sem branding BuildSphere",           basic: false, premium: true },
  { label: "Suporte prioritário",                basic: false, premium: true },
];

const DIFFERENTIALS = [
  {
    Icon: Palette,
    emoji: "🎨",
    title: "Identidade Visual com IA",
    description:
      "Responda 4 perguntas e a IA gera seu tema completo: paleta de cores, tipografia, estilo dos botões e muito mais. Resultado profissional sem precisar entender de design.",
    accent: "#7C5CFF",
  },
  {
    Icon: BookOpen,
    emoji: "📝",
    title: "Blog, Galeria e Eventos",
    description:
      "Publique artigos para ranquear no Google, mostre seu portfólio em uma galeria elegante e divulgue sua agenda de eventos. Tudo integrado ao seu site.",
    accent: "#3B82F6",
  },
  {
    Icon: Search,
    emoji: "🔍",
    title: "SEO Configurável",
    description:
      "Defina o título e a meta descrição que aparecem no Google e nas redes sociais. Atraia mais visitantes orgânicos e expanda sua visibilidade.",
    accent: "#22D3EE",
  },
  {
    Icon: EyeOff,
    emoji: "✦",
    title: "Sem branding BuildSphere",
    description:
      "Remova o crédito do rodapé e apresente um site 100% com a sua marca. Seus clientes veem apenas você — profissionalismo total.",
    accent: "#A855F7",
  },
  {
    Icon: MessageSquare,
    emoji: "⚡",
    title: "Suporte Prioritário",
    description:
      "Seus chamados sobem para o topo da fila. Atendimento mais rápido e dedicado para resolver suas dúvidas e garantir que seu site funcione perfeitamente.",
    accent: "#F59E0B",
  },
  {
    Icon: ImageIcon,
    emoji: "🖼️",
    title: "Galeria / Portfólio",
    description:
      "Mostre seus trabalhos, fotos de clientes ou projetos em uma galeria visualmente impactante. Converta visitantes em clientes com prova social visual.",
    accent: "#10B981",
  },
];

/* ─── Helpers ────────────────────────────────────────────── */

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Before / After mockup ──────────────────────────────── */

function BeforeAfterSection() {
  return (
    <div className="mt-20">
      <FadeIn>
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Comparação visual</p>
          <h2 className="mt-3 text-2xl font-black md:text-3xl">Antes e depois do Premium</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#EAF0FF]/55">
            O mesmo profissional. A mesma plataforma. Uma diferença enorme na apresentação.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-4 md:grid-cols-2">
          {/* BEFORE — Básico */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428]">
            <div className="border-b border-white/10 bg-[#0B1120] px-5 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#EAF0FF]/40">Plano Básico</p>
            </div>
            {/* Mini site mockup */}
            <div className="p-4">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080D1A]">
                {/* Browser bar */}
                <div className="flex items-center gap-1.5 bg-[#0A0F1E] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                  <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 flex-1 rounded bg-white/[0.05] px-2 py-0.5 text-[9px] text-white/30">
                    ana-silva.bsph.com.br
                  </span>
                </div>
                {/* Site content */}
                <div className="space-y-2.5 bg-[#F8F8F8] p-3">
                  {/* Header */}
                  <div className="flex items-center justify-between rounded bg-white px-2.5 py-1.5 shadow-sm">
                    <div className="h-2 w-16 rounded-full bg-gray-300" />
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-7 rounded-full bg-gray-200" />
                      <div className="h-1.5 w-7 rounded-full bg-gray-200" />
                    </div>
                  </div>
                  {/* Hero — plain blue */}
                  <div className="rounded bg-[#3B82F6] p-3 text-center">
                    <div className="mx-auto mb-1.5 h-2 w-24 rounded-full bg-white/60" />
                    <div className="mx-auto mb-2 h-1.5 w-32 rounded-full bg-white/40" />
                    <div className="mx-auto h-5 w-16 rounded bg-white/30" />
                  </div>
                  {/* Services */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded bg-white p-1.5 shadow-sm">
                        <div className="mx-auto mb-1 h-3 w-3 rounded bg-gray-200" />
                        <div className="mx-auto h-1 w-8 rounded-full bg-gray-200" />
                      </div>
                    ))}
                  </div>
                  {/* Footer with BuildSphere branding */}
                  <div className="rounded bg-gray-100 px-2 py-1.5 text-center">
                    <p className="text-[8px] text-gray-400">Powered by BuildSphere</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Missing features */}
            <div className="space-y-2 px-5 pb-5">
              {["Personalização visual limitada", "Rodapé com branding BuildSphere", "Sem blog, galeria ou eventos", "Sem SEO configurável"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Minus size={13} className="shrink-0 text-[#EAF0FF]/20" />
                  <span className="text-xs text-[#EAF0FF]/40">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER — Premium */}
          <div className="relative overflow-hidden rounded-3xl border border-[#7C5CFF]/40 bg-[#0E1428]">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,0.15),transparent_60%)]" />
            </div>
            <div className="relative border-b border-[#7C5CFF]/20 bg-[linear-gradient(135deg,rgba(124,92,255,0.15),rgba(34,211,238,0.08))] px-5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#A78BFA]">Plano Premium</p>
                <span className="flex items-center gap-1 rounded-full bg-[#7C5CFF]/20 px-2 py-0.5 text-[10px] font-bold text-[#A78BFA]">
                  <Crown size={10} /> Recomendado
                </span>
              </div>
            </div>
            {/* Mini site mockup — premium themed */}
            <div className="p-4">
              <div className="overflow-hidden rounded-2xl border border-[#7C5CFF]/20 bg-[#080D1A]">
                <div className="flex items-center gap-1.5 bg-[#0A0F1E] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                  <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 flex-1 rounded bg-white/[0.05] px-2 py-0.5 text-[9px] text-white/30">
                    ana-silva.bsph.com.br
                  </span>
                </div>
                {/* Site — IA-generated violet theme */}
                <div className="space-y-2.5 bg-[#1C0F2E] p-3">
                  {/* Header — custom color */}
                  <div className="flex items-center justify-between rounded bg-[#2D1654] px-2.5 py-1.5">
                    <div className="h-2 w-16 rounded-full bg-[#A78BFA]/60" />
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-7 rounded-full bg-white/15" />
                      <div className="h-1.5 w-7 rounded-full bg-white/15" />
                    </div>
                  </div>
                  {/* Hero — AI theme */}
                  <div className="rounded bg-[linear-gradient(135deg,#7C3AED,#A78BFA)] p-3 text-center">
                    <div className="mx-auto mb-1.5 h-2 w-24 rounded-full bg-white/70" />
                    <div className="mx-auto mb-2 h-1.5 w-32 rounded-full bg-white/50" />
                    <div className="mx-auto h-5 w-16 rounded-full bg-white/40" />
                  </div>
                  {/* Blog + Galeria badges */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {([["📝", "Blog"], ["🖼️", "Galeria"], ["📅", "Eventos"]] as [string, string][]).map(([icon, label]) => (
                      <div key={label} className="rounded bg-[#2D1654]/80 p-1.5 text-center">
                        <p style={{fontSize: "10px"}}>{icon}</p>
                        <p className="mt-0.5 text-[7px] text-[#A78BFA]/80 font-medium">{label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Footer — no branding */}
                  <div className="rounded bg-[#2D1654]/50 px-2 py-1.5 text-center">
                    <p className="text-[8px] text-[#A78BFA]/50">Dra. Ana Silva · Psicóloga</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Premium features */}
            <div className="space-y-2 px-5 pb-5">
              {["Identidade visual gerada com IA", "Sem branding BuildSphere", "Blog, galeria e eventos ativos", "SEO com título e descrição próprios"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-[#A78BFA]" />
                  <span className="text-xs text-[#EAF0FF]/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */

export function PremiumPage({
  brandElement,
  basicoPrice = 59.9,
  premiumPrice = 109.8,
}: {
  brandElement: React.ReactNode;
  basicoPrice?: number;
  premiumPrice?: number;
}) {
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      className="min-h-screen bg-[#0B1020] text-[#EAF0FF]"
      style={{ fontFamily: "var(--font-sora, Sora, sans-serif)" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#7C5CFF,#22D3EE,transparent)]" />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {brandElement}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#EAF0FF]/50 transition hover:text-[#EAF0FF]">
              Início
            </Link>
            <Link href="#comparativo" className="hidden text-sm text-[#EAF0FF]/50 transition hover:text-[#EAF0FF] md:block">
              Comparativo
            </Link>
            <Link
              href="/quero-comecar?plan=premium"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,92,255,0.35)] transition hover:brightness-110"
            >
              <Crown size={14} /> Quero o Premium
            </Link>
          </div>
        </div>
      </header>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#7C5CFF]/10 blur-[130px]" />
        <div className="absolute right-[5%] top-[30%] h-[500px] w-[500px] rounded-full bg-[#22D3EE]/7 blur-[110px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#3B82F6]/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">

        {/* ── Hero ── */}
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/40 bg-[#7C5CFF]/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A78BFA]">
              <Crown size={12} />
              Plano Premium
              <span className="rounded-full bg-[#7C5CFF]/30 px-2 py-0.5 text-[10px]">✦ Mais popular</span>
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Tudo que você precisa para{" "}
              <span className="bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] bg-clip-text text-transparent">
                se destacar online
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#EAF0FF]/60">
              Visual gerado com IA, blog, galeria, eventos, SEO avançado e seu site sem rodapé de terceiros.
              Tudo por{" "}
              <span className="font-bold text-[#EAF0FF]">{fmt(premiumPrice)}/mês</span>{" "}
              — sem fidelidade, cancele quando quiser.
            </p>

            {/* Price highlight */}
            <div className="mx-auto mt-8 inline-block rounded-2xl border border-[#7C5CFF]/30 bg-[linear-gradient(135deg,rgba(124,92,255,0.12),rgba(34,211,238,0.08))] px-8 py-5">
              <p className="text-4xl font-black text-[#EAF0FF]">
                {fmt(premiumPrice)}
                <span className="ml-1 text-lg font-normal text-[#EAF0FF]/50">/mês</span>
              </p>
              <p className="mt-1 text-xs text-[#EAF0FF]/40">Sem taxa de setup · Cancele quando quiser</p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/quero-comecar?plan=premium"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-9 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,92,255,0.6)]"
              >
                Quero o Premium agora
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#precos"
                className="text-sm text-[#EAF0FF]/45 transition hover:text-[#EAF0FF]"
              >
                Ver plano Básico →
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* ── Before / After ── */}
        <BeforeAfterSection />

        {/* ── Feature comparison table ── */}
        <FadeIn delay={0.1}>
          <div id="comparativo" className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Comparativo</p>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">O que está incluso em cada plano</h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_110px_140px] bg-[#0E1428]">
                <div className="border-b border-white/10 px-6 py-5" />

                {/* Básico header */}
                <div className="border-b border-l border-white/10 px-4 py-5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#EAF0FF]/40">Básico</p>
                  <p className="mt-1.5 text-xl font-black text-[#EAF0FF]">{fmt(basicoPrice)}</p>
                  <p className="text-[10px] text-[#EAF0FF]/30">/mês</p>
                </div>

                {/* Premium header */}
                <div className="relative border-b border-l border-[#7C5CFF]/30 bg-[linear-gradient(180deg,rgba(124,92,255,0.12),rgba(124,92,255,0.04))] px-4 py-5 text-center">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#7C5CFF,#22D3EE)]" />
                  <div className="mb-1 flex justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#7C5CFF]/20 px-2 py-0.5 text-[9px] font-bold text-[#A78BFA]">
                      <Sparkles size={9} /> POPULAR
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A78BFA]">Premium</p>
                  <p className="mt-1.5 text-xl font-black text-[#EAF0FF]">{fmt(premiumPrice)}</p>
                  <p className="text-[10px] text-[#EAF0FF]/30">/mês</p>
                </div>
              </div>

              {/* Feature rows */}
              {FEATURES.map((feature, i) => {
                const isPremiumOnly = feature.premium && !feature.basic;
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1fr_110px_140px] items-center border-t border-white/[0.06] ${
                      isPremiumOnly ? "bg-[rgba(124,92,255,0.03)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 px-6 py-3.5">
                      <span className={`text-sm ${isPremiumOnly ? "text-[#EAF0FF]/80" : "text-[#EAF0FF]/65"}`}>
                        {feature.label}
                      </span>
                      {isPremiumOnly && (
                        <span className="rounded-full bg-[#7C5CFF]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#A78BFA]">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center border-l border-white/[0.06] py-3.5">
                      {feature.basic ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <Minus size={14} className="text-[#EAF0FF]/15" />
                      )}
                    </div>
                    <div className="flex justify-center border-l border-[#7C5CFF]/20 bg-[rgba(124,92,255,0.02)] py-3.5">
                      {feature.premium ? (
                        <Check size={16} className="text-[#A78BFA]" />
                      ) : (
                        <Minus size={14} className="text-[#EAF0FF]/15" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Table footer CTAs */}
              <div className="grid grid-cols-[1fr_110px_140px] border-t border-white/10 bg-[#0E1428]">
                <div className="px-6 py-5" />
                <div className="border-l border-white/10 px-3 py-5 text-center">
                  <Link
                    href="/quero-comecar"
                    className="block rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-[#EAF0FF]/70 transition hover:bg-white/[0.08]"
                  >
                    Começar
                  </Link>
                </div>
                <div className="border-l border-[#7C5CFF]/20 bg-[rgba(124,92,255,0.04)] px-3 py-5 text-center">
                  <Link
                    href="/quero-comecar?plan=premium"
                    className="block rounded-xl bg-[linear-gradient(135deg,#7C5CFF,#22D3EE)] px-3 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(124,92,255,0.4)] transition hover:brightness-110"
                  >
                    Quero o Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Differentials bento ── */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Exclusivo Premium</p>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">O que muda na prática</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#EAF0FF]/55">
                Cada recurso Premium foi pensado para você atrair mais clientes e vender mais.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DIFFERENTIALS.map(({ emoji, title, description, accent }, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div
                    className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-6 transition-all duration-500 hover:border-white/20"
                    style={{ ["--accent" as string]: accent }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(300px circle at 0% 0%, ${accent}18, transparent 70%)` }}
                    />
                    <div className="relative">
                      <div
                        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                        style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
                      >
                        {emoji}
                      </div>
                      <h3 className="text-base font-bold text-[#EAF0FF]">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#EAF0FF]/55">{description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Dramatic Final CTA ── */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] p-px">
                <div className="h-full w-full rounded-3xl bg-[#080D1C]" />
              </div>

              <div className="relative px-8 py-16 text-center md:py-20">
                {/* Background effects */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-[20%] top-[-30%] h-[350px] w-[350px] rounded-full bg-[#7C5CFF]/20 blur-[90px]" />
                  <div className="absolute right-[15%] bottom-[-20%] h-[300px] w-[300px] rounded-full bg-[#22D3EE]/15 blur-[80px]" />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(124,92,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>

                <div className="relative">
                  <Crown size={32} className="mx-auto mb-4 text-[#A78BFA]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A78BFA]">
                    Garanta o Premium hoje
                  </p>
                  <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black md:text-4xl lg:text-5xl">
                    Seu site merece o<br />
                    <span className="bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] bg-clip-text text-transparent">
                      melhor tratamento
                    </span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-base text-[#EAF0FF]/55">
                    Profissionais Premium têm sites que vendem por si mesmos. IA, SEO, galeria, blog — tudo em um clique.
                  </p>

                  {/* Trust row */}
                  <div className="mx-auto mt-8 inline-grid grid-cols-3 gap-3">
                    {[
                      { icon: Zap, value: "Acesso imediato", desc: "Ativo após o pagamento" },
                      { icon: Star, value: "Sem fidelidade", desc: "Cancele quando quiser" },
                      { icon: Shield, value: "Pagamento seguro", desc: "Processado via Stripe" },
                    ].map(({ icon: Icon, value, desc }) => (
                      <div key={value} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                        <Icon size={16} className="mx-auto mb-1.5 text-[#A78BFA]" />
                        <p className="text-xs font-bold text-[#EAF0FF]">{value}</p>
                        <p className="mt-0.5 text-[10px] text-[#EAF0FF]/40">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/quero-comecar?plan=premium"
                      className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] px-10 py-4 text-base font-bold text-white shadow-[0_0_50px_rgba(124,92,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_70px_rgba(124,92,255,0.7)]"
                    >
                      <Crown size={16} />
                      Começar com Premium
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-[#EAF0FF]/60 transition hover:border-white/25 hover:text-[#EAF0FF]"
                    >
                      Voltar ao início
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-5 text-[10px] text-[#EAF0FF]/25">
                    <Link href="/termos" className="hover:text-[#EAF0FF]/60 transition">Termos de Uso</Link>
                    <span>·</span>
                    <Link href="/privacidade" className="hover:text-[#EAF0FF]/60 transition">Privacidade</Link>
                    <span>·</span>
                    <span>Pagamento processado pela Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
