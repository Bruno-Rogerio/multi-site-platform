"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Check, X, Loader2, AlertCircle } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { validateSubdomain } from "@/lib/onboarding/validation";

const segments = [
  { id: "psicologia", label: "Psicologia" },
  { id: "coaching", label: "Coaching" },
  { id: "terapia", label: "Terapia" },
  { id: "nutricao", label: "Nutrição" },
  { id: "personal", label: "Personal Trainer" },
  { id: "advocacia", label: "Advocacia" },
  { id: "consultoria", label: "Consultoria" },
  { id: "educacao", label: "Educação" },
  { id: "saude", label: "Saúde" },
  { id: "fotografia", label: "Fotografia" },
  { id: "design", label: "Design" },
  { id: "outro", label: "Outro" },
];

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
      setMessage("Erro ao verificar disponibilidade");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSubdomain(subdomain);
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain, checkSubdomain]);

  return { status, message };
}

export function BusinessInfoStep() {
  const { state, dispatch } = useWizard();
  const { businessName, businessSegment, preferredSubdomain, businessHighlights } = state;

  const { status: subdomainStatus, message: subdomainMessage } = useSubdomainCheck(
    preferredSubdomain
  );

  function handleChange(field: string, value: string) {
    dispatch({ type: "SET_BUSINESS_FIELD", key: field, value });
  }

  const canProceed =
    businessName.length >= 2 &&
    businessSegment.length > 0 &&
    subdomainStatus === "available";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Seu negócio
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Informações do seu negócio
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Esses dados serão usados para configurar seu site e aparecerão para seus visitantes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Business name */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/20">
              <Building2 size={16} className="text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Nome do negócio
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                O nome que aparecerá no cabeçalho do site
              </p>
            </div>
          </div>

          <input
            type="text"
            value={businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            placeholder="Ex: Dra. Ana Silva - Psicologia"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
          />
        </div>

        {/* Segment */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            Área de atuação
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            Selecione o segmento que melhor descreve seu trabalho
          </p>

          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => handleChange("businessSegment", segment.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  businessSegment === segment.id
                    ? "border-[#22D3EE]/50 bg-[#22D3EE]/20 text-[#22D3EE]"
                    : "border-white/10 bg-white/[0.02] text-[var(--platform-text)]/70 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subdomain */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22D3EE]/20">
              <Globe size={16} className="text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Endereço do seu site
              </h3>
              <p className="text-xs text-[var(--platform-text)]/50">
                Escolha um nome único para seu subdomínio
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] overflow-hidden focus-within:border-[#22D3EE]">
              <input
                type="text"
                value={preferredSubdomain}
                onChange={(e) => handleChange("preferredSubdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="seunome"
                className="flex-1 bg-transparent px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:outline-none"
              />
              <span className="px-4 text-sm text-[var(--platform-text)]/50 bg-white/[0.02] border-l border-white/10 py-3">
                .{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
              </span>
            </div>

            {/* Status indicator */}
            {preferredSubdomain && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-36 top-1/2 -translate-y-1/2"
              >
                {subdomainStatus === "checking" && (
                  <Loader2 size={18} className="animate-spin text-[var(--platform-text)]/50" />
                )}
                {subdomainStatus === "available" && (
                  <Check size={18} className="text-green-400" />
                )}
                {subdomainStatus === "taken" && (
                  <X size={18} className="text-red-400" />
                )}
                {subdomainStatus === "invalid" && (
                  <AlertCircle size={18} className="text-yellow-400" />
                )}
              </motion.div>
            )}
          </div>

          {/* Status message */}
          {subdomainMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-xs ${
                subdomainStatus === "available"
                  ? "text-green-400"
                  : subdomainStatus === "taken"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {subdomainMessage}
            </motion.p>
          )}

          {/* Subdomain preview */}
          {preferredSubdomain && subdomainStatus === "available" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/10 p-3"
            >
              <p className="text-xs text-[var(--platform-text)]/60">Seu site estará disponível em:</p>
              <p className="mt-1 font-mono text-sm text-[#22D3EE]">
                https://{preferredSubdomain}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Tagline (optional) */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)] mb-1">
            Slogan ou frase de impacto
            <span className="ml-2 text-xs font-normal text-[var(--platform-text)]/40">(opcional)</span>
          </h3>
          <p className="text-xs text-[var(--platform-text)]/50 mb-4">
            Uma frase curta que resume o que você faz
          </p>

          <input
            type="text"
            value={businessHighlights || ""}
            onChange={(e) => handleChange("businessHighlights", e.target.value)}
            placeholder="Ex: Transformando vidas através do autoconhecimento"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={canProceed} />
    </div>
  );
}
