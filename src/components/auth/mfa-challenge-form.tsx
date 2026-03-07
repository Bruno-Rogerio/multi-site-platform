"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function MfaChallengeForm() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setInitError("Erro de configuração. Recarregue a página.");
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.find((f: { id: string; status: string }) => f.status === "verified");

      if (!totp) {
        // No factor enrolled — go straight to admin
        window.location.assign("/admin");
        return;
      }

      setFactorId(totp.id);

      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: totp.id });

      if (challengeError || !challenge) {
        setInitError("Falha ao iniciar desafio 2FA. Tente fazer login novamente.");
        return;
      }

      setChallengeId(challenge.id);
    }

    init();
  }, []);

  async function onVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!factorId || !challengeId) return;

    setError(null);
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      setError("Erro de configuração. Recarregue a página.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: code.trim(),
    });

    setIsLoading(false);

    if (verifyError) {
      setError("Código inválido ou expirado. Tente novamente.");
      return;
    }

    window.location.assign("/admin");
  }

  if (initError) {
    return (
      <div className="mt-6 rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-3 text-sm text-red-200">
        {initError}
      </div>
    );
  }

  if (!factorId || !challengeId) {
    return (
      <p className="mt-6 text-sm text-[var(--platform-text)]/50">Carregando desafio 2FA...</p>
    );
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={onVerify}>
      {error && (
        <p className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <label
        className="block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
        htmlFor="totp-code"
      >
        Código do autenticador (6 dígitos)
      </label>
      <input
        id="totp-code"
        type="text"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        required
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-center font-mono text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="000000"
      />

      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="mt-2 w-full rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Verificando..." : "Verificar"}
      </button>

      <p className="pt-1 text-center text-[11px] text-[var(--platform-text)]/40">
        Abra o app Google Authenticator ou Authy para obter o código.
      </p>
    </form>
  );
}
