"use client";

import { FormEvent, useState } from "react";

type Status = { type: "error" | "success"; message: string } | null;

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function onResend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Informe um e-mail válido." });
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/onboarding/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setIsLoading(false);

    if (res.status === 429) {
      setStatus({
        type: "error",
        message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      });
      return;
    }

    setStatus({
      type: "success",
      message: "Link de confirmação reenviado. Verifique sua caixa de entrada.",
    });
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={onResend}>
      {status && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            status.type === "error"
              ? "border border-red-300/40 bg-red-500/10 text-red-200"
              : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {status.message}
        </p>
      )}

      <label
        className="block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
        htmlFor="resend-email"
      >
        Seu e-mail
      </label>
      <input
        id="resend-email"
        name="email"
        type="email"
        required
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="voce@exemplo.com"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 w-full rounded-lg border border-white/20 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Enviando..." : "Reenviar link de confirmação"}
      </button>
    </form>
  );
}
