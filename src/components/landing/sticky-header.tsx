"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Exemplos", href: "#exemplos" },
  { label: "Preços", href: "#precos" },
  { label: "Premium", href: "/premium" },
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
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#0B1020]/75 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Top gradient line */}
        {scrolled && (
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#3B82F6,#7C5CFF,#22D3EE,transparent)]" />
        )}

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
          {/* Brand */}
          <Link href="/" className="shrink-0">
            {brandElement}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3.5 py-2 text-[13px] font-medium text-[#EAF0FF]/65 transition-all duration-200 hover:bg-white/[0.07] hover:text-[#EAF0FF]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3.5 py-2 text-[13px] font-medium text-[#EAF0FF]/65 transition-all duration-200 hover:bg-white/[0.07] hover:text-[#EAF0FF]"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="mx-2 h-4 w-px bg-white/10" />

            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-[#EAF0FF]/80 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-[#EAF0FF]"
            >
              Login
            </Link>

            <Link
              href="/quero-comecar"
              className="ml-1.5 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(124,92,255,0.3)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] hover:brightness-110"
            >
              Começar agora
            </Link>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-[#EAF0FF]/80 transition hover:bg-white/[0.08]"
            >
              Login
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-[#EAF0FF]/70 transition hover:bg-white/[0.07] hover:text-[#EAF0FF]"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
