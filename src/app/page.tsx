import { redirect } from "next/navigation";

import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

import { StickyHeader } from "@/components/landing/sticky-header";
import { HeroAnimatedHeadline } from "@/components/landing/hero-animated-headline";
import { SocialProofCounter } from "@/components/landing/social-proof-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AnimatedSection } from "@/components/landing/animated-section";
import { FeatureCard, type IconName } from "@/components/landing/feature-card";
import { ProductMockup } from "@/components/landing/product-mockup";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqAccordion, type FaqItem } from "@/components/landing/faq-accordion";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

const features: { iconName: IconName; title: string; description: string }[] = [
  {
    iconName: "Globe",
    title: "Domínio profissional",
    description:
      "Seu site com subdomínio personalizado ou domínio próprio. Presença online séria desde o primeiro dia.",
  },
  {
    iconName: "Palette",
    title: "Visual personalizável",
    description:
      "Escolha entre estilos, paletas e layouts. Seu site reflete a identidade do seu trabalho.",
  },
  {
    iconName: "Smartphone",
    title: "Responsivo em qualquer tela",
    description:
      "Design adaptado para desktop, tablet e celular. Seus visitantes tem a melhor experiência sempre.",
  },
  {
    iconName: "Zap",
    title: "Performance otimizada",
    description:
      "Carregamento ultra-rápido com infraestrutura moderna. SEO e velocidade que fazem diferença.",
  },
  {
    iconName: "Shield",
    title: "Seguro e confiável",
    description:
      "SSL, backups automáticos e infraestrutura profissional. Seus dados e os de seus clientes protegidos.",
  },
  {
    iconName: "PenTool",
    title: "Edição sem código",
    description:
      "Painel intuitivo para atualizar textos, imagens e informações. Você no controle total.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Preciso saber programar para usar a BuildSphere?",
    answer:
      "Não! A BuildSphere foi criada pensando em profissionais que não tem conhecimento técnico. Todo o processo de configuração e edição é visual e intuitivo.",
  },
  {
    question: "Posso usar meu próprio domínio?",
    answer:
      "Sim. Você pode usar um subdomínio gratuito (seunome.buildsphere.app) ou conectar um domínio próprio que já possua.",
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
  const platformBranding = await getPlatformBrandingSettings();
  const brandEl = <Brand compact settings={platformBranding} />;

  return (
    <>
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
        <section className="flex min-h-[90vh] items-center py-20">
          <HeroAnimatedHeadline />
        </section>

        {/* ─── Social Proof ─── */}
        <SocialProofCounter />

        {/* ─── Como funciona ─── */}
        <section id="como-funciona" className="py-20 md:py-28">
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

        {/* ─── Funcionalidades ─── */}
        <section id="funcionalidades" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Funcionalidades
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Recursos pensados para profissionais que querem uma presença
                online de qualidade sem complicação.
              </p>
            </AnimatedSection>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <AnimatedSection key={feature.title} delay={i * 0.08}>
                  <FeatureCard
                    iconName={feature.iconName}
                    title={feature.title}
                    description={feature.description}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Product Mockup ─── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Veja na prática
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Sites que impressionam seus clientes
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Cada site é único, com a identidade visual do profissional. Veja
                como um site criado na BuildSphere se parece.
              </p>
            </AnimatedSection>

            <ProductMockup />
          </div>
        </section>

        {/* ─── Preços ─── */}
        <section id="precos" className="py-20 md:py-28">
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

            <PricingSection />
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-20 md:py-28">
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
      <Footer brandElement={brandEl} />
    </>
  );
}
