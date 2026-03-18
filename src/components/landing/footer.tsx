import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PlatformBrandingSettings } from "@/lib/platform/settings";
import { buildSocialUrl, SOCIAL_META } from "@/lib/platform/branding-utils";

const productLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "Plano Premium", href: "/premium" },
  { label: "FAQ", href: "#faq" },
];

const platformLinks = [
  { label: "Criar meu site", href: "/quero-comecar" },
  { label: "Entrar na conta", href: "/login" },
  { label: "Painel admin", href: "/admin" },
];

const legalLinks = [
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Privacidade", href: "/privacidade" },
];

type FooterProps = {
  brandElement: React.ReactNode;
  branding?: PlatformBrandingSettings;
};

export function Footer({ brandElement, branding }: FooterProps) {
  const brandName = branding?.brand_name ?? "BuildSphere";
  const tagline = branding?.tagline ?? "Seu site profissional em minutos";
  const description =
    branding?.platform_description ??
    "Plataforma para criação de sites profissionais para autônomos e prestadores de serviço.";
  const year = new Date().getFullYear();

  const socials = branding
    ? (Object.keys(SOCIAL_META) as (keyof typeof SOCIAL_META)[])
        .map((k) => {
          const value = branding[`social_${k}` as keyof PlatformBrandingSettings] as string;
          if (!value) return null;
          return {
            key: k,
            label: SOCIAL_META[k].label,
            emoji: SOCIAL_META[k].emoji,
            href: buildSocialUrl(k, value),
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)
    : [];

  return (
    <footer className="relative overflow-hidden bg-[#050810]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[5%] h-[500px] w-[500px] rounded-full bg-[#3B82F6]/8 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#7C5CFF]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-[40%] h-[300px] w-[300px] rounded-full bg-[#22D3EE]/6 blur-[90px]" />
      </div>

      {/* Top gradient separator */}
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent_5%,#3B82F6_30%,#7C5CFF_50%,#22D3EE_70%,transparent_95%)] opacity-40" />

      {/* ── BIG CTA BLOCK ── */}
      <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-14 md:px-8 md:pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.07),rgba(124,92,255,0.10),rgba(34,211,238,0.06))] px-8 py-14 text-center md:px-14 md:py-16">
          {/* Card inner glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[20%] top-[-30%] h-[300px] w-[300px] rounded-full bg-[#7C5CFF]/15 blur-[80px]" />
            <div className="absolute right-[15%] top-[-20%] h-[250px] w-[250px] rounded-full bg-[#22D3EE]/10 blur-[70px]" />
          </div>

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#22D3EE]">
              Comece gratuitamente
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight text-[#EAF0FF] md:text-5xl">
              Pronto para ter seu<br />
              <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                site profissional?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#EAF0FF]/55">
              Junte-se a centenas de profissionais. Configure em minutos, publique hoje.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/quero-comecar"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_0_60px_rgba(124,92,255,0.6)]"
              >
                Criar meu site agora
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/premium"
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-[#EAF0FF]/70 transition-all hover:border-white/25 hover:bg-white/[0.07] hover:text-[#EAF0FF]"
              >
                Ver planos →
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#EAF0FF]/35">
              Sem taxa de setup · Sem fidelidade · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>

      {/* ── LINKS GRID ── */}
      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-12 md:px-8 md:pb-10 md:pt-14">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <div className="mb-4">{brandElement}</div>
            <p className="text-base font-semibold text-[#EAF0FF]/80">{tagline}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#EAF0FF]/40">{description}</p>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base transition-all duration-200 hover:scale-110 hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/10"
                  >
                    {s.emoji}
                  </a>
                ))}
              </div>
            )}

            {/* Contact */}
            <div className="mt-4 flex flex-col gap-1">
              <a
                href={`mailto:${branding?.contact_email || "contato@bsph.com.br"}`}
                className="text-sm text-[#EAF0FF]/40 transition hover:text-[#22D3EE]"
              >
                {branding?.contact_email || "contato@bsph.com.br"}
              </a>
              <a
                href="https://wa.me/5511915194173"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#EAF0FF]/40 transition hover:text-[#22D3EE]"
              >
                WhatsApp: (11) 91519-4173
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#22D3EE]">
              Produto
            </p>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-sm text-[#EAF0FF]/50 transition-colors duration-200 hover:text-[#EAF0FF]">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-[#EAF0FF]/50 transition-colors duration-200 hover:text-[#EAF0FF]">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Plataforma */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#22D3EE]">
              Plataforma
            </p>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#EAF0FF]/50 transition-colors duration-200 hover:text-[#EAF0FF]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#22D3EE]">
              Legal
            </p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#EAF0FF]/50 transition-colors duration-200 hover:text-[#EAF0FF]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/[0.07] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-[#EAF0FF]/30">
              &copy; {year} {brandName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#EAF0FF]/20">Feito com</span>
              <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-xs font-bold text-transparent">
                {" "}muito carinho{" "}
              </span>
              <span className="text-xs text-[#EAF0FF]/20">para profissionais autônomos</span>
            </div>
            <div className="flex gap-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[#EAF0FF]/25 transition hover:text-[#EAF0FF]/60"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
