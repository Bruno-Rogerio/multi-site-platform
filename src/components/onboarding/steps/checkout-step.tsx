"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { formatPrice } from "@/lib/onboarding/pricing";
import { getPlanById, ADDON_DEFINITIONS } from "@/lib/onboarding/plans";
import { validateEmail, validatePassword, validateDocument } from "@/lib/onboarding/validation";

export function CheckoutStep() {
  const { state, dispatch, monthlyTotal } = useWizard();
  const { selectedPlan, addonsSelected, businessName, preferredSubdomain, ownerName, ownerEmail, ownerPassword, ownerDocument } = state;

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = selectedPlan ? getPlanById(selectedPlan) : null;

  // Validation
  const emailValid = validateEmail(ownerEmail);
  const passwordValid = validatePassword(ownerPassword);
  const documentValid = ownerDocument ? validateDocument(ownerDocument) : { valid: true };

  const canSubmit =
    ownerName.length >= 3 &&
    emailValid.valid &&
    passwordValid.valid &&
    documentValid.valid &&
    acceptTerms;

  function handleChange(field: string, value: string) {
    dispatch({ type: "SET_CHECKOUT_FIELD", key: field, value });
  }

  function deriveCreationMode(): "template" | "builder" | "builder-premium" {
    if (selectedPlan === "basico") return "template";
    if (selectedPlan === "premium-full") return "builder-premium";
    return "builder";
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // First, create the draft site
      // Merge serviceCards titles into content.servicesItems for the API
      const mergedContent = {
        ...state.content,
        servicesItems: state.serviceCards
          .map((c) => c.title)
          .filter((t) => t && t.trim())
          .join("\n"),
      };

      const draftResponse = await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creationMode: deriveCreationMode(),
          siteStyle: state.paletteId,
          paletteId: state.paletteId,
          customColors: state.customColors,
          fontFamily: state.fontFamily,
          headerStyle: "default",
          heroStyle: state.heroVariant,
          servicesStyle: state.servicesVariant,
          ctaStyle: state.ctaVariant,
          motionStyle: state.motionStyle,
          buttonStyle: state.buttonStyle,
          addonsSelected: state.addonsSelected,
          businessName: state.businessName,
          businessSegment: state.businessSegment,
          businessCity: state.businessCity,
          businessHighlights: state.businessHighlights,
          targetAudience: state.targetAudience,
          preferredSubdomain: state.preferredSubdomain,
          content: mergedContent,
          heroImage: state.heroImage,
          logoUrl: state.logoUrl,
          ctaConfig: state.ctaConfig,
          selectedCtaTypes: state.selectedCtaTypes,
        }),
      });

      if (!draftResponse.ok) {
        const data = await draftResponse.json();
        throw new Error(data.error || "Erro ao criar site");
      }

      const { siteId } = await draftResponse.json();

      // Then, start the checkout flow
      const checkoutResponse = await fetch("/api/onboarding/register-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          creationMode: deriveCreationMode(),
          fullName: ownerName,
          document: ownerDocument,
          email: ownerEmail,
          password: ownerPassword,
          addonsSelected,
        }),
      });

      if (!checkoutResponse.ok) {
        const data = await checkoutResponse.json();
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.bypass) {
        // Payment bypassed (dev mode) — site already activated
        window.location.href = "/login?checkout=success";
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutData.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Finalize sua conta
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Quase lá! Crie sua conta
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Preencha seus dados para criar sua conta e ativar seu site.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Account info */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-4">
              Dados da conta
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--platform-text)]/60">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                  placeholder="Seu nome completo"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--platform-text)]/60">
                  Email
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => handleChange("ownerEmail", e.target.value)}
                  placeholder="seu@email.com"
                  className={`mt-1 w-full rounded-lg border bg-white/[0.04] px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:outline-none ${
                    ownerEmail && !emailValid.valid
                      ? "border-red-400/50 focus:border-red-400"
                      : "border-white/10 focus:border-[#22D3EE]"
                  }`}
                />
                {ownerEmail && !emailValid.valid && (
                  <p className="mt-1 text-xs text-red-400">{emailValid.error}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--platform-text)]/60">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={ownerPassword}
                    onChange={(e) => handleChange("ownerPassword", e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`mt-1 w-full rounded-lg border bg-white/[0.04] px-4 py-3 pr-12 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:outline-none ${
                      ownerPassword && !passwordValid.valid
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-white/10 focus:border-[#22D3EE]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {ownerPassword && !passwordValid.valid && (
                  <p className="mt-1 text-xs text-red-400">{passwordValid.errors.join(", ")}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--platform-text)]/60">
                  CPF ou CNPJ
                  <span className="ml-1 text-[var(--platform-text)]/40">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={ownerDocument || ""}
                  onChange={(e) => handleChange("ownerDocument", e.target.value)}
                  placeholder="000.000.000-00"
                  className={`mt-1 w-full rounded-lg border bg-white/[0.04] px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:outline-none ${
                    ownerDocument && !documentValid.valid
                      ? "border-red-400/50 focus:border-red-400"
                      : "border-white/10 focus:border-[#22D3EE]"
                  }`}
                />
                {ownerDocument && !documentValid.valid && "error" in documentValid && (
                  <p className="mt-1 text-xs text-red-400">{documentValid.error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                  acceptTerms
                    ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B1020]"
                    : "border-white/20"
                }`}
              >
                {acceptTerms && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-sm text-[var(--platform-text)]/70">
                Concordo com os{" "}
                <a href="/termos" className="text-[#22D3EE] hover:underline">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="/privacidade" className="text-[#22D3EE] hover:underline">
                  Política de Privacidade
                </a>
              </span>
            </label>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-400/30 bg-red-400/10 p-4"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-white/10 bg-[#12182B] p-5">
            <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-4">
              Resumo do pedido
            </h3>

            {/* Plan */}
            {plan && (
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {selectedPlan === "premium-full" && (
                    <Sparkles size={14} className="text-[#A78BFA]" />
                  )}
                  <span className="text-sm text-[var(--platform-text)]">{plan.name}</span>
                </div>
                <span className="text-sm font-medium text-[var(--platform-text)]">
                  {plan.price}
                </span>
              </div>
            )}

            {/* Addons */}
            {addonsSelected.length > 0 && selectedPlan !== "premium-full" && (
              <div className="py-3 border-b border-white/10 space-y-2">
                {addonsSelected.map((addonId) => {
                  const addon = ADDON_DEFINITIONS.find((a) => a.id === addonId);
                  if (!addon) return null;
                  return (
                    <div key={addonId} className="flex items-center justify-between">
                      <span className="text-xs text-[var(--platform-text)]/70">
                        + {addon.name}
                      </span>
                      <span className="text-xs text-[var(--platform-text)]/70">
                        {formatPrice(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-[var(--platform-text)]/60">Total mensal</span>
              <span className="text-xl font-bold bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                {formatPrice(monthlyTotal)}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold transition ${
                canSubmit && !isSubmitting
                  ? "bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] text-white hover:brightness-110"
                  : "bg-white/10 text-[var(--platform-text)]/30 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Continuar para pagamento
                </>
              )}
            </button>

            {/* Security badges */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-[var(--platform-text)]/40">
                <Lock size={12} />
                <span className="text-xs">SSL Seguro</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--platform-text)]/40">
                <ShieldCheck size={12} />
                <span className="text-xs">Stripe</span>
              </div>
            </div>
          </div>

          {/* Site preview */}
          <div className="mt-4 rounded-xl border border-white/10 bg-[#12182B]/60 p-4">
            <p className="text-xs text-[var(--platform-text)]/50 mb-2">Seu site:</p>
            <p className="font-mono text-sm text-[#22D3EE]">
              {preferredSubdomain || "seusite"}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
            </p>
            <p className="mt-1 text-xs text-[var(--platform-text)]/40">
              {businessName || "Seu negócio"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation (back only) */}
      <StepNavigation canProceed={false} hideNext />
    </div>
  );
}
