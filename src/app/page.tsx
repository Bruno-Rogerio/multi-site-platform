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
    title: "Dominio profissional",
    description:
      "Seu site com subdominio personalizado ou dominio proprio. Presenca online seria desde o primeiro dia.",
  },
  {
    iconName: "Palette",
    title: "Visual personalizavel",
    description:
      "Escolha entre estilos, paletas e layouts. Seu site reflete a identidade do seu trabalho.",
  },
  {
    iconName: "Smartphone",
    title: "Responsivo em qualquer tela",
    description:
      "Design adaptado para desktop, tablet e celular. Seus visitantes tem a melhor experiencia sempre.",
  },
  {
    iconName: "Zap",
    title: "Performance otimizada",
    description:
      "Carregamento ultra-rapido com infraestrutura moderna. SEO e velocidade que fazem diferenca.",
  },
  {
    iconName: "Shield",
    title: "Seguro e confiavel",
    description:
      "SSL, backups automaticos e infraestrutura profissional. Seus dados e os de seus clientes protegidos.",
  },
  {
    iconName: "PenTool",
    title: "Edicao sem codigo",
    description:
      "Painel intuitivo para atualizar textos, imagens e informacoes. Voce no controle total.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Preciso saber programar para usar a BuildSphere?",
    answer:
      "Nao! A BuildSphere foi criada pensando em profissionais que nao tem conhecimento tecnico. Todo o processo de configuracao e edicao e visual e intuitivo.",
  },
  {
    question: "Posso usar meu proprio dominio?",
    answer:
      "Sim. Voce pode usar um subdominio gratuito (seunome.buildsphere.app) ou conectar um dominio proprio que ja possua.",
  },
  {
    question: "Quanto tempo leva para ter meu site no ar?",
    answer:
      "Menos de 5 minutos. Nosso assistente de configuracao guia voce por todas as etapas e seu site fica online imediatamente apos a conclusao.",
  },
  {
    question: "Existe taxa de setup ou contrato de fidelidade?",
    answer:
      "Nao. O plano e mensal e voce pode cancelar a qualquer momento. Nao cobramos taxa de setup nem exigimos permanencia minima.",
  },
  {
    question: "Posso editar meu site depois de publicado?",
    answer:
      "Sim! Voce tem acesso a um painel administrativo completo onde pode alterar textos, imagens, cores e informacoes sempre que precisar.",
  },
  {
    question: "A BuildSphere e indicada para quais profissionais?",
    answer:
      "Psicologos, terapeutas, coaches, nutricionistas, consultores e qualquer profissional autonomo que precise de presenca online profissional.",
  },
  {
    question: "Meu site aparece no Google?",
    answer:
      "Sim. Todos os sites sao otimizados para mecanismos de busca (SEO) com boas praticas de performance, meta tags e estrutura semantica.",
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
                Tres passos para seu site profissional
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Um processo simples e guiado. Voce nao precisa de conhecimento
                tecnico.
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
                Tudo que voce precisa em um so lugar
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Recursos pensados para profissionais que querem uma presenca
                online de qualidade sem complicacao.
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
                Veja na pratica
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Sites que impressionam seus clientes
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Cada site e unico, com a identidade visual do profissional. Veja
                como um site criado na BuildSphere se parece.
              </p>
            </AnimatedSection>

            <ProductMockup />
          </div>
        </section>

        {/* ─── Precos ─── */}
        <section id="precos" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
                Precos
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
                Simples e transparente
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--platform-text)]/60">
                Escolha o plano ideal para voce. Sem taxa de setup, sem custo
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
                Tire suas duvidas sobre a plataforma.
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
