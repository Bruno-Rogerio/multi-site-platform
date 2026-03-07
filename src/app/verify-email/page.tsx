import { Brand } from "@/components/platform/brand";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-white/10 bg-[#12182B] p-8 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
        <Brand compact />

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          /verify-email
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--platform-text)]">
          Confirme seu e-mail
        </h1>
        <p className="mt-3 text-sm text-[var(--platform-text)]/75">
          Enviamos um link de confirmação para o seu endereço de e-mail. Clique
          no link para ativar sua conta e acessar o painel.
        </p>

        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          Não recebeu o e-mail? Verifique sua caixa de spam ou reenvie abaixo.
        </div>

        <VerifyEmailForm />

        <p className="mt-4 text-center text-[11px] text-[var(--platform-text)]/40">
          Já confirmou?{" "}
          <a href="/login" className="underline hover:text-[var(--platform-text)]/70">
            Faça login
          </a>
        </p>
      </section>
    </main>
  );
}
