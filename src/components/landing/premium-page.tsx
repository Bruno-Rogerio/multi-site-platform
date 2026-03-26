"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import {
  Check,
  Minus,
  Sparkles,
  Palette,
  BookOpen,
  ImageIcon,
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
  // ── Incluso em todos ──
  { label: "Site profissional completo",           starter: true,  basic: true,  premium: true },
  { label: "Subdomínio personalizado",             starter: true,  basic: true,  premium: true },
  { label: "Design responsivo (mobile + desktop)", starter: true,  basic: true,  premium: true },
  { label: "SSL gratuito automático",              starter: true,  basic: true,  premium: true },
  { label: "Edição pelo painel",                   starter: true,  basic: true,  premium: true },
  { label: "Logo personalizada",                   starter: true,  basic: true,  premium: true },
  // ── Diferenças de capacidade ──
  { label: "Templates disponíveis (8 / 20 / 20)",  starter: true,  basic: true,  premium: true },
  { label: "Seções (4 fixas / 7 / 7)",             starter: true,  basic: true,  premium: true },
  { label: "Cards de serviço (máx. 3 / ∞ / ∞)",   starter: true,  basic: true,  premium: true },
  // ── Só no Básico e Premium ──
  { label: "CTA flutuante (WhatsApp, Tel…)",       starter: false, basic: true,  premium: true },
  { label: "Seções: Números, Sobre, Depoimentos",  starter: false, basic: true,  premium: true },
  { label: "SEO básico",                           starter: false, basic: true,  premium: true },
  { label: "Suporte em até 24h",                   starter: false, basic: true,  premium: true },
  // ── Só no Premium ──
  { label: "Identidade visual com IA",             starter: false, basic: false, premium: true },
  { label: "13 paletas + cores + fontes livres",   starter: false, basic: false, premium: true },
  { label: "Blog / Artigos",                       starter: false, basic: false, premium: true },
  { label: "Galeria / Portfólio",                  starter: false, basic: false, premium: true },
  { label: "Eventos / Agenda",                     starter: false, basic: false, premium: true },
  { label: "FAQ interativo",                       starter: false, basic: false, premium: true },
  { label: "SEO avançado (meta tags por página)",  starter: false, basic: false, premium: true },
  { label: "Sem branding BuildSphere",             starter: false, basic: false, premium: true },
  { label: "Suporte prioritário (até 2h)",         starter: false, basic: false, premium: true },
];

const DIFFERENTIALS = [
  {
    emoji: "🎨",
    Icon: Palette,
    title: "Identidade Visual com IA",
    description:
      "Responda 4 perguntas e a IA gera seu tema completo: paleta de cores, tipografia e estilo dos botões. Resultado profissional sem precisar entender de design.",
    accent: "#7C5CFF",
  },
  {
    emoji: "📝",
    Icon: BookOpen,
    title: "Blog, Galeria e Eventos",
    description:
      "Publique artigos para ranquear no Google, mostre seu portfólio em galeria elegante e divulgue sua agenda. Tudo integrado ao seu site.",
    accent: "#3B82F6",
  },
  {
    emoji: "🔍",
    Icon: Search,
    title: "SEO Avançado",
    description:
      "Defina título e meta descrição para cada página. Controle como seu site aparece no Google e nas redes sociais e atraia mais visitantes orgânicos.",
    accent: "#22D3EE",
  },
  {
    emoji: "✦",
    Icon: EyeOff,
    title: "Sem Branding BuildSphere",
    description:
      "Remova o crédito do rodapé e apresente um site 100% com a sua marca. Seus clientes veem apenas você — profissionalismo total.",
    accent: "#A855F7",
  },
  {
    emoji: "⚡",
    Icon: MessageSquare,
    title: "Suporte Prioritário",
    description:
      "Seus chamados sobem para o topo da fila. Atendimento dedicado (até 2h) para resolver suas dúvidas e garantir que tudo funcione perfeitamente.",
    accent: "#F59E0B",
  },
  {
    emoji: "🖼️",
    Icon: ImageIcon,
    title: "Galeria / Portfólio",
    description:
      "Mostre trabalhos, fotos de clientes ou projetos em uma galeria impactante. Converta visitantes em clientes com prova social visual de alto nível.",
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

function BeforeAfterSection({ basicoPrice, premiumPrice }: { basicoPrice: number; premiumPrice: number }) {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="mt-20">
      <FadeIn>
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Na prática</p>
          <h2 className="mt-3 text-2xl font-black md:text-3xl">O mesmo site. Uma diferença enorme.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#EAF0FF]/55">
            Veja o que muda visualmente quando você vai do Básico para o Premium — mesma plataforma, outro nível de apresentação.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-6 md:grid-cols-2">

          {/* ── BEFORE — Plano Básico ── */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-[#EAF0FF]/40">
                Plano Básico · {fmt(basicoPrice)}/mês
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080D1A]">
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#0A0F1E] px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                <div className="ml-2 flex-1 rounded bg-white/[0.05] px-3 py-1 text-[9px] text-white/25">
                  ana-silva.bsph.com.br
                </div>
              </div>

              {/* Site – light / generic */}
              <div className="bg-[#F2F4F8]">
                {/* Site header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-300" />
                    <div className="h-2 w-20 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-gray-200" />
                    <div className="h-1.5 w-8 rounded-full bg-gray-200" />
                    <div className="h-1.5 w-8 rounded-full bg-gray-200" />
                  </div>
                </div>

                {/* Hero – flat solid */}
                <div className="bg-[#3B82F6] px-4 py-5 text-center">
                  <div className="mx-auto mb-2 h-2 w-28 rounded-full bg-white/60" />
                  <div className="mx-auto mb-1.5 h-1.5 w-20 rounded-full bg-white/40" />
                  <div className="mx-auto mb-1 h-1 w-24 rounded-full bg-white/25" />
                  <div className="mx-auto mt-3 h-6 w-20 rounded bg-white/20" />
                </div>

                {/* Services – max 3 cards */}
                <div className="grid grid-cols-3 gap-2 p-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-white p-2 shadow-sm">
                      <div className="mx-auto mb-1 h-5 w-5 rounded bg-gray-200" />
                      <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-200" />
                      <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-gray-100" />
                    </div>
                  ))}
                </div>

                {/* Footer – branding visível */}
                <div className="border-t border-gray-200 bg-gray-100 py-2.5 text-center">
                  <span className="text-[8px] font-semibold tracking-wide text-gray-400">Criado com BuildSphere</span>
                </div>
              </div>
            </div>

            {/* Limitações */}
            <div className="mt-4 space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#EAF0FF]/25">O que falta neste plano</p>
              {[
                "Design padrão, sem identidade visual personalizada",
                "Rodapé com branding BuildSphere sempre visível",
                "Sem blog, galeria ou agenda de eventos",
                "SEO básico — sem controle de meta tags por página",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Minus size={12} className="mt-0.5 shrink-0 text-[#EAF0FF]/20" />
                  <span className="text-xs leading-relaxed text-[#EAF0FF]/40">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AFTER — Plano Premium ── */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/15 px-3 py-1 text-[11px] font-semibold text-[#A78BFA]">
                <Crown size={10} />
                Plano Premium · {fmt(premiumPrice)}/mês
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#7C5CFF]/30 bg-[#080D1A]">
              {/* Gradient top line */}
              <div className="h-0.5 bg-[linear-gradient(90deg,#7C5CFF,#A855F7,#22D3EE)]" />

              {/* Browser bar */}
              <div className="flex items-center gap-1.5 border-b border-[#7C5CFF]/10 bg-[#0F0A1E] px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                <div className="ml-2 flex-1 rounded bg-[#7C5CFF]/10 px-3 py-1 text-[9px] text-[#A78BFA]/40">
                  ana-silva.bsph.com.br
                </div>
              </div>

              {/* Site – dark AI theme */}
              <div className="bg-[#1A0F2E]">
                {/* Site header – custom branded */}
                <div className="flex items-center justify-between border-b border-[#7C5CFF]/15 bg-[#250D40] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#A78BFA]/40" />
                    <div className="h-2 w-20 rounded-full bg-[#A78BFA]/60" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-white/15" />
                    <div className="h-1.5 w-8 rounded-full bg-white/10" />
                    <div className="h-1.5 w-8 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Hero – AI gradient */}
                <div className="bg-[linear-gradient(135deg,#6D28D9,#7C3AED,#A855F7)] px-4 py-5 text-center">
                  <div className="mx-auto mb-1.5 h-1.5 w-14 rounded-full bg-[#22D3EE]/70" />
                  <div className="mx-auto mb-2 h-2.5 w-28 rounded-full bg-white/75" />
                  <div className="mx-auto mb-1 h-1.5 w-20 rounded-full bg-white/40" />
                  <div className="mx-auto mt-3 h-6 w-20 rounded-full border border-white/30 bg-white/15" />
                </div>

                {/* Extra sections – desbloqueadas */}
                <div className="grid grid-cols-4 gap-1.5 p-3">
                  {(
                    [
                      ["📝", "Blog"],
                      ["🖼️", "Galeria"],
                      ["📅", "Eventos"],
                      ["❓", "FAQ"],
                    ] as [string, string][]
                  ).map(([icon, label]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-[#7C5CFF]/20 bg-[#2D1654]/50 p-1.5 text-center"
                    >
                      <p className="mb-0.5 text-[10px]">{icon}</p>
                      <p className="text-[7px] font-semibold text-[#A78BFA]/80">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Footer – sem branding */}
                <div className="border-t border-[#7C5CFF]/10 bg-[#0F0A1E] py-2.5 text-center">
                  <span className="text-[8px] text-[#A78BFA]/40">© Dra. Ana Silva · Psicóloga Clínica</span>
                </div>
              </div>
            </div>

            {/* Vantagens */}
            <div className="mt-4 space-y-2 rounded-xl border border-[#7C5CFF]/20 bg-[#7C5CFF]/[0.04] p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A78BFA]/50">O que você ganha com Premium</p>
              {[
                "Identidade visual única gerada por IA em segundos",
                "Site 100% da sua marca, sem créditos externos",
                "Blog, galeria e eventos desbloqueados",
                "SEO avançado com controle de meta tags por página",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7C5CFF]/25">
                    <Check size={8} className="text-[#A78BFA]" />
                  </div>
                  <span className="text-xs leading-relaxed text-[#EAF0FF]/70">{item}</span>
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
  starterPrice = 29.9,
  basicoPrice = 59.9,
  premiumPrice = 109.8,
}: {
  brandElement: React.ReactNode;
  starterPrice?: number;
  basicoPrice?: number;
  premiumPrice?: number;
}) {
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Track visit to /premium page
  useEffect(() => {
    void fetch("/api/analytics/platform-pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/premium" }),
    }).catch(() => {});
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0B1020] text-[#EAF0FF]"
      style={{ fontFamily: "var(--font-sora, Sora, sans-serif)" }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#7C5CFF,#22D3EE,transparent)]" />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {brandElement}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="hidden text-sm text-[#EAF0FF]/50 transition hover:text-[#EAF0FF] sm:block"
            >
              Início
            </Link>
            <Link
              href="#comparativo"
              className="hidden text-sm text-[#EAF0FF]/50 transition hover:text-[#EAF0FF] md:block"
            >
              Comparativo
            </Link>
            <Link
              href="/quero-comecar?plan=premium"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,92,255,0.35)] transition hover:brightness-110 sm:px-5"
            >
              <Crown size={14} />
              <span className="hidden xs:inline">Quero o Premium</span>
              <span className="xs:hidden">Premium</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[5%] h-[500px] w-[500px] rounded-full bg-[#7C5CFF]/10 blur-[130px]" />
        <div className="absolute right-[5%] top-[30%] h-[400px] w-[400px] rounded-full bg-[#22D3EE]/7 blur-[110px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[350px] w-[350px] rounded-full bg-[#3B82F6]/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-24">

        {/* ── Hero ── */}
        <FadeIn>
          <div className="text-center">
            {/* Plan badge */}
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

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#EAF0FF]/60 md:text-lg">
              Visual gerado com IA, blog, galeria, eventos, SEO avançado e site sem rodapé de terceiros.
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

            {/* Plan journey strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 sm:inline-flex sm:gap-1 sm:px-2">
              <span className="rounded-xl px-3 py-1.5 text-[11px] text-[#EAF0FF]/30">
                ⚡ Starter · {fmt(starterPrice)}/mês
              </span>
              <ArrowRight size={10} className="hidden text-white/15 sm:block" />
              <span className="rounded-xl px-3 py-1.5 text-[11px] text-[#EAF0FF]/30">
                ⭐ Básico · {fmt(basicoPrice)}/mês
              </span>
              <ArrowRight size={10} className="hidden text-white/15 sm:block" />
              <span className="rounded-xl border border-[#7C5CFF]/30 bg-[#7C5CFF]/20 px-3 py-1.5 text-[11px] font-bold text-[#A78BFA]">
                👑 Premium · {fmt(premiumPrice)}/mês
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/quero-comecar?plan=premium"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-9 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,92,255,0.6)]"
              >
                Quero o Premium agora
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#comparativo"
                className="text-sm text-[#EAF0FF]/45 transition hover:text-[#EAF0FF]"
              >
                Comparar planos ↓
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* ── Before / After ── */}
        <BeforeAfterSection basicoPrice={basicoPrice} premiumPrice={premiumPrice} />

        {/* ── Feature comparison table ── */}
        <FadeIn delay={0.1}>
          <div id="comparativo" className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Comparativo completo</p>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">O que está incluso em cada plano</h2>
            </div>

            {/* Scrollable wrapper for mobile */}
            <div className="overflow-x-auto rounded-3xl border border-white/10">
              <div className="min-w-[540px]">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_90px_90px_120px] bg-[#0E1428]">
                  <div className="border-b border-white/10 px-5 py-5" />

                  {/* Starter */}
                  <div className="border-b border-l border-white/10 px-3 py-5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/70">Starter</p>
                    <p className="mt-1.5 text-base font-black text-[#EAF0FF]">{fmt(starterPrice)}</p>
                    <p className="text-[10px] text-[#EAF0FF]/30">/mês</p>
                  </div>

                  {/* Básico */}
                  <div className="border-b border-l border-white/10 px-3 py-5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-400/70">Básico</p>
                    <p className="mt-1.5 text-base font-black text-[#EAF0FF]">{fmt(basicoPrice)}</p>
                    <p className="text-[10px] text-[#EAF0FF]/30">/mês</p>
                  </div>

                  {/* Premium */}
                  <div className="relative border-b border-l border-[#7C5CFF]/30 bg-[linear-gradient(180deg,rgba(124,92,255,0.12),rgba(124,92,255,0.04))] px-3 py-5 text-center">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#7C5CFF,#22D3EE)]" />
                    <div className="mb-1 flex justify-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#7C5CFF]/20 px-2 py-0.5 text-[9px] font-bold text-[#A78BFA]">
                        <Sparkles size={9} /> POPULAR
                      </span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A78BFA]">Premium</p>
                    <p className="mt-1.5 text-base font-black text-[#EAF0FF]">{fmt(premiumPrice)}</p>
                    <p className="text-[10px] text-[#EAF0FF]/30">/mês</p>
                  </div>
                </div>

                {/* Feature rows */}
                {FEATURES.map((feature, i) => {
                  const isPremiumOnly = feature.premium && !feature.basic;
                  return (
                    <div
                      key={i}
                      className={`grid grid-cols-[1fr_90px_90px_120px] items-center border-t border-white/[0.06] ${
                        isPremiumOnly ? "bg-[rgba(124,92,255,0.03)]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 px-5 py-3">
                        <span className={`text-sm ${isPremiumOnly ? "text-[#EAF0FF]/80" : "text-[#EAF0FF]/60"}`}>
                          {feature.label}
                        </span>
                        {isPremiumOnly && (
                          <span className="rounded-full bg-[#7C5CFF]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#A78BFA]">
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="flex justify-center border-l border-white/[0.06] py-3">
                        {feature.starter ? (
                          <Check size={15} className="text-emerald-400" />
                        ) : (
                          <Minus size={13} className="text-[#EAF0FF]/15" />
                        )}
                      </div>
                      <div className="flex justify-center border-l border-white/[0.06] py-3">
                        {feature.basic ? (
                          <Check size={15} className="text-blue-400" />
                        ) : (
                          <Minus size={13} className="text-[#EAF0FF]/15" />
                        )}
                      </div>
                      <div className="flex justify-center border-l border-[#7C5CFF]/20 bg-[rgba(124,92,255,0.02)] py-3">
                        {feature.premium ? (
                          <Check size={15} className="text-[#A78BFA]" />
                        ) : (
                          <Minus size={13} className="text-[#EAF0FF]/15" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* CTA row */}
                <div className="grid grid-cols-[1fr_90px_90px_120px] border-t border-white/10 bg-[#0E1428]">
                  <div className="px-5 py-5" />
                  <div className="border-l border-white/10 px-2 py-5 text-center">
                    <Link
                      href="/quero-comecar?plan=starter"
                      className="block rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-2 py-2 text-xs font-semibold text-emerald-400/70 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
                    >
                      Starter
                    </Link>
                  </div>
                  <div className="border-l border-white/10 px-2 py-5 text-center">
                    <Link
                      href="/quero-comecar"
                      className="block rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-2 py-2 text-xs font-semibold text-blue-400/70 transition hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                      Básico
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
            <p className="mt-2 text-center text-[10px] text-[#EAF0FF]/20">
              ← Deslize para ver todos os planos no mobile
            </p>
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

        {/* ── Final CTA ── */}
        <FadeIn delay={0.1}>
          <div className="mt-20">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] p-px">
                <div className="h-full w-full rounded-3xl bg-[#080D1C]" />
              </div>

              <div className="relative px-6 py-14 text-center md:px-8 md:py-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-[20%] top-[-30%] h-[350px] w-[350px] rounded-full bg-[#7C5CFF]/20 blur-[90px]" />
                  <div className="absolute bottom-[-20%] right-[15%] h-[300px] w-[300px] rounded-full bg-[#22D3EE]/15 blur-[80px]" />
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
                    Profissionais Premium têm sites que vendem por si mesmos. IA, SEO avançado, galeria, blog — tudo em um clique.
                  </p>

                  {/* Trust row */}
                  <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3 sm:max-w-none sm:inline-grid">
                    {[
                      { icon: Zap,    value: "Acesso imediato",  desc: "Ativo após o pagamento" },
                      { icon: Star,   value: "Sem fidelidade",   desc: "Cancele quando quiser" },
                      { icon: Shield, value: "Pagamento seguro", desc: "Processado via Stripe" },
                    ].map(({ icon: Icon, value, desc }) => (
                      <div
                        key={value}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center sm:px-4"
                      >
                        <Icon size={16} className="mx-auto mb-1.5 text-[#A78BFA]" />
                        <p className="text-xs font-bold text-[#EAF0FF]">{value}</p>
                        <p className="mt-0.5 text-[10px] text-[#EAF0FF]/40">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/quero-comecar?plan=premium"
                      className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#7C5CFF,#A855F7,#22D3EE)] px-8 py-4 text-base font-bold text-white shadow-[0_0_50px_rgba(124,92,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_70px_rgba(124,92,255,0.7)] sm:px-10"
                    >
                      <Crown size={16} />
                      Começar com Premium
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    <Link
                      href="/#precos"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-semibold text-[#EAF0FF]/60 transition hover:border-white/25 hover:text-[#EAF0FF] sm:px-8"
                    >
                      Ver todos os planos
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-[#EAF0FF]/25">
                    <Link href="/termos" className="transition hover:text-[#EAF0FF]/60">
                      Termos de Uso
                    </Link>
                    <span>·</span>
                    <Link href="/privacidade" className="transition hover:text-[#EAF0FF]/60">
                      Privacidade
                    </Link>
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
