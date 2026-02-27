"use client";

import { useEffect, useRef, useState } from "react";

type NavLink = { href: string; label: string };

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.closest("[data-mobile-nav]")?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Posiciona o dropdown com fixed para escapar de qualquer overflow/clip do header
  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      });
    }
    setOpen((v) => !v);
  }

  return (
    <div className="relative md:hidden" data-mobile-nav="">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-md transition hover:opacity-70"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {open && (
        <div
          style={{
            ...dropdownStyle,
            backgroundColor: "var(--site-background)",
            borderColor: "var(--site-border)",
            color: "var(--site-text)",
          }}
          className="min-w-[180px] rounded-xl border shadow-xl"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ color: "var(--site-text)" }}
              className="block px-4 py-3 text-sm font-medium transition hover:opacity-70 first:rounded-t-xl last:rounded-b-xl"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
