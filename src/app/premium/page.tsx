import type { Metadata } from "next";

import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { PremiumPage } from "@/components/landing/premium-page";
import { getPlanPrices } from "@/lib/onboarding/get-plan-prices";

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export const metadata: Metadata = {
  title: "Plano Premium Full — Site profissional completo",
  description:
    "Site profissional completo com blog, galeria, eventos e SEO avançado. Sem código, sem taxa de setup. Personalização total para fotógrafos, nutricionistas e advogados.",
  keywords: [
    "site profissional completo",
    "site com blog",
    "site para fotógrafo",
    "site para advogado",
    "site para nutricionista",
    "criador de site premium",
    "site profissional barato",
    "plataforma de sites profissionais",
  ],
  alternates: { canonical: `https://${ROOT}/premium` },
  openGraph: {
    title: "Plano Premium Full — BuildSphere",
    description:
      "Blog, galeria, eventos, SEO avançado e personalização total. O site profissional mais completo para autônomos e prestadores de serviço.",
    url: `https://${ROOT}/premium`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Plano Premium BuildSphere" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plano Premium Full — Site profissional completo",
    description:
      "Blog, galeria, eventos, SEO avançado e personalização total. Sem código, sem taxa de setup.",
    images: ["/og-image.png"],
  },
};

export default async function PremiumRoutePage() {
  const [platformBranding, planPrices] = await Promise.all([
    getPlatformBrandingSettings(),
    getPlanPrices(),
  ]);
  const brandEl = <Brand compact settings={platformBranding} />;

  return <PremiumPage brandElement={brandEl} starterPrice={planPrices.starter} basicoPrice={planPrices.basico} premiumPrice={planPrices.premium} />;
}
