"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "bs_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // SSR or restricted env
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch { /* noop */ }
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch { /* noop */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#12182B]/95 px-5 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:left-auto md:right-6 md:max-w-sm">
      <p className="text-xs font-bold text-[var(--platform-text)]">🍪 Usamos cookies</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--platform-text)]/60">
        Utilizamos cookies essenciais para o funcionamento da plataforma. Consulte nossa{" "}
        <Link href="/privacidade" className="text-[#22D3EE] hover:underline">
          Política de Privacidade
        </Link>{" "}
        e nossos{" "}
        <Link href="/termos" className="text-[#22D3EE] hover:underline">
          Termos de Uso
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={decline}
          className="flex-1 rounded-lg border border-white/15 py-1.5 text-xs font-semibold text-[var(--platform-text)]/60 transition hover:bg-white/[0.04]"
        >
          Recusar
        </button>
        <button
          onClick={accept}
          className="flex-1 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] py-1.5 text-xs font-bold text-white transition hover:brightness-110"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
