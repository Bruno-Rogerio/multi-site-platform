"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { PLAN_PRICE_IDS, planDefinitions } from "@/lib/onboarding/plans";
import type { OnboardingPlan } from "@/lib/onboarding/types";
import { validateDocument } from "@/lib/onboarding/validation";
import { formatPrice, calculateMonthlyTotal } from "@/lib/onboarding/pricing";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type Phase = "form" | "loading" | "checkout";

type Props = {
  siteId: string;
  siteName: string;
  siteDomain: string;
  ownerEmail: string;
  selectedPlan: string;
  previewExpiresAt: string;
};

export function PublicarClient({ siteId, siteName, siteDomain, ownerEmail, selectedPlan }: Props) {
  const plan = selectedPlan as OnboardingPlan;
  const planDef = planDefinitions.find((p) => p.id === plan) ?? planDefinitions[0];
  const monthlyTotal = calculateMonthlyTotal(plan, []);
  const priceId = PLAN_PRICE_IDS[plan] ?? PLAN_PRICE_IDS["basico"];

  const [docValue, setDocValue] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const documentValid = docValue ? validateDocument(docValue) : { valid: true };
  const canSubmit = documentValid.valid && acceptTerms && phase === "form";

  async function handleSubmit() {
    if (!canSubmit) return;
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/onboarding/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, priceId, document: docValue }),
      });

      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        setError(data.error ?? "Erro ao iniciar pagamento. Tente novamente.");
        setPhase("form");
        return;
      }

      setClientSecret(data.clientSecret);
      setPhase("checkout");
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setPhase("form");
    }
  }

  // fetchClientSecret for EmbeddedCheckoutProvider (called once on mount of checkout phase)
  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret ?? ""), [clientSecret]);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#EAF0FF]">
      <div className="mx-auto max-w-lg px-4 py-12">
        <AnimatePresence mode="wait">
          {phase !== "checkout" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">Publicar {siteName}</h1>
                <p className="mt-2 text-sm text-[#EAF0FF]/60">
                  Ative seu site em{" "}
                  <span className="font-medium text-[#22D3EE]">{siteDomain}</span>
                </p>
              </div>

              {/* Plan card */}
              <div className="mb-6 rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                      Plano selecionado
                    </p>
                    <p className="mt-0.5 text-lg font-bold">{planDef.name}</p>
                    <p className="text-xs text-[#EAF0FF]/50">{planDef.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#22D3EE]">{formatPrice(monthlyTotal)}</p>
                    <p className="text-xs text-[#EAF0FF]/40">/mês</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Email readonly */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                    Conta vinculada
                  </label>
                  <input
                    type="email"
                    value={ownerEmail}
                    readOnly
                    className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[#EAF0FF]/60 outline-none"
                  />
                </div>

                {/* CPF / CNPJ */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                    CPF ou CNPJ{" "}
                    <span className="normal-case tracking-normal font-normal text-[#EAF0FF]/30">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={docValue}
                    onChange={(e) => setDocValue(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
                  />
                  {docValue && !documentValid.valid && (
                    <p className="mt-1 text-xs text-red-400">CPF ou CNPJ inválido</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/30 accent-[#3B82F6]"
                  />
                  <span className="text-xs text-[#EAF0FF]/50">
                    Concordo com os{" "}
                    <a href="/termos" className="text-[#3B82F6] hover:underline" target="_blank">
                      Termos de Uso
                    </a>{" "}
                    e{" "}
                    <a href="/privacidade" className="text-[#3B82F6] hover:underline" target="_blank">
                      Política de Privacidade
                    </a>
                  </span>
                </label>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {phase === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Preparando pagamento...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Confirmar e pagar — {formatPrice(monthlyTotal)}/mês
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#EAF0FF]/30">
                  <Lock size={10} />
                  <span>Pagamento seguro via Stripe</span>
                  <ShieldCheck size={10} className="ml-1" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back + header */}
              <div className="mb-6">
                <button
                  onClick={() => { setPhase("form"); setClientSecret(null); }}
                  className="mb-4 flex items-center gap-1.5 text-xs text-[#EAF0FF]/40 hover:text-[#EAF0FF]/70 transition"
                >
                  <ArrowLeft size={13} />
                  Voltar
                </button>
                <h2 className="text-xl font-bold">Pagamento</h2>
                <p className="mt-1 text-sm text-[#EAF0FF]/50">
                  {planDef.name} — {formatPrice(monthlyTotal)}/mês
                </p>
              </div>

              {/* Stripe Embedded Checkout */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
                {clientSecret && (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ fetchClientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
