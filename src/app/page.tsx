import Link from "next/link";
import { redirect } from "next/navigation";

import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export const dynamic = "force-dynamic";

const highlights = [
  { label: "Tempo de setup", value: "< 15 min" },
  { label: "Deploy", value: "1 infraestrutura" },
  { label: "Edicao", value: "Sem codigo" },
  { label: "Modelo", value: "Setup + recorrencia" },
];

const featureCards = [
  {
    title: "Onboarding visual premium",
    description: "Cliente escolhe estilo, paleta e secoes em uma experiencia guiada com preview ao vivo.",
  },
  {
    title: "Multi-tenant de verdade",
    description: "Plataforma e tenants separados por dominio, com isolamento robusto e operacao centralizada.",
  },
  {
    title: "Painel profissional",
    description: "Edicao de conteudo, imagens e identidade visual com fluxo claro para clientes nao tecnicos.",
  },
];

export default async function PlatformLandingPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect(`/t/${host.tenant}`);
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-[-8%] h-72 w-72 rounded-full bg-[#22D3EE]/20 blur-3xl" />
        <div className="absolute right-[12%] top-[8%] h-80 w-80 rounded-full bg-[#7C5CFF]/20 blur-3xl" />
        <div className="absolute bottom-[-8%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3B82F6]/20 blur-3xl" />
      </div>

      <header className="rounded-2xl border border-white/10 bg-[#0F162A]/70 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Brand compact />
          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/quero-comecar" className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/80 transition hover:bg-white/[0.06]">
              Produto
            </Link>
            <Link href="/login" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)] transition hover:bg-white/[0.08]">
              Login
            </Link>
            <Link href="/admin" className="rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:brightness-110">
              Painel
            </Link>
          </nav>
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(124,92,255,0.2),transparent_55%),#11182C] p-6 shadow-[0_0_45px_rgba(59,130,246,0.22)] md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/45 bg-[#22D3EE]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
              SaaS multi-tenant premium
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.02] text-[var(--platform-text)] md:text-6xl">
              O jeito mais elegante de vender sites por assinatura
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--platform-text)]/78 md:text-base">
              BuildSphere une onboarding visual, geracao automatica de tenants e painel de edicao
              profissional para criar uma experiencia premium desde o primeiro clique.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quero-comecar"
                className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.35)] transition hover:brightness-110"
              >
                Quero comecar
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.08]"
              >
                Acessar plataforma
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A1020]/90 p-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-2 text-xs text-[var(--platform-text)]/55">cliente1.buildsphere.app</span>
            </div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/[0.07] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Hero split</p>
                <p className="mt-1 text-sm font-semibold">Cuidado emocional para viver com mais clareza</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">Services style</div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">Theme per tenant</div>
              </div>
              <div className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] p-3 text-xs font-semibold text-white">
                CTA de conversao com branding
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/10 bg-[#12182B]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--platform-text)]/55">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--platform-text)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-[#12182B]/90 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Porque BuildSphere</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {featureCards.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--platform-text)]/70">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,92,255,0.2),rgba(34,211,238,0.2))] p-7 text-center md:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">Pronto para escalar</p>
        <h2 className="mt-2 text-2xl font-black text-white md:text-4xl">
          Da proposta comercial ao site pronto em um unico fluxo
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-white/85 md:text-base">
          Comece com o onboarding visual, gere o tenant automaticamente e entregue uma experiencia premium
          que justifica setup e recorrencia.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/quero-comecar"
            className="rounded-xl bg-[#EAF0FF] px-6 py-3 text-sm font-semibold text-[#0B1020] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:bg-white"
          >
            Comecar agora
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ver painel admin
          </Link>
        </div>
      </section>
    </main>
  );
}
