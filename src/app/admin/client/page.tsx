import { redirect } from "next/navigation";

import { SectionsEditor } from "@/components/admin/sections-editor";
import { SiteBrandingEditor } from "@/components/admin/site-branding-editor";
import { Brand } from "@/components/platform/brand";
import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

const modules = [
  {
    title: "Secoes e conteudo",
    description: "Ajuste hero, services e CTA com upload de imagens e ordem das secoes.",
  },
  {
    title: "CTA e contatos",
    description: "Configure links de WhatsApp, botoes, textos e chamadas de acao.",
  },
  {
    title: "Movimento e tema",
    description: "Personalize cores, ritmo visual e experiencia geral do tenant.",
  },
  {
    title: "Limite de estilo",
    description: "Mudanca de estilo geral fica bloqueada e pode ser oferecida como adicional.",
  },
];

export default async function ClientAdminPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let scopedSites: Array<{ id: string; name: string; domain: string; plan: string }> = [];
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan")
      .eq("id", profile.site_id)
      .limit(1);
    scopedSites = data ?? [];
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Brand compact />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">/admin/client</p>
      <h1 className="mt-3 text-3xl font-bold text-[var(--platform-text)]">Painel do cliente</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--platform-text)]/75">
        Aqui voce controla o conteudo e a identidade do seu site. O estilo estrutural do template
        permanece bloqueado neste plano.
      </p>

      <form className="mt-4" action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.08]"
        >
          Sair
        </button>
      </form>

      <SiteBrandingEditor
        sites={scopedSites.map((site) => ({ id: site.id, name: site.name, domain: site.domain }))}
        defaultSiteId={profile.site_id ?? scopedSites[0]?.id ?? null}
      />

      <SectionsEditor
        sites={scopedSites.map((site) => ({ id: site.id, name: site.name, domain: site.domain }))}
        defaultSiteId={profile.site_id ?? scopedSites[0]?.id ?? null}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
            <h2 className="text-lg font-semibold text-[var(--platform-text)]">{module.title}</h2>
            <p className="mt-2 text-sm text-[var(--platform-text)]/75">{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
