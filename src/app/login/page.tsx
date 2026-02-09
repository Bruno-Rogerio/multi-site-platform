import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { getCurrentUserProfile } from "@/lib/auth/session";

type Props = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await getCurrentUserProfile();
  if (profile) {
    redirect("/admin");
  }

  const params = await searchParams;
  const checkoutSuccess = params.checkout === "success";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-white/10 bg-[#12182B] p-8 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
        <Brand compact />

        {checkoutSuccess && (
          <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
            <p className="text-sm font-semibold text-green-400">
              Pagamento confirmado!
            </p>
            <p className="mt-1 text-xs text-green-400/80">
              Sua conta foi criada com sucesso. Faca login abaixo com o email e senha que voce cadastrou.
            </p>
          </div>
        )}

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">/login</p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--platform-text)]">Acesso da plataforma</h1>
        <p className="mt-3 text-sm text-[var(--platform-text)]/75">
          {checkoutSuccess
            ? "Use o email e senha que voce criou durante o cadastro."
            : "Acesso somente para usuarios criados pela plataforma. Nao existe auto-cadastro."}
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
