"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(
    null,
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus({ type: "error", message: "Supabase nao configurado no ambiente." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(formData.get("password_confirm") ?? "");

    if (password.length < 8) {
      setStatus({ type: "error", message: "A senha precisa ter no minimo 8 caracteres." });
      return;
    }

    if (password !== passwordConfirm) {
      setStatus({ type: "error", message: "As senhas nao conferem." });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setStatus({ type: "error", message: "Nao foi possivel atualizar sua senha." });
      return;
    }

    setStatus({ type: "success", message: "Senha atualizada com sucesso. Redirecionando..." });
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 900);
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={onSubmit}>
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
        htmlFor="password"
      >
        Nova senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="Minimo de 8 caracteres"
      />

      <label
        className="block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
        htmlFor="password_confirm"
      >
        Confirmar senha
      </label>
      <input
        id="password_confirm"
        name="password_confirm"
        type="password"
        required
        minLength={8}
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="Repita a senha"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Atualizando..." : "Atualizar senha"}
      </button>
    </form>
  );
}
