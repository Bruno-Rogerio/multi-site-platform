import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { getPlanPrices, formatBRL } from "@/lib/onboarding/get-plan-prices";

import { StickyHeader } from "@/components/landing/sticky-header";
import { HeroAnimatedHeadline } from "@/components/landing/hero-animated-headline";
import { SocialProofCounter } from "@/components/landing/social-proof-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AnimatedSection } from "@/components/landing/animated-section";
import { ProductMockup } from "@/components/landing/product-mockup";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsStrip } from "@/components/landing/testimonials-strip";
import { FaqAccordion, type FaqItem } from "@/components/landing/faq-accordion";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { CookieBanner } from "@/components/landing/cookie-banner";
import { FloatingSocialButtons } from "@/components/landing/floating-social-buttons";
import { PlatformPageTracker } from "@/components/platform-page-tracker";

export const dynamic = "force-dynamic";

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export async function generateMetadata(): Promise<Metadata> {
  const prices = await getPlanPrices();
  const priceStr = formatBRL(prices.basico);
  return {
    title: "Crie seu site profissional em minutos — BuildSphere",
    description: `Criador de site profissional para autônomos e MEIs. Sem código, sem taxa de setup, sem programador. Para psicólogos, coaches e nutricionistas. A partir de ${priceStr}/mês.`,
    keywords: [
      "criar site profissional",
      "criador de site profissional",
      "site para autônomo",
      "site para MEI",
      "criar site sem programador",
      "site para psicólogo",
      "site para coach",
      "site para nutricionista",
      "site para personal trainer",
      "site para fotógrafo",
      "construtor de sites Brasil",
      "criar site grátis",
      "site profissional barato",
    ],
    alternates: { canonical: `https://${ROOT}` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "BuildSphere",
      url: `https://${ROOT}`,
      title: "Crie seu site profissional em minutos — BuildSphere",
      description: `Criador de site profissional para autônomos. Sem código, sem taxa de setup. Psicólogos, coaches, nutricionistas e fotógrafos. A partir de ${priceStr}/mês.`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BuildSphere — Criador de site profissional para autônomos" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Crie seu site profissional em minutos — BuildSphere",
      description: `Criador de site profissional para autônomos. Sem código, sem taxa de setup. A partir de ${priceStr}/mês.`,
      images: ["/og-image.png"],
    },
  };
}


const faqItems: FaqItem[] = [
  {
    question: "Preciso saber programar para usar a BuildSphere?",
    answer:
      "Não! A BuildSphere foi criada pensando em profissionais que não tem conhecimento técnico. Todo o processo de configuração e edição é visual e intuitivo.",
  },
  {
    question: "Quais profissionais podem usar a BuildSphere?",
    answer:
      "A BuildSphere é ideal para qualquer profissional autônomo ou prestador de serviço: psicólogos, nutricionistas, coaches, advogados, fotógrafos, personal trainers, consultores, professores particulares, terapeutas e muito mais. Se você precisa de presença online profissional, a BuildSphere é para você.",
  },
  {
    question: "Quanto tempo leva para ter meu site no ar?",
    answer:
      "Menos de 5 minutos. Nosso assistente de configuração guia você por todas as etapas e seu site fica online imediatamente após a conclusão.",
  },
  {
    question: "Existe taxa de setup ou contrato de fidelidade?",
    answer:
      "Não. O plano é mensal e você pode cancelar a qualquer momento. Não cobramos taxa de setup nem exigimos permanência mínima.",
  },
  {
    question: "Posso editar meu site depois de publicado?",
    answer:
      "Sim! Você tem acesso a um painel administrativo completo onde pode alterar textos, imagens, cores e informações sempre que precisar.",
  },
  {
    question: "A BuildSphere é indicada para quais profissionais?",
    answer:
      "Psicólogos, terapeutas, coaches, nutricionistas, consultores e qualquer profissional autônomo que precise de presença online profissional.",
  },
  {
    question: "Meu site aparece no Google?",
    answer:
      "Sim. Todos os sites são otimizados para mecanismos de busca (SEO) com boas práticas de performance, meta tags e estrutura semântica.",
  },
];

export default async function PlatformLandingPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }
  const [platformBranding, planPrices] = await Promise.all([
    getPlatformBrandingSettings(),
    getPlanPrices(),
  ]);
  const brandEl = <Brand compact settings={platformBranding} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `https://${ROOT}/#organization`,
        name: "BuildSphere",
        url: `https://${ROOT}`,
        logo: {
          "@type": "ImageObject",
          url: `https://${ROOT}/og-image.png`,
        },
        description:
          "BuildSphere é um criador de site profissional para autônomos e prestadores de serviço. Psicólogos, coaches, nutricionistas e consultores criam seus sites sem código em menos de 5 minutos.",
        sameAs: [],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `https://${ROOT}/#product`,
        name: "BuildSphere — Criador de site profissional",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Website Builder",
        operatingSystem: "Web",
        url: `https://${ROOT}`,
        description:
          "Criador de site profissional para autônomos, psicólogos, coaches, nutricionistas e consultores. Crie seu site em menos de 5 minutos sem código e sem taxa de setup.",
        offers: [
          {
            "@type": "Offer",
            name: "Plano Essencial",
            price: planPrices.basico.toFixed(2),
            priceCurrency: "BRL",
            priceSpecification: {
              "@type": "RecurringCharge",
              billingDuration: 1,
              billingIncrement: "month",
            },
            description: "Site profissional com personalização de logo e domínio.",
          },
          {
            "@type": "Offer",
            name: "Plano Premium Full",
            price: planPrices.premium.toFixed(2),
            priceCurrency: "BRL",
            priceSpecification: {
              "@type": "RecurringCharge",
              billingDuration: 1,
              billingIncrement: "month",
            },
            description: "Site completo com blog, galeria, eventos, SEO avançado e personalização total.",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "47",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <PlatformPageTracker path="/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#22D3EE]/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#7C5CFF]/12 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[40%] h-[400px] w-[400px] rounded-full bg-[#3B82F6]/8 blur-[100px]" />
      </div>

      {/* Header */}
      <StickyHeader brandElement={brandEl} />

      <main className="relative">
        {/* ─── Hero ─── */}
        <section className="flex min-h-[80vh] items-center">
          <HeroAnimatedHeadline />
        </section>

        {/* ─── Social Proof ─── */}
        <SocialProofCounter />

        {/* ─── Como funciona ─── */}
        <section id="como-funciona" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Como funciona
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Três passos para seu site profissional
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Um processo simples e guiado. Você não precisa de conhecimento
                técnico.
              </p>
            </AnimatedSection>

            <HowItWorks />
          </div>
        </section>

        {/* ─── Funcionalidades bento grid ─── */}
        <section id="funcionalidades" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Funcionalidades
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Do básico ao avançado — recursos pensados para profissionais que querem resultado real.
              </p>
            </AnimatedSection>

            <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4 lg:auto-rows-[200px]">
              {/* Card 1: Large — Site em minutos (col-span-2, row-span-2) */}
              <AnimatedSection delay={0} className="col-span-2 row-span-2">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-7 transition-all duration-500 hover:border-[#3B82F6]/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#3B82F6]/10 blur-[60px]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)]">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-2xl font-black text-[#EAF0FF] md:text-3xl">Site pronto<br />em minutos</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#EAF0FF]/55 md:text-base">Assistente guiado passo a passo. Você preenche suas informações e o site é criado automaticamente. Zero código, zero complicação.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-[11px] font-semibold text-[#3B82F6]">Setup guiado</span>
                      <span className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-3 py-1 text-[11px] font-semibold text-[#7C5CFF]">Sem código</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 2: SEO */}
              <AnimatedSection delay={0.08}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-5 transition-all duration-500 hover:border-[#22D3EE]/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-3xl">🔍</span>
                    <h3 className="mt-3 text-base font-black text-[#EAF0FF]">SEO avançado</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#EAF0FF]/50">Apareça no Google com título e descrição personalizados.</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 3: Visual IA */}
              <AnimatedSection delay={0.12}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-5 transition-all duration-500 hover:border-[#A855F7]/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-3xl">🎨</span>
                    <h3 className="mt-3 text-base font-black text-[#EAF0FF]">Visual com IA</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#EAF0FF]/50">Paletas, fontes e estilos personalizados para o seu nicho.</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 4: Blog + Galeria + Eventos (col-span-2) */}
              <AnimatedSection delay={0.16} className="col-span-2 row-span-2 md:row-span-1">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.08),rgba(34,211,238,0.05))] p-6 transition-all duration-500 hover:border-[#7C5CFF]/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.12),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div>
                      <div className="flex gap-3">
                        {["📝", "🖼️", "📅"].map((emoji, i) => (
                          <div key={i} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-lg">{emoji}</div>
                        ))}
                      </div>
                      <h3 className="mt-3 text-lg font-black text-[#EAF0FF]">Blog · Galeria · Eventos</h3>
                      <p className="mt-1.5 text-sm text-[#EAF0FF]/50">Publique artigos, mostre seu portfólio e divulgue sua agenda. Tudo integrado ao seu site Premium.</p>
                    </div>
                    <span className="self-start rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-3 py-1 text-[11px] font-bold text-[#7C5CFF]">✦ Plano Premium</span>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 5: Responsivo + SSL (col-span-2) */}
              <AnimatedSection delay={0.2} className="col-span-2">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-6 transition-all duration-500 hover:border-emerald-500/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex h-full items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-3xl">🛡️</div>
                    <div>
                      <h3 className="text-lg font-black text-[#EAF0FF]">Responsivo + SSL gratuito</h3>
                      <p className="mt-1 text-sm text-[#EAF0FF]/50">Design perfeito em qualquer dispositivo. Certificado SSL automático em todos os planos.</p>
                      <div className="mt-2.5 flex gap-2">
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">Mobile-first</span>
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">SSL incluso</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 6: Suporte */}
              <AnimatedSection delay={0.24}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-5 transition-all duration-500 hover:border-amber-500/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-3xl">💬</span>
                    <h3 className="mt-3 text-base font-black text-[#EAF0FF]">Suporte real</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#EAF0FF]/50">Atendimento por e-mail. Prioritário no Premium.</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 7: Edição fácil */}
              <AnimatedSection delay={0.28}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-5 transition-all duration-500 hover:border-[#22D3EE]/40">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.10),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-3xl">✏️</span>
                    <h3 className="mt-3 text-base font-black text-[#EAF0FF]">Edição sem código</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#EAF0FF]/50">Painel intuitivo para atualizar tudo a qualquer momento.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ─── Exemplos ─── */}
        <section id="exemplos" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Exemplos reais
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Veja como fica o seu site
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Sites criados com a BuildSphere, para profissionais de diferentes
                segmentos. Em menos de 5 minutos você tem um como esse.
              </p>
            </AnimatedSection>

            <ProductMockup />
          </div>
        </section>

        {/* ─── Depoimentos ─── */}
        <TestimonialsStrip />

        {/* ─── Preços ─── */}
        <section id="precos" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Preços
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Simples e transparente
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Escolha o plano ideal para você. Sem taxa de setup, sem custo
                oculto.
              </p>
            </AnimatedSection>

            <PricingSection basicoPrice={planPrices.basico} premiumPrice={planPrices.premium} />
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Perguntas frequentes
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Tire suas dúvidas sobre a plataforma.
              </p>
            </AnimatedSection>

            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer brandElement={brandEl} branding={platformBranding} />
      <CookieBanner />
      <FloatingSocialButtons branding={platformBranding} />
    </>
  );
}
