import Link from "next/link";
import type { PlatformBrandingSettings } from "@/lib/platform/settings";
import { buildSocialUrl, SOCIAL_META } from "@/lib/platform/settings";

const productLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "Plano Premium", href: "/premium" },
  { label: "FAQ", href: "#faq" },
];

const platformLinks = [
  { label: "Login", href: "/login" },
  { label: "Criar meu site", href: "/quero-comecar" },
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
  const description =
    branding?.platform_description ?? "Sites profissionais para quem trabalha por conta própria.";
  const year = new Date().getFullYear();

  // Build social links list from branding
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
        .filter(Boolean)
    : [];

  return (
    <footer className="border-t border-white/10 bg-[#080C18]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            {brandElement}
            <p className="mt-3 max-w-xs text-sm text-[var(--platform-text)]/50">{description}</p>
            {/* Social icons */}
            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s!.key}
                    href={s!.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s!.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm transition hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/10"
                  >
                    {s!.emoji}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/50">
              Produto
            </p>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/50">
              Plataforma
            </p>
            <ul className="mt-3 space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/50">
              Legal
            </p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-[var(--platform-text)]/40">
            &copy; {year} {brandName}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-[var(--platform-text)]/30 transition hover:text-[var(--platform-text)]/60">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
