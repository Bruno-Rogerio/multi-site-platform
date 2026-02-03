import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export default async function ResetPasswordPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
          /reset-password
        </p>
        <h1 className="mt-3 text-3xl font-bold">Defina sua nova senha</h1>
        <p className="mt-3 text-sm opacity-80">
          Esse fluxo atende primeiro acesso e recuperacao de senha por email.
        </p>
        <ResetPasswordForm />
      </section>
    </main>
  );
}
