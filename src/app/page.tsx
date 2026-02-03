import { redirect } from "next/navigation";

import { getRequestHostClassification } from "@/lib/tenant/request-host";

export const dynamic = "force-dynamic";

export default async function PlatformLandingPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-16">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
          Plataforma SaaS Multi-Tenant
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Crie e gerencie sites profissionais de clientes em um unico produto
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 opacity-80 md:text-base">
          Essa e a area da plataforma. Os sites publicos dos clientes rodam em subdominios,
          enquanto login e administracao ficam centralizados aqui.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/login"
            className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Entrar na plataforma
          </a>
          <a
            href="/admin"
            className="rounded-lg border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/5"
          >
            Ver admin
          </a>
        </div>
      </section>
    </main>
  );
}
