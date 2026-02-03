import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { getCurrentUserProfile } from "@/lib/auth/session";

export default async function LoginPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await getCurrentUserProfile();
  if (profile) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">/login</p>
        <h1 className="mt-3 text-3xl font-bold">Acesso da plataforma</h1>
        <p className="mt-3 text-sm opacity-80">
          Acesso somente para usuarios criados pela plataforma. Nao existe auto-cadastro.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
