"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, Globe, ExternalLink, Clock, CheckCircle2, ChevronRight, Sparkles,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { PLAN_PRICE_IDS } from "@/lib/onboarding/plans";
import { formatPrice } from "@/lib/onboarding/pricing";

function resolveRootDomain(): string {
  return process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 25);
}

type Phase = "summary" | "creating" | "ready";

export function FinalizeStep() {
  const { state, dispatch, monthlyTotal } = useWizard();
  const {
    selectedPlan, businessName, businessSegment, preferredSubdomain,
    ownerEmail, selectedTemplateSlug, paletteId, customColors,
    fontFamily, heroVariant, servicesVariant, ctaVariant, motionStyle,
    headerStyle, dividerStyle, buttonStyle, content, serviceCards,
    heroImage, logoUrl, addonsSelected, ctaConfig, selectedCtaTypes,
    contactSelectedLinks,
  } = state;

  const [phase, setPhase] = useState<Phase>("summary");
  const [previewUrl, setPreviewUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [finalSubdomain, setFinalSubdomain] = useState(preferredSubdomain);
  const [error, setError] = useState<string | null>(null);

  const planLabel =
    selectedPlan === "basico" ? "Básico" :
    selectedPlan === "construir" ? "Construir" : "Premium Full";

  const planPrice = formatPrice(monthlyTotal);

  function deriveCreationMode(): "template" | "builder" | "builder-premium" {
    if (selectedPlan === "basico") return "template";
    if (selectedPlan === "premium-full") return "builder-premium";
    return "builder";
  }

  async function handleCreateDemo() {
    if (phase !== "summary") return;
    setPhase("creating");
    setError(null);

    const mergedContent = {
      ...content,
      servicesItems: serviceCards
        .map((c) => c.title)
        .filter((t) => t?.trim())
        .join("\n"),
      serviceCardsJson: JSON.stringify(
        serviceCards.map((c) => ({
          title: c.title || "",
          description: c.description || "",
          iconName: c.iconName || c.icon || "",
          imageUrl: c.imageUrl || "",
        }))
      ),
      contactSelectedLinks: JSON.stringify(contactSelectedLinks),
    };

    const subdomain = preferredSubdomain || slugFromName(businessName);

    const draftPayload = {
      creationMode: deriveCreationMode(),
      siteStyle: paletteId,
      paletteId,
      customColors,
      fontFamily,
      headerStyle,
      dividerStyle,
      heroStyle: heroVariant,
      servicesStyle: servicesVariant,
      ctaStyle: ctaVariant,
      motionStyle,
      buttonStyle,
      addonsSelected,
      businessName,
      businessSegment,
      preferredSubdomain: subdomain,
      selectedPlan: selectedPlan ?? "",
      ownerEmail,
      content: mergedContent,
      heroImage,
      logoUrl,
      ctaConfig,
      selectedCtaTypes,
    };

    try {
      const res = await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar demonstração.");
        setPhase("summary");
        return;
      }

      const rootDomain = resolveRootDomain();
      const domainUsed = data.domain || `${subdomain}.${rootDomain}`;
      const url = `https://${domainUsed}`;

      setSiteId(data.siteId);
      setFinalSubdomain(domainUsed.split(".")[0]);
      setPreviewUrl(url);

      dispatch({ type: "SET_DRAFT", siteId: data.siteId, url });
      setPhase("ready");
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setPhase("summary");
    }
  }

  if (phase === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-lg"
      >
        {/* Success header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#EAF0FF]">Seu site está no ar!</h1>
          <p className="mt-1.5 text-sm text-[#EAF0FF]/60">
            Você tem <strong className="text-[#22D3EE]">48 horas</strong> para publicar antes de expirar.
          </p>
        </div>

        {/* Preview URL card */}
        <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Endereço da demonstração
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 truncate rounded-lg bg-[#0B1020]/60 px-3 py-2 text-sm text-[#22D3EE]">
              {previewUrl}
            </code>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
            >
              <ExternalLink size={13} />
              Abrir
            </a>
          </div>

          {/* Timer info */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#EAF0FF]/40">
            <Clock size={11} />
            <span>Demonstração gratuita — expira em 48 horas. O site mostrará um timer para o visitante.</span>
          </div>
        </div>

        {/* Next step */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="mb-3 text-sm font-semibold text-[#EAF0FF]">Pronto para publicar?</p>
          <p className="mb-4 text-xs text-[#EAF0FF]/50">
            Acesse a demonstração e clique em <strong className="text-[#EAF0FF]/80">"Publicar meu site"</strong> no banner do topo,
            ou clique abaixo para ir direto ao pagamento.
          </p>
          <a
            href={`/publicar/${siteId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            <Sparkles size={15} />
            Publicar meu site — {planPrice}/mês
            <ChevronRight size={15} />
          </a>
        </div>
      </motion.div>
    );
  }

  // Summary / creating phase
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-lg"
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Quase lá
        </p>
        <h1 className="mt-2 text-2xl font-black text-[#EAF0FF]">
          Confirme e crie sua demonstração
        </h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/60">
          Veja seu site online em segundos — sem precisar pagar agora.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-5 space-y-2">
        <SummaryRow label="Negócio" value={businessName || "—"} />
        <SummaryRow label="Subdomínio" value={
          preferredSubdomain ? `${preferredSubdomain}.${resolveRootDomain()}` : `auto-gerado`
        } />
        <SummaryRow label="Plano" value={`${planLabel} — ${planPrice}/mês`} />
        {selectedTemplateSlug && <SummaryRow label="Template" value={selectedTemplateSlug} />}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Create button */}
      <button
        onClick={handleCreateDemo}
        disabled={phase === "creating"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-4 text-sm font-bold text-[#0B1020] transition hover:bg-[#06B6D4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {phase === "creating" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Criando seu site...
          </>
        ) : (
          <>
            <Globe size={16} />
            Criar demonstração gratuita
            <ChevronRight size={15} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-[#EAF0FF]/30">
        Nenhum pagamento necessário agora. Você tem 48h para ver e publicar.
      </p>
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5">
      <span className="text-xs text-[#EAF0FF]/50">{label}</span>
      <span className="text-xs font-medium text-[#EAF0FF]">{value}</span>
    </div>
  );
}
