import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Brand } from "@/components/platform/brand";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { getCurrentUserProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ checkout?: string; return?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const params = await searchParams;

  const profile = await getCurrentUserProfile();
  if (profile) {
    const returnTo = params.return ?? "";
    const rootDomain =
      process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
    const isSafePath = returnTo.startsWith("/");
    const isSafeDomain =
      returnTo.startsWith(`https://${rootDomain}`) ||
      returnTo.startsWith(`https://.${rootDomain}`) ||
      returnTo.match(new RegExp(`^https:\\/\\/[a-z0-9-]+\\.${rootDomain.replace(".", "\\.")}`)) !== null;

    if (isSafePath || isSafeDomain) {
      redirect(returnTo);
    }
    redirect("/admin");
  }

  const checkoutSuccess = params.checkout === "success";

  return (
    <main
      className="relative flex min-h-screen overflow-hidden bg-[#0B1020]"
      style={{ fontFamily: "var(--font-sora, Sora, sans-serif)" }}
    >
      {/* ── Global background orbs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-5%] top-[10%] h-[600px] w-[600px] rounded-full bg-[#7C5CFF]/12 blur-[130px]" />
        <div className="absolute right-[-5%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-[#22D3EE]/8 blur-[100px]" />
        <div className="absolute left-[40%] top-[60%] h-[300px] w-[300px] rounded-full bg-[#3B82F6]/8 blur-[90px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── LEFT PANEL — marketing ── */}
      <div className="relative hidden flex-col justify-between px-12 py-12 lg:flex lg:w-[55%] xl:px-16">
        {/* Brand — clicável para voltar à home */}
        <a href="/" className="inline-block transition-opacity hover:opacity-80">
          <Brand compact />
        </a>

        {/* Center content */}
        <div className="max-w-lg">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#22D3EE]">
            ✦ Plataforma para profissionais
          </div>

          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[#EAF0FF] xl:text-5xl">
            Seu site profissional<br />
            <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
              te espera.
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[#EAF0FF]/55">
            Acesse o painel e continue construindo sua presença online. Tudo que você precisa para crescer está aqui.
          </p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Sites ativos" },
              { value: "4.9★", label: "Avaliação" },
              { value: "< 5min", label: "Setup médio" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center backdrop-blur-sm"
              >
                <p className="text-xl font-black text-[#EAF0FF]">{value}</p>
                <p className="mt-0.5 text-[11px] text-[#EAF0FF]/45">{label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#EAF0FF]/70 italic">
              &quot;Depois que publiquei meu site na BuildSphere, meus clientes chegam muito mais preparados e confiantes. Vale cada centavo.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7C5CFF,#22D3EE)] text-[11px] font-bold text-white">
                CM
              </div>
              <div>
                <p className="text-sm font-bold text-[#EAF0FF]">Camila Monteiro</p>
                <p className="text-[11px] text-[#EAF0FF]/45">Nutricionista · São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-xs text-[#EAF0FF]/25">
          © {new Date().getFullYear()} BuildSphere. Todos os direitos reservados.
        </p>
      </div>

      {/* ── Vertical divider ── */}
      <div className="pointer-events-none absolute bottom-0 left-[55%] top-0 hidden w-px lg:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[45%] lg:px-12">
        {/* Mobile brand — clicável para voltar à home */}
        <a href="/" className="mb-8 inline-block transition-opacity hover:opacity-80 lg:hidden">
          <Brand compact />
        </a>

        <div className="w-full max-w-sm">
          {/* Form card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428]/80 p-8 shadow-[0_0_60px_rgba(124,92,255,0.15)] backdrop-blur-xl">
            {/* Card inner glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#22D3EE]/8 blur-[50px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#7C5CFF]/8 blur-[50px]" />

            <div className="relative">
              {/* Gradient line top */}
              <div className="mb-6 h-0.5 w-16 rounded-full bg-[linear-gradient(90deg,#3B82F6,#7C5CFF,#22D3EE)]" />

              {checkoutSuccess ? (
                <>
                  <div className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                    <p className="text-sm font-bold text-emerald-400">🎉 Pagamento confirmado!</p>
                    <p className="mt-1 text-xs text-emerald-400/80">
                      Sua conta foi criada. Faça login com o email e senha que você cadastrou.
                    </p>
                  </div>
                  <h2 className="text-2xl font-black text-[#EAF0FF]">Bem-vindo à BuildSphere</h2>
                  <p className="mt-2 text-sm text-[#EAF0FF]/55">Use o email e senha do seu cadastro.</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-[#EAF0FF]">Acessar o painel</h2>
                  <p className="mt-2 text-sm text-[#EAF0FF]/55">
                    Entre com suas credenciais para continuar.
                  </p>
                </>
              )}

              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#EAF0FF]/30">
            Não tem conta?{" "}
            <a href="/quero-comecar" className="text-[#22D3EE] hover:underline">
              Crie seu site →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
