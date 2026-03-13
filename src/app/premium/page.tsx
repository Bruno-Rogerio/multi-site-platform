import type { Metadata } from "next";

import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";
import { PremiumPage } from "@/components/landing/premium-page";
import { getPlanPrices } from "@/lib/onboarding/get-plan-prices";

export const metadata: Metadata = {
  title: "Plano Premium — BuildSphere",
  description:
    "Tudo que você precisa para um site profissional completo: personalização visual com IA, blog, galeria, eventos, SEO e muito mais.",
};

export default async function PremiumRoutePage() {
  const [platformBranding, planPrices] = await Promise.all([
    getPlatformBrandingSettings(),
    getPlanPrices(),
  ]);
  const brandEl = <Brand compact settings={platformBranding} />;

  return <PremiumPage brandElement={brandEl} basicoPrice={planPrices.basico} premiumPrice={planPrices.premium} />;
}
