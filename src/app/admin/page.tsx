import { redirect } from "next/navigation";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { requireUserProfile } from "@/lib/auth/session";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

const modules = [
  {
    title: "Conteudo",
    description: "Editar textos, secoes e ordem da landing page de cada cliente.",
  },
  {
    title: "Tema",
    description: "Definir cores, tipografia e estilo de botoes por site.",
  },
  {
    title: "Midia",
    description: "Upload de imagens no Supabase Storage (logo, banner, posts).",
  },
  {
    title: "Blog (Plano Pro)",
    description: "Gerenciar posts, slug, data de publicacao e SEO basico.",
  },
  {
    title: "Dominios e Planos",
    description: "Criar cliente, vincular dominio e alternar plano landing/pro.",
  },
];

export default async function AdminPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await requireUserProfile(["admin", "client"]);
  const supabase = await createSupabaseServerAuthClient();

  let scopedSites: Array<{ id: string; name: string; domain: string; plan: string }> = [];

  if (supabase) {
    if (profile.role === "admin") {
      const { data } = await supabase
        .from("sites")
        .select("id,name,domain,plan")
        .order("name", { ascending: true })
        .limit(100);
      scopedSites = data ?? [];
    } else if (profile.site_id) {
      const { data } = await supabase
        .from("sites")
        .select("id,name,domain,plan")
        .eq("id", profile.site_id)
        .limit(1);
      scopedSites = data ?? [];
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">/admin</p>
      <h1 className="mt-3 text-3xl font-bold">Painel da plataforma</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Usuario autenticado como <strong>{profile.role}</strong>. Escopo de dados isolado por
        RLS em nivel de tenant.
      </p>

      <form className="mt-4" action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-lg border border-black/15 px-4 py-2 text-xs font-semibold transition hover:bg-black/5"
        >
          Sair
        </button>
      </form>

      {profile.role === "admin" ? (
        <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Convidar novo usuario</h2>
          <p className="mt-2 text-sm opacity-80">
            Crie acessos sem auto-cadastro. O usuario recebe email e define a senha no primeiro acesso.
          </p>
          <CreateUserForm sites={scopedSites} />
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="text-lg font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm opacity-80">{module.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">
          {profile.role === "admin" ? "Sites da plataforma" : "Seu site"}
        </h2>
        {scopedSites.length === 0 ? (
          <p className="mt-2 text-sm opacity-70">Nenhum site visivel para este usuario.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {scopedSites.map((site) => (
              <li
                key={site.id}
                className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2 text-sm"
              >
                <strong>{site.name}</strong> - {site.domain} ({site.plan})
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
