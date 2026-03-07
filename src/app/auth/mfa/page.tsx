import { ShieldCheck } from "lucide-react";

import { Brand } from "@/components/platform/brand";
import { MfaChallengeForm } from "@/components/auth/mfa-challenge-form";

export default function MfaPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-white/10 bg-[#12182B] p-8 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
        <Brand compact />

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          /auth/mfa
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--platform-text)]">
            Verificação em dois fatores
          </h1>
        </div>
        <p className="mt-3 text-sm text-[var(--platform-text)]/75">
          Sua conta está protegida com 2FA. Insira o código gerado pelo seu app
          autenticador para continuar.
        </p>

        <MfaChallengeForm />
      </section>
    </main>
  );
}
