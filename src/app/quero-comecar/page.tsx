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
    <main className="relative mx-auto min-h-screen w-full max-w-[1700px] px-4 py-10 md:px-7">
      <div className="pointer-events-none absolute left-[-5%] top-[-6%] h-64 w-64 rounded-full bg-[#22D3EE]/16 blur-3xl" />
      <div className="pointer-events-none absolute right-[6%] top-[10%] h-72 w-72 rounded-full bg-[#7C5CFF]/16 blur-3xl" />
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#12182B]/80 px-4 py-3 backdrop-blur md:px-5">
        <Brand compact />
        <Link
          href="/"
          className="rounded-lg border border-white/20 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)] transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
        >
          Voltar ao inicio
        </Link>
      </div>
      <OnboardingWizard />
    </main>
  );
}
