import Link from "next/link";
import { redirect } from "next/navigation";

import { WizardShell } from "@/components/onboarding/wizard-shell";
import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export const dynamic = "force-dynamic";

export default async function QueroComecarPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }

  return (
    <main className="relative min-h-screen bg-[var(--platform-bg)]">
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
      <WizardShell />
    </main>
  );
}
