"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const WARN_MS = 28 * 60 * 1000; // warn at 28 min

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const warnRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showWarning, setShowWarning] = useState(false);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(warnRef.current);
    setShowWarning(false);

    warnRef.current = setTimeout(() => {
      setShowWarning(true);
    }, WARN_MS);

    timerRef.current = setTimeout(async () => {
      const supabase = createSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
      window.location.assign("/login?reason=session_expired");
    }, TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ] as const;
    events.forEach((e) =>
      window.addEventListener(e, resetTimer, { passive: true }),
    );
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearTimeout(warnRef.current);
    };
  }, [resetTimer]);

  return (
    <>
      {children}
      {showWarning && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-2xl border border-amber-400/30 bg-[#0B1020] p-4 shadow-2xl">
          <p className="text-sm font-semibold text-amber-300">
            Sessão prestes a expirar
          </p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/60">
            Sua sessão expira em 2 minutos por inatividade. Clique para
            continuar conectado.
          </p>
          <button
            onClick={resetTimer}
            className="mt-3 w-full rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
          >
            Continuar conectado
          </button>
        </div>
      )}
    </>
  );
}
