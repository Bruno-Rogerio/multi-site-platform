import type { Metadata } from "next";

import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { PremiumPage } from "@/components/landing/premium-page";
import { getPlanPrices } from "@/lib/onboarding/get-plan-prices";

export const metadata: Metadata = {
  title: "Plano Premium — Site profissional completo",
  description:
    "O plano completo do criador de site BuildSphere. Blog, galeria, eventos, personalização visual total, SEO avançado e muito mais. Sem código, sem taxa de setup.",
  openGraph: {
    title: "Plano Premium — BuildSphere",
    description:
      "Blog, galeria, eventos, SEO e personalização completa. O criador de site profissional mais completo do Brasil.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default async function PremiumRoutePage() {
  const [platformBranding, planPrices] = await Promise.all([
    getPlatformBrandingSettings(),
    getPlanPrices(),
  ]);
  const brandEl = <Brand compact settings={platformBranding} />;

  return <PremiumPage brandElement={brandEl} basicoPrice={planPrices.basico} premiumPrice={planPrices.premium} />;
}
