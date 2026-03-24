import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WizardShell } from "@/components/onboarding/wizard-shell";
import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { getPlanPrices } from "@/lib/onboarding/get-plan-prices";
import { PlatformPageTracker } from "@/components/platform-page-tracker";

export const dynamic = "force-dynamic";

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export const metadata: Metadata = {
  title: "Criar meu site profissional grátis — BuildSphere",
  description:
    "Configure seu site profissional em menos de 5 minutos. Plano Básico ou Premium, sem código, sem taxa de setup. Para autônomos, MEIs e prestadores de serviço.",
  keywords: [
    "criar site profissional",
    "criar site sem código",
    "criar site para autônomo",
    "criar site MEI",
    "criar site grátis",
  ],
  alternates: { canonical: `https://${ROOT}/quero-comecar` },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Criar meu site profissional grátis — BuildSphere",
    description:
      "Configure seu site profissional em menos de 5 minutos. Sem código, sem taxa de setup. Para autônomos e MEIs.",
    url: `https://${ROOT}/quero-comecar`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Criar meu site profissional grátis — BuildSphere",
    description: "Configure seu site profissional em menos de 5 minutos. Sem código, sem taxa de setup.",
    images: ["/og-image.png"],
  },
};

export default async function QueroComecarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }

  const params = await searchParams;
  const planParam = typeof params.plan === "string" ? params.plan : undefined;
  const initialPlan = planParam === "premium" ? "premium" : planParam === "basico" ? "basico" : undefined;

  const planPrices = await getPlanPrices();

  return (
    <main className="relative min-h-screen bg-[var(--platform-bg)]">
      <PlatformPageTracker path="/quero-comecar" />
      {/* Top navigation bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6 lg:px-8">
          <Brand compact />
          <Link
            href="/"
            className="rounded-lg border border-white/20 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)] transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
          >
            Voltar ao inicio
          </Link>
        </div>
      </div>

      {/* Wizard */}
      <WizardShell initialPlan={initialPlan} planPrices={planPrices} />
    </main>
  );
}
