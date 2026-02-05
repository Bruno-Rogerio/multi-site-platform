import Link from "next/link";

const productLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Precos", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

const platformLinks = [
  { label: "Login", href: "/login" },
  { label: "Painel", href: "/admin" },
];

type FooterProps = {
  brandElement: React.ReactNode;
};

export function Footer({ brandElement }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#080C18]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            {brandElement}
            <p className="mt-3 max-w-xs text-sm text-[var(--platform-text)]/50">
              Sites profissionais para quem cuida de pessoas.
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--platform-text)]/50">
              Produto
            </p>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]"
                  >
                    {link.label}
                  </a>
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
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--platform-text)]/60 transition hover:text-[#22D3EE]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-[var(--platform-text)]/40">
            &copy; 2026 BuildSphere. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--platform-text)]/40">
            Feito para profissionais autonomos
          </p>
        </div>
      </div>
    </footer>
  );
}
