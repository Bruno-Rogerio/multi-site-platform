"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { PLAN_PRICE_IDS, planDefinitions } from "@/lib/onboarding/plans";
import type { OnboardingPlan } from "@/lib/onboarding/types";
import { validateEmail, validatePassword, validateDocument } from "@/lib/onboarding/validation";
import { formatPrice } from "@/lib/onboarding/pricing";
import { calculateMonthlyTotal } from "@/lib/onboarding/pricing";

type Props = {
  siteId: string;
  siteName: string;
  siteDomain: string;
  ownerEmail: string;
  selectedPlan: string;
  previewExpiresAt: string;
};

export function PublicarClient({ siteId, siteName, siteDomain, ownerEmail, selectedPlan, previewExpiresAt }: Props) {
  const plan = selectedPlan as OnboardingPlan;
  const planDef = planDefinitions.find((p) => p.id === plan) ?? planDefinitions[0];
  const monthlyTotal = calculateMonthlyTotal(plan, []);
  const priceId = PLAN_PRICE_IDS[plan] ?? PLAN_PRICE_IDS["basico"];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(ownerEmail);
  const [password, setPassword] = useState("");
  const [document, setDocument] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = validateEmail(email);
  const passwordValid = validatePassword(password);
  const documentValid = document ? validateDocument(document) : { valid: true };

  const canSubmit =
    fullName.trim().length >= 3 &&
    emailValid.valid &&
    passwordValid.valid &&
    documentValid.valid &&
    acceptTerms &&
    !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/register-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          priceId,
          creationMode: plan === "basico" ? "template" : plan === "premium-full" ? "builder-premium" : "builder",
          fullName: fullName.trim(),
          document,
          email: email.trim().toLowerCase(),
          password,
          addonsSelected: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao processar. Tente novamente.");
        return;
      }

      if (data.bypass) {
        window.location.href = `/login?checkout=success`;
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#EAF0FF]">
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Publicar {siteName}</h1>
            <p className="mt-2 text-sm text-[#EAF0FF]/60">
              Crie sua conta e ative seu site em{" "}
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

          {/* Registration form */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                Nome completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
              />
              {email && !emailValid.valid && (
                <p className="mt-1 text-xs text-red-400">E-mail inválido</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 10 caracteres"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-4 pr-10 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EAF0FF]/40 hover:text-[#EAF0FF]/70"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && !passwordValid.valid && (
                <p className="mt-1 text-xs text-red-400">
                  Use 10+ caracteres com maiúscula, minúscula, número e símbolo
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
                CPF ou CNPJ <span className="text-[#EAF0FF]/30 normal-case tracking-normal font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
              />
              {document && !documentValid.valid && (
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
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Confirmar e ir para pagamento — {formatPrice(monthlyTotal)}/mês
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
      </div>
    </div>
  );
}
