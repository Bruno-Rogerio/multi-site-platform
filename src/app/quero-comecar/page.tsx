import Link from "next/link";
import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/platform/onboarding-wizard";
import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export const dynamic = "force-dynamic";

export default async function QueroComecarPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-12 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Brand compact />
        <Link
          href="/"
          className="rounded-lg border border-white/20 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)] transition hover:bg-white/[0.08]"
        >
          Voltar ao inicio
        </Link>
      </div>
      <OnboardingWizard />
    </main>
  );
}
