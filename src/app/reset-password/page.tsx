import { redirect } from "next/navigation";

import { Brand } from "@/components/platform/brand";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export default async function ResetPasswordPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-white/10 bg-[#12182B] p-8 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
        <Brand compact />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          /reset-password
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--platform-text)]">Defina sua nova senha</h1>
        <p className="mt-3 text-sm text-[var(--platform-text)]/75">
          Esse fluxo atende primeiro acesso e recuperacao de senha por email.
        </p>
        <ResetPasswordForm />
      </section>
    </main>
  );
}
