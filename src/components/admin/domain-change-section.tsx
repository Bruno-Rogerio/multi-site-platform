"use client";

import { CheckCircle2, Globe, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  siteId: string;
  currentDomain: string;
  domainSuccess?: boolean;
};

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export function DomainChangeSection({ siteId: _siteId, currentDomain, domainSuccess = false }: Props) {
  const currentSubdomain = currentDomain.replace(`.${ROOT_DOMAIN}`, "");

  const [subdomain, setSubdomain] = useState("");
  const [availability, setAvailability] = useState<AvailabilityStatus>("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkAvailability() {
    const value = subdomain.toLowerCase().trim();
    if (!value) return;

    if (value === currentSubdomain) {
      setAvailability("taken");
      setAvailabilityMessage("Este já é seu subdomínio atual.");
      return;
    }

    setAvailability("checking");
    setAvailabilityMessage("");

    const res = await fetch(
      `/api/onboarding/check-subdomain?subdomain=${encodeURIComponent(value)}`,
    );
    const data = await res.json().catch(() => null) as
      | { available?: boolean; error?: string }
      | null;

    if (!data) {
      setAvailability("error");
      setAvailabilityMessage("Erro ao verificar. Tente novamente.");
      return;
    }

    if (data.available) {
      setAvailability("available");
      setAvailabilityMessage("Disponível!");
    } else {
      setAvailability("taken");
      setAvailabilityMessage(data.error ?? "Subdomínio já em uso.");
    }
  }

  async function handleCheckout() {
    setError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/admin/domain/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSubdomain: subdomain.toLowerCase().trim() }),
      });
      const data = await res.json().catch(() => null) as
        | { checkoutUrl?: string; error?: string }
        | null;
      if (!res.ok || !data?.checkoutUrl) {
        setError(data?.error ?? "Erro ao criar checkout. Tente novamente.");
        return;
      }
      window.location.assign(data.checkoutUrl);
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Success banner */}
      {domainSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">Domínio atualizado com sucesso!</p>
            <p className="text-xs text-emerald-300/70">
              Seu site estará acessível no novo endereço em até 5 minutos.
            </p>
          </div>
        </div>
      )}

      {/* Current domain */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe size={16} className="text-[#22D3EE]" />
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Seu subdomínio atual</h2>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3">
          <Globe size={14} className="shrink-0 text-[#22D3EE]" />
          <p className="font-mono text-sm text-[#22D3EE]">{currentDomain}</p>
        </div>
      </section>

      {/* Change domain */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <h2 className="text-sm font-semibold text-[var(--platform-text)]">Trocar subdomínio</h2>
        <p className="mt-1 text-xs text-[var(--platform-text)]/50">
          Verifique a disponibilidade antes de prosseguir com o pagamento de R$ 29,90.
        </p>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
            Novo subdomínio
          </label>
          <div className="mt-1.5 flex gap-2">
            <div className="flex flex-1 overflow-hidden rounded-xl border border-white/15 bg-[#0B1020] transition focus-within:border-[#22D3EE]">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                  setAvailability("idle");
                  setAvailabilityMessage("");
                }}
                onKeyDown={(e) => e.key === "Enter" && void checkAvailability()}
                placeholder="meusite"
                maxLength={30}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--platform-text)] outline-none"
              />
              <span className="flex items-center pr-3 text-sm text-[var(--platform-text)]/40">
                .{ROOT_DOMAIN}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void checkAvailability()}
              disabled={!subdomain.trim() || availability === "checking"}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[var(--platform-text)]/70 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availability === "checking" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Verificar"
              )}
            </button>
          </div>

          {/* Availability feedback */}
          {availabilityMessage && (
            <div
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                availability === "available" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {availability === "available" ? (
                <CheckCircle2 size={13} />
              ) : (
                <XCircle size={13} />
              )}
              {availabilityMessage}
            </div>
          )}
        </div>

        {/* Price summary */}
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#0B1020] px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--platform-text)]">Troca de subdomínio</p>
              <p className="mt-0.5 text-xs text-[var(--platform-text)]/50">
                Cobrança única — processado pelo Stripe
              </p>
            </div>
            <p className="text-lg font-bold text-[#22D3EE]">R$ 29,90</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            <XCircle size={13} />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleCheckout()}
          disabled={availability !== "available" || isCheckingOut}
          className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isCheckingOut ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Aguarde...
            </span>
          ) : (
            "Trocar subdomínio — R$ 29,90"
          )}
        </button>

        <p className="mt-3 text-center text-[10px] text-[var(--platform-text)]/30">
          Após a confirmação do pagamento, o novo endereço ficará ativo em até 5 minutos.
        </p>
      </section>
    </div>
  );
}
