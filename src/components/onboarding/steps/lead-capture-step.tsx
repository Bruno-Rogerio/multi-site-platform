"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Building2, Globe, ChevronRight, Check, X, Loader2 } from "lucide-react";
import { useWizard } from "../wizard-context";
import { validateEmail } from "@/lib/onboarding/validation";
import { validateSubdomain } from "@/lib/onboarding/validation";
import { BUSINESS_TYPES, getTemplateForBusinessType, getDefaultContentForBusinessType } from "@/lib/onboarding/business-types";

type SubdomainStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function useSubdomainCheck(subdomain: string) {
  const [status, setStatus] = useState<SubdomainStatus>("idle");
  const [message, setMessage] = useState("");

  const checkSubdomain = useCallback(async (value: string) => {
    if (!value) {
      setStatus("idle");
      setMessage("");
      return;
    }

    const validation = validateSubdomain(value);
    if (!validation.valid) {
      setStatus("invalid");
      setMessage(validation.error || "Subdomínio inválido");
      return;
    }

    setStatus("checking");
    setMessage("");

    try {
      const res = await fetch(`/api/onboarding/check-subdomain?subdomain=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.available) {
        setStatus("available");
        setMessage("Disponível!");
      } else {
        setStatus("taken");
        setMessage(data.error || "Este subdomínio já está em uso");
      }
    } catch {
      setStatus("invalid");
      setMessage("Erro ao verificar subdomínio");
    }
  }, []);

  useEffect(() => {
    if (!subdomain) {
      setStatus("idle");
      setMessage("");
      return;
    }

    const timeout = setTimeout(() => checkSubdomain(subdomain), 500);
    return () => clearTimeout(timeout);
  }, [subdomain, checkSubdomain]);

  return { status, message };
}

export function LeadCaptureStep() {
  const { state, dispatch } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = state.ownerEmail;
  const businessName = state.businessName;
  const businessType = state.businessSegment;
  const subdomain = state.preferredSubdomain;

  const { status: subdomainStatus, message: subdomainMessage } = useSubdomainCheck(subdomain);

  const emailValidation = email ? validateEmail(email) : { valid: false };

  const canSubmit =
    emailValidation.valid &&
    businessName.trim().length >= 2 &&
    businessType.length > 0 &&
    (subdomainStatus === "available" || subdomainStatus === "idle" || !subdomain);

  function handleField(key: string, value: string) {
    dispatch({ type: "SET_BUSINESS_FIELD", key, value });
  }

  function handleEmail(value: string) {
    dispatch({ type: "SET_CHECKOUT_FIELD", key: "ownerEmail", value });
  }

  function handleSubdomain(value: string) {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
    handleField("preferredSubdomain", clean);
  }

  async function handleContinue() {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          businessName: businessName.trim(),
          businessType,
          subdomain: subdomain || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Erro ao salvar dados. Tente novamente.");
        return;
      }

      // Save lead ID
      dispatch({ type: "SET_LEAD_ID", leadId: data.leadId });

      // Pre-select template based on business type
      const templateSlug = getTemplateForBusinessType(businessType);
      dispatch({ type: "SELECT_TEMPLATE", slug: templateSlug });

      // Pre-fill default content for the business type
      const defaultContent = getDefaultContentForBusinessType(businessType);
      for (const [key, value] of Object.entries(defaultContent)) {
        dispatch({ type: "UPDATE_CONTENT", key, value });
      }

      dispatch({ type: "NEXT_STEP" });
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-lg px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#EAF0FF]">Vamos começar</h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/60">
          Antes de montar seu site, precisamos de algumas informações básicas.
        </p>
      </div>

      <div className="space-y-5">
        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            <Mail size={12} />
            Seu melhor e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmail(e.target.value)}
            placeholder="voce@email.com"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
          />
          {email && !emailValidation.valid && (
            <p className="mt-1 text-xs text-red-400">Informe um e-mail válido</p>
          )}
        </div>

        {/* Business name */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            <Building2 size={12} />
            Nome do negócio
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => handleField("businessName", e.target.value)}
            placeholder="Ex: Clínica Bem Viver"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
          />
        </div>

        {/* Business type */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            Tipo de negócio
          </label>
          <select
            value={businessType}
            onChange={(e) => handleField("businessSegment", e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-[#EAF0FF] outline-none transition focus:border-[#3B82F6]/60"
          >
            <option value="" className="bg-[#0B1020] text-white/40">Selecione seu segmento...</option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.id} value={bt.id} className="bg-[#0B1020]">
                {bt.label}
              </option>
            ))}
          </select>
          {businessType && (
            <p className="mt-1.5 text-xs text-[#22D3EE]/70">
              Vamos sugerir o melhor layout para o seu tipo de negócio.
            </p>
          )}
        </div>

        {/* Subdomain */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            <Globe size={12} />
            Subdomínio desejado
            <span className="text-[#EAF0FF]/30 normal-case tracking-normal font-normal">(opcional)</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={subdomain}
              onChange={(e) => handleSubdomain(e.target.value)}
              placeholder="meu-negocio"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-4 pr-32 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
            />
            <span className="pointer-events-none absolute right-3 text-xs text-[#EAF0FF]/30">
              .bsph.com.br
            </span>
          </div>
          {subdomain && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {subdomainStatus === "checking" && (
                <Loader2 size={11} className="animate-spin text-[#EAF0FF]/40" />
              )}
              {subdomainStatus === "available" && (
                <Check size={11} className="text-emerald-400" />
              )}
              {(subdomainStatus === "taken" || subdomainStatus === "invalid") && (
                <X size={11} className="text-red-400" />
              )}
              <span
                className={`text-xs ${
                  subdomainStatus === "available"
                    ? "text-emerald-400"
                    : subdomainStatus === "taken" || subdomainStatus === "invalid"
                    ? "text-red-400"
                    : "text-[#EAF0FF]/40"
                }`}
              >
                {subdomainStatus === "checking" ? "Verificando..." : subdomainMessage}
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleContinue}
          disabled={!canSubmit || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              Continuar
              <ChevronRight size={16} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#EAF0FF]/25">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </motion.div>
  );
}
