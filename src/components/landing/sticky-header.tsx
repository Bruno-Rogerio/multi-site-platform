"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

type StickyHeaderProps = {
  brandElement: React.ReactNode;
};

export function StickyHeader({ brandElement }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#0B1020]/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <Link href="/" className="shrink-0">
            {brandElement}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide text-[var(--platform-text)]/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/login"
              className="ml-2 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-[13px] font-medium text-[var(--platform-text)] transition hover:bg-white/[0.08]"
            >
              Login
            </Link>

            <Link
              href="/quero-comecar"
              className="ml-1 rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-2 text-[13px] font-semibold text-white transition hover:brightness-110"
            >
              Começar agora
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[var(--platform-text)] transition hover:bg-white/[0.06] md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
