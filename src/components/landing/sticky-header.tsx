"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Exemplos", href: "#exemplos" },
  { label: "Preços", href: "#precos" },
  { label: "Premium ✦", href: "/premium" },
  { label: "FAQ", href: "#faq" },
];

type StickyHeaderProps = {
  brandElement: React.ReactNode;
};

export function StickyHeader({ brandElement }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      {announcementVisible && !scrolled && (
        <div className="relative z-50 bg-[linear-gradient(90deg,#1e3a8a,#4c1d95,#164e63)] py-2.5 text-center text-xs font-semibold text-white">
          {/* Shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />
          <span className="relative inline-flex items-center gap-2.5">
            <Sparkles size={12} className="shrink-0 text-[#22D3EE]" />
            <span className="hidden sm:inline text-white/80">Novidade:</span>
            <span className="font-bold">Blog, Galeria e Eventos no Plano Premium</span>
            <Link
              href="/premium"
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-bold text-white ring-1 ring-white/25 transition-all hover:bg-white/25 hover:ring-white/40"
            >
              Ver planos
              <ArrowRight size={10} />
            </Link>
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#0B1020]/85 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Gradient accent line */}
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent_5%,#3B82F6_30%,#7C5CFF_50%,#22D3EE_70%,transparent_95%)] transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
          {/* Brand */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            {brandElement}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    link.label.includes("✦")
                      ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(124,92,255,0.12))] text-[#A78BFA] hover:bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,92,255,0.2))] hover:text-[#C4B5FD]"
                      : "text-[#EAF0FF]/60 hover:bg-white/[0.06] hover:text-[#EAF0FF]"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-[#EAF0FF]/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-[#EAF0FF]"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="mx-3 h-5 w-px bg-white/10" />

            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#EAF0FF]/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-[#EAF0FF]"
            >
              Entrar
            </Link>

            <Link
              href="/quero-comecar"
              className="group ml-1 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(124,92,255,0.4)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(124,92,255,0.6)]"
            >
              Criar meu site
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/quero-comecar"
              className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-2 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(124,92,255,0.4)]"
            >
              Começar
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-white/10 p-2.5 text-[#EAF0FF]/70 transition hover:bg-white/[0.07] hover:text-[#EAF0FF]"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
