"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const navLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Precos", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-[#0B1020]/95 backdrop-blur-xl"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="flex items-center justify-end p-5">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-2 text-[var(--platform-text)] transition hover:bg-white/[0.1]"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-2xl font-semibold text-[var(--platform-text)]/80 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/quero-comecar"
              onClick={onClose}
              className="mt-6 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-8 py-4 text-base font-semibold text-white shadow-[0_14px_40px_rgba(59,130,246,0.4)] transition hover:brightness-110"
            >
              Comecar agora
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
