"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Status = {
  type: "error" | "success";
  message: string;
} | null;

const errorMessages: Record<string, string> = {
  auth_required: "Voce precisa fazer login para acessar esta area.",
  forbidden: "Seu usuario nao tem permissao para acessar esta area.",
};

const authReasonMessages: Record<string, string> = {
  supabase_missing: "Supabase nao configurado corretamente no servidor.",
  auth_user_error: "Falha ao validar sessao no servidor.",
  no_user: "Sessao nao encontrada. Faça login novamente.",
  profile_query_error: "Falha ao carregar perfil do usuario.",
  profile_not_found: "Usuario sem perfil de acesso. Fale com o admin da plataforma.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const presetMessage = useMemo(() => {
    const key = searchParams.get("error");
    const reason = searchParams.get("reason");
    if (!key) {
      return null;
    }

    if (key === "auth_required" && reason && authReasonMessages[reason]) {
      return authReasonMessages[reason];
    }

    return errorMessages[key] ?? "Nao foi possivel concluir sua autenticacao.";
  }, [searchParams]);

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus({ type: "error", message: "Supabase nao configurado no ambiente." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setStatus({ type: "error", message: "Preencha email e senha para entrar." });
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      const isRateLimit = error.status === 429 || error.message?.toLowerCase().includes("rate");
      setStatus({
        type: "error",
        message: isRateLimit
          ? "Muitas tentativas de login. Aguarde alguns minutos e tente novamente."
          : "Credenciais invalidas ou acesso nao liberado.",
      });
      return;
    }

    if (!data.session) {
      setStatus({ type: "error", message: "Sessao nao foi persistida. Tente novamente." });
      return;
    }

    window.location.assign("/admin");
  }

  async function onForgotPassword() {
    setStatus(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus({ type: "error", message: "Supabase nao configurado no ambiente." });
      return;
    }

    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const email = (emailInput?.value ?? "").trim();
    if (!email) {
      setStatus({ type: "error", message: "Informe seu email para recuperar a senha." });
      return;
    }

    setIsLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setIsLoading(false);

    if (error) {
      setStatus({ type: "error", message: "Nao foi possivel iniciar recuperacao de senha." });
      return;
    }

    setStatus({
      type: "success",
      message: "Enviamos um link de recuperacao para o seu email.",
    });
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={onLogin}>
      {presetMessage && (
        <p className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          {presetMessage}
        </p>
      )}
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

      <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="voce@cliente.com"
      />

      <label
        className="mt-2 block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
        htmlFor="password"
      >
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
        placeholder="Sua senha"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>

      <button
        type="button"
        onClick={onForgotPassword}
        disabled={isLoading}
        className="w-full rounded-lg border border-white/20 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Recuperar senha
      </button>
    </form>
  );
}
