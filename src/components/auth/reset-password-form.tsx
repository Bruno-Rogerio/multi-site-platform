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
              ? "border border-red-300 bg-red-50 text-red-700"
              : "border border-emerald-300 bg-emerald-50 text-emerald-700"
          }`}
        >
          {status.message}
        </p>
      )}
      <label
        className="block text-xs font-semibold uppercase tracking-wide opacity-70"
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
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
        placeholder="Minimo de 8 caracteres"
      />

      <label
        className="block text-xs font-semibold uppercase tracking-wide opacity-70"
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
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
        placeholder="Repita a senha"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Atualizando..." : "Atualizar senha"}
      </button>
    </form>
  );
}
