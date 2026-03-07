"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff, QrCode } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type EnrollmentState =
  | { stage: "loading" }
  | { stage: "idle" }
  | { stage: "enrolled"; factorId: string }
  | { stage: "enrolling"; factorId: string; qrCode: string; secret: string }
  | { stage: "verifying"; factorId: string }
  | { stage: "unenrolling"; factorId: string };

export function MfaEnrollment() {
  const [state, setState] = useState<EnrollmentState>({ stage: "loading" });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function checkEnrollment() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setState({ stage: "idle" });
        return;
      }
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp?.find((f: { status: string }) => f.status === "verified");
      if (totp) {
        setState({ stage: "enrolled", factorId: totp.id });
      } else {
        setState({ stage: "idle" });
      }
    }
    checkEnrollment();
  }, []);

  async function startEnrollment() {
    setError(null);
    setSuccess(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "BuildSphere",
    });

    if (enrollError || !data) {
      setError("Falha ao iniciar ativação do 2FA. Tente novamente.");
      return;
    }

    setState({
      stage: "enrolling",
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function verifyEnrollment() {
    if (state.stage !== "enrolling") return;
    setError(null);

    setState({ stage: "verifying", factorId: state.factorId });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: state.factorId,
      code: code.trim(),
    });

    if (verifyError) {
      setError("Código inválido. Verifique o app e tente novamente.");
      setState({ stage: "enrolling", factorId: state.factorId, qrCode: "", secret: "" });
      // Re-fetch QR because we can't store it across state
      await startEnrollment();
      return;
    }

    setCode("");
    setSuccess("2FA ativado com sucesso!");
    setState({ stage: "enrolled", factorId: state.factorId });
  }

  async function unenroll() {
    if (state.stage !== "enrolled") return;
    setError(null);
    setSuccess(null);

    const factorId = state.factorId;
    setState({ stage: "unenrolling", factorId });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });

    if (unenrollError) {
      setError("Falha ao desativar 2FA. Tente novamente.");
      setState({ stage: "enrolled", factorId });
      return;
    }

    setSuccess("2FA desativado.");
    setState({ stage: "idle" });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          {success}
        </p>
      )}

      {state.stage === "loading" && (
        <p className="text-sm text-[var(--platform-text)]/50">Verificando status do 2FA...</p>
      )}

      {state.stage === "idle" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--platform-text)]/10">
              <ShieldOff size={15} className="text-[var(--platform-text)]/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--platform-text)]">
                Autenticação de dois fatores
              </p>
              <p className="text-xs text-[var(--platform-text)]/50">Não ativada</p>
            </div>
          </div>
          <button
            onClick={startEnrollment}
            className="rounded-lg bg-[#22D3EE]/10 px-4 py-2 text-xs font-semibold text-[#22D3EE] transition hover:bg-[#22D3EE]/20"
          >
            Ativar 2FA
          </button>
        </div>
      )}

      {state.stage === "enrolled" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck size={15} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--platform-text)]">
                Autenticação de dois fatores
              </p>
              <p className="text-xs text-emerald-400">Ativa — TOTP (Google Authenticator, etc.)</p>
            </div>
          </div>
          <button
            onClick={unenroll}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            Desativar
          </button>
        </div>
      )}

      {state.stage === "unenrolling" && (
        <p className="text-sm text-[var(--platform-text)]/50">Desativando 2FA...</p>
      )}

      {(state.stage === "enrolling" || state.stage === "verifying") && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22D3EE]/10">
              <QrCode size={15} className="text-[#22D3EE]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--platform-text)]">Configurar 2FA</p>
              <p className="text-xs text-[var(--platform-text)]/50">
                Escaneie o QR code com Google Authenticator, Authy ou similar
              </p>
            </div>
          </div>

          {state.stage === "enrolling" && state.qrCode && (
            <div
              className="w-fit rounded-xl bg-white p-3 mx-auto"
              dangerouslySetInnerHTML={{ __html: state.qrCode }}
            />
          )}

          {state.stage === "enrolling" && state.secret && (
            <div className="rounded-xl bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-[10px] text-[var(--platform-text)]/50 mb-1">
                Ou insira o código manualmente no app:
              </p>
              <code className="text-xs font-mono text-[var(--platform-text)]/80 break-all">
                {state.secret}
              </code>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
              Código de verificação (6 dígitos)
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-center font-mono text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setState({ stage: "idle" })}
              className="flex-1 rounded-lg border border-white/20 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-[var(--platform-text)] transition hover:bg-white/[0.08]"
            >
              Cancelar
            </button>
            <button
              onClick={verifyEnrollment}
              disabled={code.length !== 6 || state.stage === "verifying"}
              className="flex-1 rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.stage === "verifying" ? "Verificando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
